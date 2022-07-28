// Copyright 2021-2022 Buf Technologies, Inc.
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

// @generated by protoc-gen-es v0.0.10 with parameter "ts_nocheck=false,target=js+dts"
// @generated from file extra/deprecation-explicit.proto (package spec, syntax proto3)
/* eslint-disable */

import type {BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage} from "@bufbuild/protobuf";
import {Message, proto3} from "@bufbuild/protobuf";

/**
 * The entire enum is deprecated
 *
 * @generated from enum spec.DeprecatedEnum
 * @deprecated
 */
export declare enum DeprecatedEnum {
  /**
   * @generated from enum value: DEPRECATED_ENUM_A = 0;
   */
  A = 0,

  /**
   * @generated from enum value: DEPRECATED_ENUM_B = 1;
   */
  B = 1,
}

/**
 * Only a single enum value is deprecated
 *
 * @generated from enum spec.DeprecatedValueEnum
 */
export declare enum DeprecatedValueEnum {
  /**
   * @generated from enum value: DEPRECATED_VALUE_ENUM_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: DEPRECATED_VALUE_ENUM_DEPRECATED_VALUE = 1 [deprecated = true];
   * @deprecated
   */
  DEPRECATED_VALUE = 1,
}

/**
 * The entire message is deprecated
 *
 * @generated from message spec.DeprecatedMessage
 * @deprecated
 */
export declare class DeprecatedMessage extends Message<DeprecatedMessage> {
  /**
   * @generated from field: string field = 1;
   */
  field: string;

  constructor(data?: PartialMessage<DeprecatedMessage>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "spec.DeprecatedMessage";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeprecatedMessage;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeprecatedMessage;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeprecatedMessage;

  static equals(a: DeprecatedMessage | PlainMessage<DeprecatedMessage> | undefined, b: DeprecatedMessage | PlainMessage<DeprecatedMessage> | undefined): boolean;
}

/**
 * A single field of this message is deprecated
 *
 * @generated from message spec.DeprecatedFieldMessage
 */
export declare class DeprecatedFieldMessage extends Message<DeprecatedFieldMessage> {
  /**
   * This field is deprecated
   *
   * @generated from field: string deprecated_field = 1 [deprecated = true];
   * @deprecated
   */
  deprecatedField: string;

  /**
   * This field is not deprecated
   *
   * @generated from field: string current_field = 2;
   */
  currentField: string;

  constructor(data?: PartialMessage<DeprecatedFieldMessage>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "spec.DeprecatedFieldMessage";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeprecatedFieldMessage;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeprecatedFieldMessage;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeprecatedFieldMessage;

  static equals(a: DeprecatedFieldMessage | PlainMessage<DeprecatedFieldMessage> | undefined, b: DeprecatedFieldMessage | PlainMessage<DeprecatedFieldMessage> | undefined): boolean;
}

