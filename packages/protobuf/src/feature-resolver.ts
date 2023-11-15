// Copyright 2021-2023 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Edition,
  FeatureSet,
  FeatureSetDefaults,
  FeatureSetDefaults_FeatureSetEditionDefault,
} from "./google/protobuf/descriptor_pb";
import type { DescExtension, DescMessage } from "./descriptor-set.js";
import type { AnyMessage } from "./message.js";
import {
  parseTextFormatEnumValue,
  parseTextFormatScalarValue,
} from "./private/text-format.js";

/**
 * A rough implementation of the edition feature resolution. Does not support
 * extensions.
 *
 * See https://github.com/protocolbuffers/protobuf/blob/main/docs/design/editions/protobuf-editions-design-features.md#specification-of-an-edition
 *
 * @private experimental, API may change drastically
 */
export class FeatureResolver {
  static compileDefaults(
    minimumEdition: Edition,
    maximumEdition: Edition,
    descFeatureSet: DescMessage,
    ...descExtensions: DescExtension[]
  ): FeatureSetDefaults {
    if (minimumEdition > maximumEdition) {
      throw new Error(
        `Invalid edition range, edition ${Edition[minimumEdition]} is newer than edition ${Edition[maximumEdition]}.`,
      );
    }
    validateFeatureSetDescriptor(descFeatureSet);

    // Collect all the editions with unique defaults.
    const collector = new EditionCollector(minimumEdition, maximumEdition);
    collector.add(descFeatureSet);
    for (const extension of descExtensions) {
      validateExtension(extension);
      collector.add(extension.message);
    }
    const editions = collector.get();

    const defaults = new FeatureSetDefaults({
      minimumEdition,
      maximumEdition,
    });
    for (const edition of editions) {
      defaults.defaults.push(
        new FeatureSetDefaults_FeatureSetEditionDefault({
          edition,
          features: fillDefaults(edition, descFeatureSet, ...descExtensions),
        }),
      );
    }
    return defaults;
  }

  static create(
    edition: Edition,
    compiledFeatureSetDefaults: FeatureSetDefaults,
  ): FeatureResolver {
    const minimumEdition = compiledFeatureSetDefaults.minimumEdition ?? 0;
    const maximumEdition = compiledFeatureSetDefaults.maximumEdition ?? 0;
    if (edition < minimumEdition) {
      throw new Error(
        `Edition ${Edition[edition]} is earlier than the minimum supported edition ${Edition[minimumEdition]}`,
      );
    }
    if (maximumEdition < edition) {
      throw new Error(
        `Edition ${Edition[edition]} is later than the maximum supported edition ${Edition[maximumEdition]}`,
      );
    }
    let prevEdition = Edition.EDITION_UNKNOWN;
    for (const editionDefault of compiledFeatureSetDefaults.defaults) {
      const editionDefaultEdition = editionDefault.edition ?? 0;
      if (editionDefaultEdition === Edition.EDITION_UNKNOWN) {
        throw new Error(
          `Invalid edition ${Edition[editionDefaultEdition]} specified.`,
        );
      }
      if (prevEdition !== Edition.EDITION_UNKNOWN) {
        if (editionDefaultEdition <= prevEdition) {
          throw new Error(
            `Feature set defaults are not strictly increasing. Edition ${
              Edition[prevEdition]
            } is greater than or equal to edition ${
              Edition[editionDefault.edition ?? 0]
            }.`,
          );
        }
      }
      validateMergedFeatures(editionDefault.features ?? new FeatureSet());
      prevEdition = editionDefaultEdition;
    }
    const highestMatch = findHighestMatchingEdition(
      edition,
      compiledFeatureSetDefaults.defaults,
    );
    if (highestMatch?.features === undefined) {
      throw new Error(`No valid default found for edition ${Edition[edition]}`);
    }
    return new FeatureResolver(highestMatch.features);
  }

  private constructor(private readonly defaults: FeatureSet) {}

  mergeFeatures(
    mergedParent: FeatureSet,
    unmergedChild: FeatureSet,
  ): FeatureSet {
    const features = new FeatureSet();
    features.fromBinary(this.defaults.toBinary());
    features.fromBinary(mergedParent.toBinary());
    features.fromBinary(unmergedChild.toBinary());
    validateMergedFeatures(features);
    return features;
  }
}

class EditionCollector {
  private readonly set = new Set<Edition>();

  constructor(
    private readonly minimumEdition: Edition,
    private readonly maximumEdition: Edition,
  ) {}

  add(descMessage: DescMessage) {
    for (const field of descMessage.fields) {
      const def = field.proto.options?.editionDefaults;
      if (def === undefined) {
        continue;
      }
      for (const { edition } of def) {
        if (edition === undefined) {
          continue;
        }
        if (this.maximumEdition < edition) {
          continue;
        }
        this.set.add(edition);
      }
    }
  }

  get() {
    const editions = Array.from(this.set.values()).sort((a, b) => a - b);
    if (editions.length == 0 || editions[0] > this.minimumEdition) {
      // Always insert the minimum edition to make sure the full range is covered
      // in valid defaults.
      editions.unshift(this.minimumEdition);
    }
    return editions;
  }
}

