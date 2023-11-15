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
import type {
  AnyMessage,
  DescExtension,
  DescMessage,
} from "@bufbuild/protobuf";
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
  FeatureSetDefaults,
} from "@bufbuild/protobuf";
import { readFileSync } from "fs";
import assert from "node:assert";

describe("FeatureResolver", function () {
  const set = createDescriptorSet(readFileSync("./descriptorset.bin"));
  const descFeatureSet = set.messages.get(FeatureSet.typeName);
  assert(descFeatureSet !== undefined);

  describe("default features", () => {
    const featureSetDefaults = FeatureResolver.compileDefaults(
      Edition.EDITION_PROTO2,
      Edition.EDITION_2023,
      descFeatureSet,
    );
    test("EDITION_PROTO2", () => {
      const { edition, features } = featureSetDefaults.defaults[0];
      expect(edition).toBe(Edition.EDITION_PROTO2);
      const f = features ?? new FeatureSet();
      expect(f.fieldPresence).toBe(FeatureSet_FieldPresence.EXPLICIT);
      expect(f.enumType).toBe(FeatureSet_EnumType.CLOSED);
      expect(f.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.EXPANDED,
      );
      expect(f.utf8Validation).toBe(FeatureSet_Utf8Validation.NONE);
      expect(f.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
      expect(f.jsonFormat).toBe(FeatureSet_JsonFormat.LEGACY_BEST_EFFORT);
    });
    test("EDITION_PROTO3", () => {
      const { edition, features } = featureSetDefaults.defaults[1];
      expect(edition).toBe(Edition.EDITION_PROTO3);
      const f = features ?? new FeatureSet();
      expect(f.fieldPresence).toBe(FeatureSet_FieldPresence.IMPLICIT);
      expect(f.enumType).toBe(FeatureSet_EnumType.OPEN);
      expect(f.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.PACKED,
      );
      expect(f.utf8Validation).toBe(FeatureSet_Utf8Validation.VERIFY);
      expect(f.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
      expect(f.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
    });
    test("EDITION_2023", () => {
      const { edition, features } = featureSetDefaults.defaults[2];
      expect(edition).toBe(Edition.EDITION_2023);
      const f = features ?? new FeatureSet();
      expect(f.fieldPresence).toBe(FeatureSet_FieldPresence.EXPLICIT);
      expect(f.enumType).toBe(FeatureSet_EnumType.OPEN);
      expect(f.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.PACKED,
      );
      expect(f.utf8Validation).toBe(FeatureSet_Utf8Validation.VERIFY);
      expect(f.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
      expect(f.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
    });
  });

  // Tests ported from https://github.com/protocolbuffers/protobuf/blob/65cdac4ac5631163d0ffe08957838c754155750d/src/google/protobuf/feature_resolver_test.cc
  //
  // Not ported because we do not support extensions:
  // - DefaultsTest2023
  // - DefaultsTestMessageExtension
  // - DefaultsTestNestedExtension
  // - DefaultsGeneratedPoolCustom
  // - DefaultsFarFuture
  // - DefaultsMiddleEdition
  // - DefaultsMessageMerge
  // - CompileDefaultsInvalidExtension
  // - MergeFeaturesChildOverrideComplex
  // - MergeFeaturesParentOverrides
  // - MergeFeaturesExtensionEnumUnknown
  // - CompileDefaultsInvalidNonMessage
  // - CompileDefaultsInvalidRepeated
  // - CompileDefaultsInvalidWithExtensions
  // - CompileDefaultsInvalidWithOneof
  // - CompileDefaultsInvalidWithRequired
  // - CompileDefaultsInvalidWithRepeated
  // - CompileDefaultsInvalidWithMissingTarget
  // - CompileDefaultsInvalidDefaultsMessageParsingError
  // - CompileDefaultsInvalidDefaultsMessageParsingErrorMerged
  // - CompileDefaultsInvalidDefaultsMessageParsingErrorSkipped
  // - CompileDefaultsInvalidDefaultsScalarParsingError
  // - CompileDefaultsInvalidDefaultsScalarParsingErrorSkipped
  // - CompileDefaultsInvalidDefaultsTooEarly
  // - CompileDefaultsMinimumTooEarly
  // - CompileDefaultsMinimumCovered
  //
  // Not ported because scenario does not apply:
  // - CompileDefaultsMissingDescriptor
  // - CompileDefaultsMissingExtension
  describe("ported tests", () => {
    function getDefaults(
      edition: Edition,
      compiledFeatureSetDefaults: FeatureSetDefaults,
    ): FeatureSet;
    function getDefaults(
      edition: Edition,
      descFeatureSet: DescMessage,
      ...descExtensions: DescExtension[]
    ): FeatureSet;
    function getDefaults(edition: Edition, ...rest: unknown[]) {
      if (rest[0] instanceof FeatureSetDefaults) {
        const compiledFeatureSetDefaults = rest[0];
        const resolver = FeatureResolver.create(
          edition,
          compiledFeatureSetDefaults,
        );
        return resolver.mergeFeatures(new FeatureSet(), new FeatureSet());
      } else {
        const descFeatureSet = rest[0] as DescMessage;
        const descExtensions = rest.slice(1) as DescExtension[];
        const compiledFeatureSetDefaults = FeatureResolver.compileDefaults(
          Edition.EDITION_2023,
          Edition.EDITION_99999_TEST_ONLY,
          descFeatureSet,
          ...descExtensions,
        );
        return getDefaults(edition, compiledFeatureSetDefaults);
      }
    }

    function setupFeatureResolver(
      edition: Edition,
      descFeatureSet: DescMessage,
      ...descExtensions: DescExtension[]
    ) {
      const defaults = FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_99997_TEST_ONLY,
        descFeatureSet,
        ...descExtensions,
      );
      return FeatureResolver.create(edition, defaults);
    }

    test("DefaultsCore2023", function () {
      const merged = getDefaults(Edition.EDITION_2023, descFeatureSet);
      expect(merged.fieldPresence).toBe(FeatureSet_FieldPresence.EXPLICIT);
      expect(merged.enumType).toBe(FeatureSet_EnumType.OPEN);
      expect(merged.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.PACKED,
      );
      expect(merged.utf8Validation).toBe(FeatureSet_Utf8Validation.VERIFY);
      expect(merged.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
      expect(merged.jsonFormat).toBe(FeatureSet_JsonFormat.ALLOW);
    });
    test("CreateFromUnsortedDefaults", () => {
      const featureSetDefaults = FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_99999_TEST_ONLY,
        descFeatureSet,
      );
      // swap elements 0 and 1
      const [d0, d1, ...drest] = featureSetDefaults.defaults;
      featureSetDefaults.defaults = [d1, d0, ...drest];
      expect(() =>
        FeatureResolver.create(Edition.EDITION_2023, featureSetDefaults),
      ).toThrowError(
        "Feature set defaults are not strictly increasing. Edition EDITION_PROTO3 is greater than or equal to edition EDITION_PROTO2.",
      );
    });
    test("CreateUnknownEdition", () => {
      const featureSetDefaults = new FeatureSetDefaults({
        minimumEdition: Edition.EDITION_UNKNOWN,
        maximumEdition: Edition.EDITION_99999_TEST_ONLY,
        defaults: [{ edition: Edition.EDITION_UNKNOWN, features: {} }],
      });
      expect(() =>
        FeatureResolver.create(Edition.EDITION_2023, featureSetDefaults),
      ).toThrowError("Invalid edition EDITION_UNKNOWN specified.");
    });
    test("CreateMissingEdition", () => {
      const featureSetDefaults = new FeatureSetDefaults({
        minimumEdition: Edition.EDITION_UNKNOWN,
        maximumEdition: Edition.EDITION_99999_TEST_ONLY,
        defaults: [{ features: {} }],
      });
      expect(() =>
        FeatureResolver.create(Edition.EDITION_2023, featureSetDefaults),
      ).toThrowError("Invalid edition EDITION_UNKNOWN specified.");
    });
    test("CreateUnknownEnumFeature", () => {
      const validDefaults = FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_2023,
        descFeatureSet,
      );

      // Use reflection to walk through every feature field
      for (const field of descFeatureSet.fields) {
        const fieldLocalName = FeatureSet.fields.find(field.number)?.localName;
        if (fieldLocalName === undefined) {
          continue;
        }
        const defaults = validDefaults.clone();
        if (defaults.defaults.length === 0) {
          continue;
        }
        const features = defaults.defaults[0].features;
        if (features === undefined) {
          continue;
        }
        // Clear the feature, which should be invalid
        (features as AnyMessage)[fieldLocalName] = undefined;
        expect(() =>
          FeatureResolver.create(Edition.EDITION_2023, defaults),
        ).toThrow(
          /Feature field google\.protobuf\.FeatureSet\..+ must resolve to a known value\./,
        );
        // Also test zero-value
        (features as AnyMessage)[fieldLocalName] = 0;
        expect(() =>
          FeatureResolver.create(Edition.EDITION_2023, defaults),
        ).toThrow(
          /Feature field google\.protobuf\.FeatureSet\..+ must resolve to a known value\./,
        );
      }
    });
    test("CompileDefaultsMinimumLaterThanMaximum", () => {
      expect(() =>
        FeatureResolver.compileDefaults(
          Edition.EDITION_99999_TEST_ONLY,
          Edition.EDITION_2023,
          descFeatureSet,
        ),
      ).toThrowError(
        "Invalid edition range, edition EDITION_99999_TEST_ONLY is newer than edition EDITION_2023.",
      );
    });
    test("MergeFeaturesChildOverrideCore", () => {
      const resolver = setupFeatureResolver(
        Edition.EDITION_2023,
        descFeatureSet,
      );
      const child = new FeatureSet({
        fieldPresence: FeatureSet_FieldPresence.IMPLICIT,
        repeatedFieldEncoding: FeatureSet_RepeatedFieldEncoding.EXPANDED,
      });
      const merged = resolver.mergeFeatures(new FeatureSet(), child);
      expect(merged.fieldPresence).toBe(FeatureSet_FieldPresence.IMPLICIT);
      expect(merged.enumType).toBe(FeatureSet_EnumType.OPEN);
      expect(merged.repeatedFieldEncoding).toBe(
        FeatureSet_RepeatedFieldEncoding.EXPANDED,
      );
      expect(merged.messageEncoding).toBe(
        FeatureSet_MessageEncoding.LENGTH_PREFIXED,
      );
    });
    test("MergeFeaturesUnknownEnumFeature", () => {
      const resolver = setupFeatureResolver(
        Edition.EDITION_2023,
        descFeatureSet,
      );
      for (const field of FeatureSet.fields.list()) {
        const features = new FeatureSet();
        // Set the feature to a value of 0, which is unknown by convention.
        (features as AnyMessage)[field.localName] = 0;
        expect(() =>
          resolver.mergeFeatures(new FeatureSet(), features),
        ).toThrow(
          /Feature field google\.protobuf\.FeatureSet\..+ must resolve to a known value\./,
        );
      }
    });
    test("MergeFeaturesDistantPast", () => {
      expect(() =>
        setupFeatureResolver(Edition.EDITION_1_TEST_ONLY, descFeatureSet),
      ).toThrowError(
        "Edition EDITION_1_TEST_ONLY is earlier than the minimum supported edition EDITION_2023",
      );
    });
    test("MergeFeaturesDistantFuture", () => {
      expect(() =>
        setupFeatureResolver(Edition.EDITION_99998_TEST_ONLY, descFeatureSet),
      ).toThrowError(
        "Edition EDITION_99998_TEST_ONLY is later than the maximum supported edition EDITION_99997_TEST_ONLY",
      );
    });
    test("DefaultsTooEarly", () => {
      const defaults = FeatureResolver.compileDefaults(
        Edition.EDITION_2023,
        Edition.EDITION_2023,
        descFeatureSet,
      );
      defaults.minimumEdition = Edition.EDITION_1_TEST_ONLY;
      expect(() =>
        getDefaults(Edition.EDITION_1_TEST_ONLY, defaults),
      ).toThrowError("No valid default found for edition EDITION_1_TEST_ONLY");
    });
  });
});
