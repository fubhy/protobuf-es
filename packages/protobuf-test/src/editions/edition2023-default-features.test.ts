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

import { describe, expect, test } from "@jest/globals";
import {
  createDescriptorSet,
  Edition,
  FeatureResolver,
  FeatureSet,
  FeatureSet_EnumType,
  FeatureSet_FieldPresence,
  FeatureSet_JsonFormat,
  FeatureSet_MessageEncoding,
  FeatureSet_RepeatedFieldEncoding,
  FeatureSet_Utf8Validation,
} from "@bufbuild/protobuf";
import { readFileSync } from "fs";
import assert from "node:assert";

describe("edition2023 default features", () => {
  const set = createDescriptorSet(readFileSync("./descriptorset.bin"));
  const descFeatureSet = set.messages.get(FeatureSet.typeName);
  assert(descFeatureSet !== undefined);
  const descFile = set.files.find(
    (f) => f.name === "editions/edition2023-default-features",
  );
  assert(descFile !== undefined);

  test("EditionsDefaultEnum", () => {
    const resolver = FeatureResolver.create(
      Edition.EDITION_2023,
      FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_2023,
        descFeatureSet,
      ),
    );
    const descEditionsDefaultEnum = set.enums.get("spec.EditionsDefaultEnum");
    assert(descEditionsDefaultEnum !== undefined);
    const fileFeatures = resolver.mergeFeatures(
      new FeatureSet(),
      descFile.proto.options?.features ?? new FeatureSet(),
    );
    expect(fileFeatures.enumType).toBe(FeatureSet_EnumType.OPEN);
    expect(fileFeatures.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
    const enumFeatures = resolver.mergeFeatures(
      fileFeatures,
      descEditionsDefaultEnum.proto.options?.features ?? new FeatureSet(),
    );
    expect(enumFeatures.enumType).toBe(FeatureSet_EnumType.OPEN);
    expect(enumFeatures.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
  });

  test("EditionsDefaultMessage", () => {
    const resolver = FeatureResolver.create(
      Edition.EDITION_2023,
      FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_2023,
        descFeatureSet,
      ),
    );
    const descEditionsDefaultMessage = set.messages.get(
      "spec.EditionsDefaultMessage",
    );
    assert(descEditionsDefaultMessage !== undefined);

    const fileFeatures = resolver.mergeFeatures(
      new FeatureSet(),
      descFile.proto.options?.features ?? new FeatureSet(),
    );
    const messageFeatures = resolver.mergeFeatures(
      fileFeatures,
      descEditionsDefaultMessage.proto.options?.features ?? new FeatureSet(),
    );
    expect(messageFeatures.fieldPresence).toBe(
      FeatureSet_FieldPresence.EXPLICIT,
    );
    expect(messageFeatures.repeatedFieldEncoding).toBe(
      FeatureSet_RepeatedFieldEncoding.PACKED,
    );
    expect(messageFeatures.utf8Validation).toBe(
      FeatureSet_Utf8Validation.VERIFY,
    );
    expect(messageFeatures.messageEncoding).toBe(
      FeatureSet_MessageEncoding.LENGTH_PREFIXED,
    );
    expect(messageFeatures.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);

    for (const descField of descEditionsDefaultMessage.fields) {
      const fieldFeatures = resolver.mergeFeatures(
        messageFeatures,
        descField.proto.options?.features ?? new FeatureSet(),
      );
      expect(fieldFeatures.fieldPresence).toBe(
        FeatureSet_FieldPresence.EXPLICIT,
      );
      expect(fieldFeatures.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.PACKED,
      );
      expect(fieldFeatures.utf8Validation).toBe(
        FeatureSet_Utf8Validation.VERIFY,
      );
      expect(fieldFeatures.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
      expect(messageFeatures.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
    }
  });
});