function fillDefaults(
  edition: Edition,
  descFeatureSet: DescMessage,
  ...descExtensions: DescExtension[] // eslint-disable-line @typescript-eslint/no-unused-vars -- TODO extensions
): FeatureSet {
  const featureSet = new FeatureSet();
  for (const field of descFeatureSet.fields) {
    const fieldLocalName = FeatureSet.fields.find(field.number)?.localName;
    if (fieldLocalName === undefined) {
      throw new Error(
        `Cannot find local name for feature field ${field.parent.typeName}.${field.name}`,
      );
    }
    const highestMatch = findHighestMatchingEdition(
      edition,
      field.proto.options?.editionDefaults.concat() ?? [],
    );
    if (highestMatch === undefined) {
      throw new Error(
        `No valid default found for edition ${Edition[edition]} in feature field ${field.parent.typeName}.${field.name}`,
      );
    }
    let value: unknown;
    switch (field.fieldKind) {
      case "message":
        throw new Error(
          `Cannot parse default value for edition ${Edition[edition]} in feature field ${field.parent.typeName}.${field.name}. Text format for messages is not implemented.`,
        );
      case "scalar":
        value = parseTextFormatScalarValue(
          field.scalar,
          highestMatch.value ?? "",
        );
        break;
      case "enum":
        value = parseTextFormatEnumValue(field.enum, highestMatch.value ?? "");
        break;
      case "map":
        throw new Error(
          `Cannot parse default value for edition ${Edition[edition]} in feature field ${field.parent.typeName}.${field.name}. Map field is unexpected.`,
        );
    }
    (featureSet as AnyMessage)[fieldLocalName] = value;
  }
  return featureSet;
}

function validateFeatureSetDescriptor(descFeatureSet: DescMessage) {
  if (descFeatureSet.oneofs.length > 0) {
    throw new Error(
      `Type ${descFeatureSet.typeName} contains unsupported oneof feature fields.`,
    );
  }
  for (const field of descFeatureSet.fields) {
    if (!field.optional) {
      throw new Error(
        `Feature field ${field.parent.typeName}.${field.name} is an unsupported required field.`,
      );
    }
    if (field.repeated) {
      throw new Error(
        `Feature field ${field.parent.typeName}.${field.name} is an unsupported repeated field.`,
      );
    }
    if ((field.proto.options?.targets.length ?? 0) === 0) {
      throw new Error(
        `Feature field ${field.parent.typeName}.${field.name} has no target specified.`,
      );
    }
  }
}

function validateExtension(
  descExtension: DescExtension,
): asserts descExtension is DescExtension & { fieldKind: "message" } {
  if (descExtension.fieldKind !== "message") {
    throw new Error(
      `Extension ${descExtension.typeName} is not of message type. Feature extensions should always use messages to allow for evolution.`,
    );
  }
  if (descExtension.message.typeName !== FeatureSet.typeName) {
    throw new Error(
      `Extension ${descExtension.typeName} is not an extension of ${FeatureSet.typeName}.`,
    );
  }
  if (descExtension.repeated) {
    throw new Error(
      `Only singular features extensions are supported. Found repeated extension ${descExtension.typeName}.`,
    );
  }
  if (
    descExtension.message.nestedExtensions.length > 0 ||
    descExtension.message.proto.extensionRange.length > 0
  ) {
    throw new Error(
      `Nested extensions in feature extension ${descExtension.typeName} are not supported.`,
    );
  }
}

function validateMergedFeatures(featureSet: FeatureSet) {
  function checkEnumFeature(
    fieldLocalName:
      | "fieldPresence"
      | "enumType"
      | "repeatedFieldEncoding"
      | "utf8Validation"
      | "messageEncoding"
      | "jsonFormat",
  ) {
    const value = featureSet[fieldLocalName] ?? 0;
    if (value === 0) {
      const field = featureSet
        .getType()
        .fields.list()
        .find((f) => f.localName === fieldLocalName);
      const fieldProtoName = field?.name ?? fieldLocalName;
      throw new Error(
        `Feature field ${
          featureSet.getType().typeName
        }.${fieldProtoName} must resolve to a known value.`,
      );
    }
  }

  checkEnumFeature("fieldPresence");
  checkEnumFeature("enumType");
  checkEnumFeature("repeatedFieldEncoding");
  checkEnumFeature("utf8Validation");
  checkEnumFeature("messageEncoding");
  checkEnumFeature("jsonFormat");
}

// Find latest edition in the given defaults that is earlier or equal to the given edition.
// See https://github.com/protocolbuffers/protobuf/blob/main/docs/design/editions/protobuf-editions-design-features.md#specification-of-an-edition
function findHighestMatchingEdition<
  T extends { edition?: Edition | undefined },
>(edition: Edition, defaults: T[]): T | undefined {
  const d = defaults
    .concat()
    .sort((a, b) => (a.edition ?? 0) - (b.edition ?? 0));
  let highestMatch: T | undefined = undefined;
  for (let i = d.length - 1; i >= 0; i--) {
    const c = d[i];
    if ((c.edition ?? 0) <= edition) {
      highestMatch = c;
      break;
    }
  }
  return highestMatch;
}
