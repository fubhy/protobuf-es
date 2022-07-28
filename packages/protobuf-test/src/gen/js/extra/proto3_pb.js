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
// @generated from file extra/proto3.proto (package spec, syntax proto3)
/* eslint-disable */

import {proto3} from "@bufbuild/protobuf";

/**
 * @generated from enum spec.Proto3Enum
 */
export const Proto3Enum = proto3.makeEnum(
  "spec.Proto3Enum",
  [
    {no: 0, name: "PROTO3_ENUM_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "PROTO3_ENUM_YES", localName: "YES"},
    {no: 2, name: "PROTO3_ENUM_NO", localName: "NO"},
  ],
);

/**
 * @generated from message spec.Proto3PackedMessage
 */
export const Proto3PackedMessage = proto3.makeMessageType(
  "spec.Proto3PackedMessage",
  () => [
    { no: 101, name: "packed_double_field", kind: "scalar", T: 1 /* ScalarType.DOUBLE */, repeated: true },
    { no: 102, name: "packed_uint32_field", kind: "scalar", T: 13 /* ScalarType.UINT32 */, repeated: true },
    { no: 103, name: "packed_uint64_field", kind: "scalar", T: 4 /* ScalarType.UINT64 */, repeated: true },
  ],
);

/**
 * @generated from message spec.Proto3UnpackedMessage
 */
export const Proto3UnpackedMessage = proto3.makeMessageType(
  "spec.Proto3UnpackedMessage",
  () => [
    { no: 201, name: "unpacked_double_field", kind: "scalar", T: 1 /* ScalarType.DOUBLE */, repeated: true, packed: false },
    { no: 202, name: "unpacked_uint32_field", kind: "scalar", T: 13 /* ScalarType.UINT32 */, repeated: true, packed: false },
    { no: 203, name: "unpacked_uint64_field", kind: "scalar", T: 4 /* ScalarType.UINT64 */, repeated: true, packed: false },
  ],
);

/**
 * @generated from message spec.Proto3UnlabelledMessage
 */
export const Proto3UnlabelledMessage = proto3.makeMessageType(
  "spec.Proto3UnlabelledMessage",
  () => [
    { no: 1, name: "double_field", kind: "scalar", T: 1 /* ScalarType.DOUBLE */, repeated: true },
    { no: 2, name: "uint32_field", kind: "scalar", T: 13 /* ScalarType.UINT32 */, repeated: true },
    { no: 3, name: "uint64_field", kind: "scalar", T: 4 /* ScalarType.UINT64 */, repeated: true },
  ],
);

/**
 * @generated from message spec.Proto3OptionalMessage
 */
export const Proto3OptionalMessage = proto3.makeMessageType(
  "spec.Proto3OptionalMessage",
  () => [
    { no: 1, name: "string_field", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 2, name: "bytes_field", kind: "scalar", T: 12 /* ScalarType.BYTES */, opt: true },
    { no: 3, name: "enum_field", kind: "enum", T: proto3.getEnumType(Proto3Enum), opt: true },
    { no: 4, name: "message_field", kind: "message", T: Proto3OptionalMessage, opt: true },
  ],
);

