{ length: 86799, byteLength: 86799 }
{ bytes: 86799 }
{ bytes: 36976 }
{ bytes: 11083 }
{ length: 394384, byteLength: 394384 }
{ bytes: 394384 }
{ bytes: 288775 }
{ bytes: 54825 }
# Code size comparison

This is a simple code size comparison between protobuf-es and google-protobuf.

We are generating code for the module [buf.build/bufbuild/buf](https://buf.build/bufbuild/buf)
once with `protoc-gen-js` from [github.com/protocolbuffers/protobuf-javascript](https://github.com/protocolbuffers/protobuf-javascript), 
once with `protoc-gen-es` from Protobuf-ES. Then we bundle a [snippet of code](./src) 
with [esbuild](https://esbuild.github.io/), minify the bundle, and compress it like a web 
server would usually do.

| code generator      | bundle size             | minified               | compressed         |
|---------------------|------------------------:|-----------------------:|-------------------:|
| protobuf-es         | 86,799 b      | 36,976 b | 11,083 b |
| protobuf-javascript | 394,384 b  | 288,775 b | 54,825 b |
