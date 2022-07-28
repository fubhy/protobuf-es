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
// @generated from file extra/msg-json-names.proto (package spec, syntax proto3)
/* eslint-disable */

import {proto3} from "@bufbuild/protobuf";

/**
 * @generated from message spec.JsonNamesMessage
 */
export const JsonNamesMessage = proto3.makeMessageType(
  "spec.JsonNamesMessage",
  () => [
    { no: 1, name: "scalar_field", jsonName: "scalarFieldJsonName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "repeated_scalar_field", jsonName: "repeatedScalarFieldJsonName", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 3, name: "a", jsonName: "sameJsonName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "b", jsonName: "sameJsonName", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "c", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "d", jsonName: "c", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "e", jsonName: "", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 8, name: "f", jsonName: "@type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

