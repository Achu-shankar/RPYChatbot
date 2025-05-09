var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/@msgpack/msgpack/dist/utils/int.js
var require_int = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/int.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUint64 = exports.getInt64 = exports.setInt64 = exports.setUint64 = exports.UINT32_MAX = void 0;
    exports.UINT32_MAX = 4294967295;
    function setUint64(view, offset, value) {
      const high = value / 4294967296;
      const low = value;
      view.setUint32(offset, high);
      view.setUint32(offset + 4, low);
    }
    exports.setUint64 = setUint64;
    function setInt64(view, offset, value) {
      const high = Math.floor(value / 4294967296);
      const low = value;
      view.setUint32(offset, high);
      view.setUint32(offset + 4, low);
    }
    exports.setInt64 = setInt64;
    function getInt64(view, offset) {
      const high = view.getInt32(offset);
      const low = view.getUint32(offset + 4);
      return high * 4294967296 + low;
    }
    exports.getInt64 = getInt64;
    function getUint64(view, offset) {
      const high = view.getUint32(offset);
      const low = view.getUint32(offset + 4);
      return high * 4294967296 + low;
    }
    exports.getUint64 = getUint64;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/utf8.js
var require_utf8 = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/utf8.js"(exports) {
    "use strict";
    var _a;
    var _b;
    var _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utf8DecodeTD = exports.TEXT_DECODER_THRESHOLD = exports.utf8DecodeJs = exports.utf8EncodeTE = exports.TEXT_ENCODER_THRESHOLD = exports.utf8EncodeJs = exports.utf8Count = void 0;
    var int_1 = require_int();
    var TEXT_ENCODING_AVAILABLE = (typeof process === "undefined" || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
    function utf8Count(str) {
      const strLength = str.length;
      let byteLength = 0;
      let pos = 0;
      while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 4294967168) === 0) {
          byteLength++;
          continue;
        } else if ((value & 4294965248) === 0) {
          byteLength += 2;
        } else {
          if (value >= 55296 && value <= 56319) {
            if (pos < strLength) {
              const extra = str.charCodeAt(pos);
              if ((extra & 64512) === 56320) {
                ++pos;
                value = ((value & 1023) << 10) + (extra & 1023) + 65536;
              }
            }
          }
          if ((value & 4294901760) === 0) {
            byteLength += 3;
          } else {
            byteLength += 4;
          }
        }
      }
      return byteLength;
    }
    exports.utf8Count = utf8Count;
    function utf8EncodeJs(str, output, outputOffset) {
      const strLength = str.length;
      let offset = outputOffset;
      let pos = 0;
      while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 4294967168) === 0) {
          output[offset++] = value;
          continue;
        } else if ((value & 4294965248) === 0) {
          output[offset++] = value >> 6 & 31 | 192;
        } else {
          if (value >= 55296 && value <= 56319) {
            if (pos < strLength) {
              const extra = str.charCodeAt(pos);
              if ((extra & 64512) === 56320) {
                ++pos;
                value = ((value & 1023) << 10) + (extra & 1023) + 65536;
              }
            }
          }
          if ((value & 4294901760) === 0) {
            output[offset++] = value >> 12 & 15 | 224;
            output[offset++] = value >> 6 & 63 | 128;
          } else {
            output[offset++] = value >> 18 & 7 | 240;
            output[offset++] = value >> 12 & 63 | 128;
            output[offset++] = value >> 6 & 63 | 128;
          }
        }
        output[offset++] = value & 63 | 128;
      }
    }
    exports.utf8EncodeJs = utf8EncodeJs;
    var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : void 0;
    exports.TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
    function utf8EncodeTEencode(str, output, outputOffset) {
      output.set(sharedTextEncoder.encode(str), outputOffset);
    }
    function utf8EncodeTEencodeInto(str, output, outputOffset) {
      sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
    }
    exports.utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
    var CHUNK_SIZE = 4096;
    function utf8DecodeJs(bytes, inputOffset, byteLength) {
      let offset = inputOffset;
      const end = offset + byteLength;
      const units = [];
      let result = "";
      while (offset < end) {
        const byte1 = bytes[offset++];
        if ((byte1 & 128) === 0) {
          units.push(byte1);
        } else if ((byte1 & 224) === 192) {
          const byte2 = bytes[offset++] & 63;
          units.push((byte1 & 31) << 6 | byte2);
        } else if ((byte1 & 240) === 224) {
          const byte2 = bytes[offset++] & 63;
          const byte3 = bytes[offset++] & 63;
          units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
        } else if ((byte1 & 248) === 240) {
          const byte2 = bytes[offset++] & 63;
          const byte3 = bytes[offset++] & 63;
          const byte4 = bytes[offset++] & 63;
          let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
          if (unit > 65535) {
            unit -= 65536;
            units.push(unit >>> 10 & 1023 | 55296);
            unit = 56320 | unit & 1023;
          }
          units.push(unit);
        } else {
          units.push(byte1);
        }
        if (units.length >= CHUNK_SIZE) {
          result += String.fromCharCode(...units);
          units.length = 0;
        }
      }
      if (units.length > 0) {
        result += String.fromCharCode(...units);
      }
      return result;
    }
    exports.utf8DecodeJs = utf8DecodeJs;
    var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
    exports.TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force" ? 200 : 0;
    function utf8DecodeTD(bytes, inputOffset, byteLength) {
      const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
      return sharedTextDecoder.decode(stringBytes);
    }
    exports.utf8DecodeTD = utf8DecodeTD;
  }
});

// node_modules/@msgpack/msgpack/dist/ExtData.js
var require_ExtData = __commonJS({
  "node_modules/@msgpack/msgpack/dist/ExtData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExtData = void 0;
    var ExtData = class {
      constructor(type, data) {
        this.type = type;
        this.data = data;
      }
    };
    exports.ExtData = ExtData;
  }
});

// node_modules/@msgpack/msgpack/dist/DecodeError.js
var require_DecodeError = __commonJS({
  "node_modules/@msgpack/msgpack/dist/DecodeError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DecodeError = void 0;
    var DecodeError = class extends Error {
      constructor(message) {
        super(message);
        const proto = Object.create(DecodeError.prototype);
        Object.setPrototypeOf(this, proto);
        Object.defineProperty(this, "name", {
          configurable: true,
          enumerable: false,
          value: DecodeError.name
        });
      }
    };
    exports.DecodeError = DecodeError;
  }
});

// node_modules/@msgpack/msgpack/dist/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/@msgpack/msgpack/dist/timestamp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.timestampExtension = exports.decodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimestampExtension = exports.encodeDateToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.EXT_TIMESTAMP = void 0;
    var DecodeError_1 = require_DecodeError();
    var int_1 = require_int();
    exports.EXT_TIMESTAMP = -1;
    var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
    var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
    function encodeTimeSpecToTimestamp({ sec, nsec }) {
      if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
        if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
          const rv = new Uint8Array(4);
          const view = new DataView(rv.buffer);
          view.setUint32(0, sec);
          return rv;
        } else {
          const secHigh = sec / 4294967296;
          const secLow = sec & 4294967295;
          const rv = new Uint8Array(8);
          const view = new DataView(rv.buffer);
          view.setUint32(0, nsec << 2 | secHigh & 3);
          view.setUint32(4, secLow);
          return rv;
        }
      } else {
        const rv = new Uint8Array(12);
        const view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        (0, int_1.setInt64)(view, 4, sec);
        return rv;
      }
    }
    exports.encodeTimeSpecToTimestamp = encodeTimeSpecToTimestamp;
    function encodeDateToTimeSpec(date) {
      const msec = date.getTime();
      const sec = Math.floor(msec / 1e3);
      const nsec = (msec - sec * 1e3) * 1e6;
      const nsecInSec = Math.floor(nsec / 1e9);
      return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9
      };
    }
    exports.encodeDateToTimeSpec = encodeDateToTimeSpec;
    function encodeTimestampExtension(object) {
      if (object instanceof Date) {
        const timeSpec = encodeDateToTimeSpec(object);
        return encodeTimeSpecToTimestamp(timeSpec);
      } else {
        return null;
      }
    }
    exports.encodeTimestampExtension = encodeTimestampExtension;
    function decodeTimestampToTimeSpec(data) {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      switch (data.byteLength) {
        case 4: {
          const sec = view.getUint32(0);
          const nsec = 0;
          return { sec, nsec };
        }
        case 8: {
          const nsec30AndSecHigh2 = view.getUint32(0);
          const secLow32 = view.getUint32(4);
          const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
          const nsec = nsec30AndSecHigh2 >>> 2;
          return { sec, nsec };
        }
        case 12: {
          const sec = (0, int_1.getInt64)(view, 4);
          const nsec = view.getUint32(0);
          return { sec, nsec };
        }
        default:
          throw new DecodeError_1.DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
      }
    }
    exports.decodeTimestampToTimeSpec = decodeTimestampToTimeSpec;
    function decodeTimestampExtension(data) {
      const timeSpec = decodeTimestampToTimeSpec(data);
      return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
    }
    exports.decodeTimestampExtension = decodeTimestampExtension;
    exports.timestampExtension = {
      type: exports.EXT_TIMESTAMP,
      encode: encodeTimestampExtension,
      decode: decodeTimestampExtension
    };
  }
});

// node_modules/@msgpack/msgpack/dist/ExtensionCodec.js
var require_ExtensionCodec = __commonJS({
  "node_modules/@msgpack/msgpack/dist/ExtensionCodec.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExtensionCodec = void 0;
    var ExtData_1 = require_ExtData();
    var timestamp_1 = require_timestamp();
    var ExtensionCodec = class {
      constructor() {
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        this.encoders = [];
        this.decoders = [];
        this.register(timestamp_1.timestampExtension);
      }
      register({ type, encode: encode3, decode: decode3 }) {
        if (type >= 0) {
          this.encoders[type] = encode3;
          this.decoders[type] = decode3;
        } else {
          const index = 1 + type;
          this.builtInEncoders[index] = encode3;
          this.builtInDecoders[index] = decode3;
        }
      }
      tryToEncode(object, context) {
        for (let i = 0; i < this.builtInEncoders.length; i++) {
          const encodeExt = this.builtInEncoders[i];
          if (encodeExt != null) {
            const data = encodeExt(object, context);
            if (data != null) {
              const type = -1 - i;
              return new ExtData_1.ExtData(type, data);
            }
          }
        }
        for (let i = 0; i < this.encoders.length; i++) {
          const encodeExt = this.encoders[i];
          if (encodeExt != null) {
            const data = encodeExt(object, context);
            if (data != null) {
              const type = i;
              return new ExtData_1.ExtData(type, data);
            }
          }
        }
        if (object instanceof ExtData_1.ExtData) {
          return object;
        }
        return null;
      }
      decode(data, type, context) {
        const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) {
          return decodeExt(data, type, context);
        } else {
          return new ExtData_1.ExtData(type, data);
        }
      }
    };
    exports.ExtensionCodec = ExtensionCodec;
    ExtensionCodec.defaultCodec = new ExtensionCodec();
  }
});

// node_modules/@msgpack/msgpack/dist/utils/typedArrays.js
var require_typedArrays = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/typedArrays.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDataView = exports.ensureUint8Array = void 0;
    function ensureUint8Array(buffer) {
      if (buffer instanceof Uint8Array) {
        return buffer;
      } else if (ArrayBuffer.isView(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      } else if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer);
      } else {
        return Uint8Array.from(buffer);
      }
    }
    exports.ensureUint8Array = ensureUint8Array;
    function createDataView(buffer) {
      if (buffer instanceof ArrayBuffer) {
        return new DataView(buffer);
      }
      const bufferView = ensureUint8Array(buffer);
      return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
    }
    exports.createDataView = createDataView;
  }
});

// node_modules/@msgpack/msgpack/dist/Encoder.js
var require_Encoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/Encoder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Encoder = exports.DEFAULT_INITIAL_BUFFER_SIZE = exports.DEFAULT_MAX_DEPTH = void 0;
    var utf8_1 = require_utf8();
    var ExtensionCodec_1 = require_ExtensionCodec();
    var int_1 = require_int();
    var typedArrays_1 = require_typedArrays();
    exports.DEFAULT_MAX_DEPTH = 100;
    exports.DEFAULT_INITIAL_BUFFER_SIZE = 2048;
    var Encoder = class {
      constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxDepth = exports.DEFAULT_MAX_DEPTH, initialBufferSize = exports.DEFAULT_INITIAL_BUFFER_SIZE, sortKeys = false, forceFloat32 = false, ignoreUndefined = false, forceIntegerToFloat = false) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntegerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
      }
      reinitializeState() {
        this.pos = 0;
      }
      /**
       * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
       *
       * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
       */
      encodeSharedRef(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
      }
      /**
       * @returns Encodes the object and returns a copy of the encoder's internal buffer.
       */
      encode(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
      }
      doEncode(object, depth) {
        if (depth > this.maxDepth) {
          throw new Error(`Too deep objects in depth ${depth}`);
        }
        if (object == null) {
          this.encodeNil();
        } else if (typeof object === "boolean") {
          this.encodeBoolean(object);
        } else if (typeof object === "number") {
          this.encodeNumber(object);
        } else if (typeof object === "string") {
          this.encodeString(object);
        } else {
          this.encodeObject(object, depth);
        }
      }
      ensureBufferSizeToWrite(sizeToWrite) {
        const requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
          this.resizeBuffer(requiredSize * 2);
        }
      }
      resizeBuffer(newSize) {
        const newBuffer = new ArrayBuffer(newSize);
        const newBytes = new Uint8Array(newBuffer);
        const newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
      }
      encodeNil() {
        this.writeU8(192);
      }
      encodeBoolean(object) {
        if (object === false) {
          this.writeU8(194);
        } else {
          this.writeU8(195);
        }
      }
      encodeNumber(object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
          if (object >= 0) {
            if (object < 128) {
              this.writeU8(object);
            } else if (object < 256) {
              this.writeU8(204);
              this.writeU8(object);
            } else if (object < 65536) {
              this.writeU8(205);
              this.writeU16(object);
            } else if (object < 4294967296) {
              this.writeU8(206);
              this.writeU32(object);
            } else {
              this.writeU8(207);
              this.writeU64(object);
            }
          } else {
            if (object >= -32) {
              this.writeU8(224 | object + 32);
            } else if (object >= -128) {
              this.writeU8(208);
              this.writeI8(object);
            } else if (object >= -32768) {
              this.writeU8(209);
              this.writeI16(object);
            } else if (object >= -2147483648) {
              this.writeU8(210);
              this.writeI32(object);
            } else {
              this.writeU8(211);
              this.writeI64(object);
            }
          }
        } else {
          if (this.forceFloat32) {
            this.writeU8(202);
            this.writeF32(object);
          } else {
            this.writeU8(203);
            this.writeF64(object);
          }
        }
      }
      writeStringHeader(byteLength) {
        if (byteLength < 32) {
          this.writeU8(160 + byteLength);
        } else if (byteLength < 256) {
          this.writeU8(217);
          this.writeU8(byteLength);
        } else if (byteLength < 65536) {
          this.writeU8(218);
          this.writeU16(byteLength);
        } else if (byteLength < 4294967296) {
          this.writeU8(219);
          this.writeU32(byteLength);
        } else {
          throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
        }
      }
      encodeString(object) {
        const maxHeaderSize = 1 + 4;
        const strLength = object.length;
        if (strLength > utf8_1.TEXT_ENCODER_THRESHOLD) {
          const byteLength = (0, utf8_1.utf8Count)(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          (0, utf8_1.utf8EncodeTE)(object, this.bytes, this.pos);
          this.pos += byteLength;
        } else {
          const byteLength = (0, utf8_1.utf8Count)(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          (0, utf8_1.utf8EncodeJs)(object, this.bytes, this.pos);
          this.pos += byteLength;
        }
      }
      encodeObject(object, depth) {
        const ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
          this.encodeExtension(ext);
        } else if (Array.isArray(object)) {
          this.encodeArray(object, depth);
        } else if (ArrayBuffer.isView(object)) {
          this.encodeBinary(object);
        } else if (typeof object === "object") {
          this.encodeMap(object, depth);
        } else {
          throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
        }
      }
      encodeBinary(object) {
        const size = object.byteLength;
        if (size < 256) {
          this.writeU8(196);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(197);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(198);
          this.writeU32(size);
        } else {
          throw new Error(`Too large binary: ${size}`);
        }
        const bytes = (0, typedArrays_1.ensureUint8Array)(object);
        this.writeU8a(bytes);
      }
      encodeArray(object, depth) {
        const size = object.length;
        if (size < 16) {
          this.writeU8(144 + size);
        } else if (size < 65536) {
          this.writeU8(220);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(221);
          this.writeU32(size);
        } else {
          throw new Error(`Too large array: ${size}`);
        }
        for (const item of object) {
          this.doEncode(item, depth + 1);
        }
      }
      countWithoutUndefined(object, keys) {
        let count = 0;
        for (const key of keys) {
          if (object[key] !== void 0) {
            count++;
          }
        }
        return count;
      }
      encodeMap(object, depth) {
        const keys = Object.keys(object);
        if (this.sortKeys) {
          keys.sort();
        }
        const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) {
          this.writeU8(128 + size);
        } else if (size < 65536) {
          this.writeU8(222);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(223);
          this.writeU32(size);
        } else {
          throw new Error(`Too large map object: ${size}`);
        }
        for (const key of keys) {
          const value = object[key];
          if (!(this.ignoreUndefined && value === void 0)) {
            this.encodeString(key);
            this.doEncode(value, depth + 1);
          }
        }
      }
      encodeExtension(ext) {
        const size = ext.data.length;
        if (size === 1) {
          this.writeU8(212);
        } else if (size === 2) {
          this.writeU8(213);
        } else if (size === 4) {
          this.writeU8(214);
        } else if (size === 8) {
          this.writeU8(215);
        } else if (size === 16) {
          this.writeU8(216);
        } else if (size < 256) {
          this.writeU8(199);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(200);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(201);
          this.writeU32(size);
        } else {
          throw new Error(`Too large extension object: ${size}`);
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
      }
      writeU8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
      }
      writeU8a(values) {
        const size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
      }
      writeI8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
      }
      writeU16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
      }
      writeI16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
      }
      writeU32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
      }
      writeI32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
      }
      writeF32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
      }
      writeF64(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
      }
      writeU64(value) {
        this.ensureBufferSizeToWrite(8);
        (0, int_1.setUint64)(this.view, this.pos, value);
        this.pos += 8;
      }
      writeI64(value) {
        this.ensureBufferSizeToWrite(8);
        (0, int_1.setInt64)(this.view, this.pos, value);
        this.pos += 8;
      }
    };
    exports.Encoder = Encoder;
  }
});

// node_modules/@msgpack/msgpack/dist/encode.js
var require_encode = __commonJS({
  "node_modules/@msgpack/msgpack/dist/encode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encode = void 0;
    var Encoder_1 = require_Encoder();
    var defaultEncodeOptions = {};
    function encode3(value, options = defaultEncodeOptions) {
      const encoder2 = new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
      return encoder2.encodeSharedRef(value);
    }
    exports.encode = encode3;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/prettyByte.js
var require_prettyByte = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/prettyByte.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prettyByte = void 0;
    function prettyByte(byte) {
      return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
    }
    exports.prettyByte = prettyByte;
  }
});

// node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js
var require_CachedKeyDecoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CachedKeyDecoder = void 0;
    var utf8_1 = require_utf8();
    var DEFAULT_MAX_KEY_LENGTH = 16;
    var DEFAULT_MAX_LENGTH_PER_KEY = 16;
    var CachedKeyDecoder = class {
      constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        this.caches = [];
        for (let i = 0; i < this.maxKeyLength; i++) {
          this.caches.push([]);
        }
      }
      canBeCached(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
      }
      find(bytes, inputOffset, byteLength) {
        const records = this.caches[byteLength - 1];
        FIND_CHUNK:
          for (const record of records) {
            const recordBytes = record.bytes;
            for (let j = 0; j < byteLength; j++) {
              if (recordBytes[j] !== bytes[inputOffset + j]) {
                continue FIND_CHUNK;
              }
            }
            return record.str;
          }
        return null;
      }
      store(bytes, value) {
        const records = this.caches[bytes.length - 1];
        const record = { bytes, str: value };
        if (records.length >= this.maxLengthPerKey) {
          records[Math.random() * records.length | 0] = record;
        } else {
          records.push(record);
        }
      }
      decode(bytes, inputOffset, byteLength) {
        const cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
          this.hit++;
          return cachedValue;
        }
        this.miss++;
        const str = (0, utf8_1.utf8DecodeJs)(bytes, inputOffset, byteLength);
        const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
      }
    };
    exports.CachedKeyDecoder = CachedKeyDecoder;
  }
});

// node_modules/@msgpack/msgpack/dist/Decoder.js
var require_Decoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/Decoder.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Decoder = exports.DataViewIndexOutOfBoundsError = void 0;
    var prettyByte_1 = require_prettyByte();
    var ExtensionCodec_1 = require_ExtensionCodec();
    var int_1 = require_int();
    var utf8_1 = require_utf8();
    var typedArrays_1 = require_typedArrays();
    var CachedKeyDecoder_1 = require_CachedKeyDecoder();
    var DecodeError_1 = require_DecodeError();
    var isValidMapKeyType = (key) => {
      const keyType = typeof key;
      return keyType === "string" || keyType === "number";
    };
    var HEAD_BYTE_REQUIRED = -1;
    var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
    var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
    exports.DataViewIndexOutOfBoundsError = (() => {
      try {
        EMPTY_VIEW.getInt8(0);
      } catch (e) {
        return e.constructor;
      }
      throw new Error("never reached");
    })();
    var MORE_DATA = new exports.DataViewIndexOutOfBoundsError("Insufficient data");
    var sharedCachedKeyDecoder = new CachedKeyDecoder_1.CachedKeyDecoder();
    var Decoder = class {
      constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxStrLength = int_1.UINT32_MAX, maxBinLength = int_1.UINT32_MAX, maxArrayLength = int_1.UINT32_MAX, maxMapLength = int_1.UINT32_MAX, maxExtLength = int_1.UINT32_MAX, keyDecoder = sharedCachedKeyDecoder) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = EMPTY_VIEW;
        this.bytes = EMPTY_BYTES;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack = [];
      }
      reinitializeState() {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
      }
      setBuffer(buffer) {
        this.bytes = (0, typedArrays_1.ensureUint8Array)(buffer);
        this.view = (0, typedArrays_1.createDataView)(this.bytes);
        this.pos = 0;
      }
      appendBuffer(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
          this.setBuffer(buffer);
        } else {
          const remainingData = this.bytes.subarray(this.pos);
          const newData = (0, typedArrays_1.ensureUint8Array)(buffer);
          const newBuffer = new Uint8Array(remainingData.length + newData.length);
          newBuffer.set(remainingData);
          newBuffer.set(newData, remainingData.length);
          this.setBuffer(newBuffer);
        }
      }
      hasRemaining(size) {
        return this.view.byteLength - this.pos >= size;
      }
      createExtraByteError(posToShow) {
        const { view, pos } = this;
        return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
      }
      /**
       * @throws {@link DecodeError}
       * @throws {@link RangeError}
       */
      decode(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        const object = this.doDecodeSync();
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.pos);
        }
        return object;
      }
      *decodeMulti(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        while (this.hasRemaining(1)) {
          yield this.doDecodeSync();
        }
      }
      async decodeAsync(stream) {
        let decoded = false;
        let object;
        for await (const buffer of stream) {
          if (decoded) {
            throw this.createExtraByteError(this.totalPos);
          }
          this.appendBuffer(buffer);
          try {
            object = this.doDecodeSync();
            decoded = true;
          } catch (e) {
            if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
              throw e;
            }
          }
          this.totalPos += this.pos;
        }
        if (decoded) {
          if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.totalPos);
          }
          return object;
        }
        const { headByte, pos, totalPos } = this;
        throw new RangeError(`Insufficient data in parsing ${(0, prettyByte_1.prettyByte)(headByte)} at ${totalPos} (${pos} in the current buffer)`);
      }
      decodeArrayStream(stream) {
        return this.decodeMultiAsync(stream, true);
      }
      decodeStream(stream) {
        return this.decodeMultiAsync(stream, false);
      }
      async *decodeMultiAsync(stream, isArray) {
        let isArrayHeaderRequired = isArray;
        let arrayItemsLeft = -1;
        for await (const buffer of stream) {
          if (isArray && arrayItemsLeft === 0) {
            throw this.createExtraByteError(this.totalPos);
          }
          this.appendBuffer(buffer);
          if (isArrayHeaderRequired) {
            arrayItemsLeft = this.readArraySize();
            isArrayHeaderRequired = false;
            this.complete();
          }
          try {
            while (true) {
              yield this.doDecodeSync();
              if (--arrayItemsLeft === 0) {
                break;
              }
            }
          } catch (e) {
            if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) {
              throw e;
            }
          }
          this.totalPos += this.pos;
        }
      }
      doDecodeSync() {
        DECODE:
          while (true) {
            const headByte = this.readHeadByte();
            let object;
            if (headByte >= 224) {
              object = headByte - 256;
            } else if (headByte < 192) {
              if (headByte < 128) {
                object = headByte;
              } else if (headByte < 144) {
                const size = headByte - 128;
                if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = {};
                }
              } else if (headByte < 160) {
                const size = headByte - 144;
                if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = [];
                }
              } else {
                const byteLength = headByte - 160;
                object = this.decodeUtf8String(byteLength, 0);
              }
            } else if (headByte === 192) {
              object = null;
            } else if (headByte === 194) {
              object = false;
            } else if (headByte === 195) {
              object = true;
            } else if (headByte === 202) {
              object = this.readF32();
            } else if (headByte === 203) {
              object = this.readF64();
            } else if (headByte === 204) {
              object = this.readU8();
            } else if (headByte === 205) {
              object = this.readU16();
            } else if (headByte === 206) {
              object = this.readU32();
            } else if (headByte === 207) {
              object = this.readU64();
            } else if (headByte === 208) {
              object = this.readI8();
            } else if (headByte === 209) {
              object = this.readI16();
            } else if (headByte === 210) {
              object = this.readI32();
            } else if (headByte === 211) {
              object = this.readI64();
            } else if (headByte === 217) {
              const byteLength = this.lookU8();
              object = this.decodeUtf8String(byteLength, 1);
            } else if (headByte === 218) {
              const byteLength = this.lookU16();
              object = this.decodeUtf8String(byteLength, 2);
            } else if (headByte === 219) {
              const byteLength = this.lookU32();
              object = this.decodeUtf8String(byteLength, 4);
            } else if (headByte === 220) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 221) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 222) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 223) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 196) {
              const size = this.lookU8();
              object = this.decodeBinary(size, 1);
            } else if (headByte === 197) {
              const size = this.lookU16();
              object = this.decodeBinary(size, 2);
            } else if (headByte === 198) {
              const size = this.lookU32();
              object = this.decodeBinary(size, 4);
            } else if (headByte === 212) {
              object = this.decodeExtension(1, 0);
            } else if (headByte === 213) {
              object = this.decodeExtension(2, 0);
            } else if (headByte === 214) {
              object = this.decodeExtension(4, 0);
            } else if (headByte === 215) {
              object = this.decodeExtension(8, 0);
            } else if (headByte === 216) {
              object = this.decodeExtension(16, 0);
            } else if (headByte === 199) {
              const size = this.lookU8();
              object = this.decodeExtension(size, 1);
            } else if (headByte === 200) {
              const size = this.lookU16();
              object = this.decodeExtension(size, 2);
            } else if (headByte === 201) {
              const size = this.lookU32();
              object = this.decodeExtension(size, 4);
            } else {
              throw new DecodeError_1.DecodeError(`Unrecognized type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
            }
            this.complete();
            const stack = this.stack;
            while (stack.length > 0) {
              const state = stack[stack.length - 1];
              if (state.type === 0) {
                state.array[state.position] = object;
                state.position++;
                if (state.position === state.size) {
                  stack.pop();
                  object = state.array;
                } else {
                  continue DECODE;
                }
              } else if (state.type === 1) {
                if (!isValidMapKeyType(object)) {
                  throw new DecodeError_1.DecodeError("The type of key must be string or number but " + typeof object);
                }
                if (object === "__proto__") {
                  throw new DecodeError_1.DecodeError("The key __proto__ is not allowed");
                }
                state.key = object;
                state.type = 2;
                continue DECODE;
              } else {
                state.map[state.key] = object;
                state.readCount++;
                if (state.readCount === state.size) {
                  stack.pop();
                  object = state.map;
                } else {
                  state.key = null;
                  state.type = 1;
                  continue DECODE;
                }
              }
            }
            return object;
          }
      }
      readHeadByte() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
          this.headByte = this.readU8();
        }
        return this.headByte;
      }
      complete() {
        this.headByte = HEAD_BYTE_REQUIRED;
      }
      readArraySize() {
        const headByte = this.readHeadByte();
        switch (headByte) {
          case 220:
            return this.readU16();
          case 221:
            return this.readU32();
          default: {
            if (headByte < 160) {
              return headByte - 144;
            } else {
              throw new DecodeError_1.DecodeError(`Unrecognized array type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
            }
          }
        }
      }
      pushMapState(size) {
        if (size > this.maxMapLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
        }
        this.stack.push({
          type: 1,
          size,
          key: null,
          readCount: 0,
          map: {}
        });
      }
      pushArrayState(size) {
        if (size > this.maxArrayLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
        }
        this.stack.push({
          type: 0,
          size,
          array: new Array(size),
          position: 0
        });
      }
      decodeUtf8String(byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
          throw MORE_DATA;
        }
        const offset = this.pos + headerOffset;
        let object;
        if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
          object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        } else if (byteLength > utf8_1.TEXT_DECODER_THRESHOLD) {
          object = (0, utf8_1.utf8DecodeTD)(this.bytes, offset, byteLength);
        } else {
          object = (0, utf8_1.utf8DecodeJs)(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
      }
      stateIsMapKey() {
        if (this.stack.length > 0) {
          const state = this.stack[this.stack.length - 1];
          return state.type === 1;
        }
        return false;
      }
      decodeBinary(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
          throw MORE_DATA;
        }
        const offset = this.pos + headOffset;
        const object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
      }
      decodeExtension(size, headOffset) {
        if (size > this.maxExtLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
        }
        const extType = this.view.getInt8(this.pos + headOffset);
        const data = this.decodeBinary(
          size,
          headOffset + 1
          /* extType */
        );
        return this.extensionCodec.decode(data, extType, this.context);
      }
      lookU8() {
        return this.view.getUint8(this.pos);
      }
      lookU16() {
        return this.view.getUint16(this.pos);
      }
      lookU32() {
        return this.view.getUint32(this.pos);
      }
      readU8() {
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
      }
      readI8() {
        const value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
      }
      readU16() {
        const value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
      }
      readI16() {
        const value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
      }
      readU32() {
        const value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
      }
      readI32() {
        const value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
      }
      readU64() {
        const value = (0, int_1.getUint64)(this.view, this.pos);
        this.pos += 8;
        return value;
      }
      readI64() {
        const value = (0, int_1.getInt64)(this.view, this.pos);
        this.pos += 8;
        return value;
      }
      readF32() {
        const value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
      }
      readF64() {
        const value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
      }
    };
    exports.Decoder = Decoder;
  }
});

// node_modules/@msgpack/msgpack/dist/decode.js
var require_decode = __commonJS({
  "node_modules/@msgpack/msgpack/dist/decode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeMulti = exports.decode = exports.defaultDecodeOptions = void 0;
    var Decoder_1 = require_Decoder();
    exports.defaultDecodeOptions = {};
    function decode3(buffer, options = exports.defaultDecodeOptions) {
      const decoder2 = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder2.decode(buffer);
    }
    exports.decode = decode3;
    function decodeMulti(buffer, options = exports.defaultDecodeOptions) {
      const decoder2 = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder2.decodeMulti(buffer);
    }
    exports.decodeMulti = decodeMulti;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/stream.js
var require_stream = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/stream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ensureAsyncIterable = exports.asyncIterableFromStream = exports.isAsyncIterable = void 0;
    function isAsyncIterable(object) {
      return object[Symbol.asyncIterator] != null;
    }
    exports.isAsyncIterable = isAsyncIterable;
    function assertNonNull(value) {
      if (value == null) {
        throw new Error("Assertion Failure: value must not be null nor undefined");
      }
    }
    async function* asyncIterableFromStream(stream) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          assertNonNull(value);
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    }
    exports.asyncIterableFromStream = asyncIterableFromStream;
    function ensureAsyncIterable(streamLike) {
      if (isAsyncIterable(streamLike)) {
        return streamLike;
      } else {
        return asyncIterableFromStream(streamLike);
      }
    }
    exports.ensureAsyncIterable = ensureAsyncIterable;
  }
});

// node_modules/@msgpack/msgpack/dist/decodeAsync.js
var require_decodeAsync = __commonJS({
  "node_modules/@msgpack/msgpack/dist/decodeAsync.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeStream = exports.decodeMultiStream = exports.decodeArrayStream = exports.decodeAsync = void 0;
    var Decoder_1 = require_Decoder();
    var stream_1 = require_stream();
    var decode_1 = require_decode();
    async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder2 = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder2.decodeAsync(stream);
    }
    exports.decodeAsync = decodeAsync;
    function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder2 = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder2.decodeArrayStream(stream);
    }
    exports.decodeArrayStream = decodeArrayStream;
    function decodeMultiStream(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder2 = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder2.decodeStream(stream);
    }
    exports.decodeMultiStream = decodeMultiStream;
    function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
      return decodeMultiStream(streamLike, options);
    }
    exports.decodeStream = decodeStream;
  }
});

// node_modules/@msgpack/msgpack/dist/index.js
var require_dist = __commonJS({
  "node_modules/@msgpack/msgpack/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeTimestampExtension = exports.encodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.encodeDateToTimeSpec = exports.EXT_TIMESTAMP = exports.ExtData = exports.ExtensionCodec = exports.Encoder = exports.DataViewIndexOutOfBoundsError = exports.DecodeError = exports.Decoder = exports.decodeStream = exports.decodeMultiStream = exports.decodeArrayStream = exports.decodeAsync = exports.decodeMulti = exports.decode = exports.encode = void 0;
    var encode_1 = require_encode();
    Object.defineProperty(exports, "encode", { enumerable: true, get: function() {
      return encode_1.encode;
    } });
    var decode_1 = require_decode();
    Object.defineProperty(exports, "decode", { enumerable: true, get: function() {
      return decode_1.decode;
    } });
    Object.defineProperty(exports, "decodeMulti", { enumerable: true, get: function() {
      return decode_1.decodeMulti;
    } });
    var decodeAsync_1 = require_decodeAsync();
    Object.defineProperty(exports, "decodeAsync", { enumerable: true, get: function() {
      return decodeAsync_1.decodeAsync;
    } });
    Object.defineProperty(exports, "decodeArrayStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeArrayStream;
    } });
    Object.defineProperty(exports, "decodeMultiStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeMultiStream;
    } });
    Object.defineProperty(exports, "decodeStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeStream;
    } });
    var Decoder_1 = require_Decoder();
    Object.defineProperty(exports, "Decoder", { enumerable: true, get: function() {
      return Decoder_1.Decoder;
    } });
    Object.defineProperty(exports, "DataViewIndexOutOfBoundsError", { enumerable: true, get: function() {
      return Decoder_1.DataViewIndexOutOfBoundsError;
    } });
    var DecodeError_1 = require_DecodeError();
    Object.defineProperty(exports, "DecodeError", { enumerable: true, get: function() {
      return DecodeError_1.DecodeError;
    } });
    var Encoder_1 = require_Encoder();
    Object.defineProperty(exports, "Encoder", { enumerable: true, get: function() {
      return Encoder_1.Encoder;
    } });
    var ExtensionCodec_1 = require_ExtensionCodec();
    Object.defineProperty(exports, "ExtensionCodec", { enumerable: true, get: function() {
      return ExtensionCodec_1.ExtensionCodec;
    } });
    var ExtData_1 = require_ExtData();
    Object.defineProperty(exports, "ExtData", { enumerable: true, get: function() {
      return ExtData_1.ExtData;
    } });
    var timestamp_1 = require_timestamp();
    Object.defineProperty(exports, "EXT_TIMESTAMP", { enumerable: true, get: function() {
      return timestamp_1.EXT_TIMESTAMP;
    } });
    Object.defineProperty(exports, "encodeDateToTimeSpec", { enumerable: true, get: function() {
      return timestamp_1.encodeDateToTimeSpec;
    } });
    Object.defineProperty(exports, "encodeTimeSpecToTimestamp", { enumerable: true, get: function() {
      return timestamp_1.encodeTimeSpecToTimestamp;
    } });
    Object.defineProperty(exports, "decodeTimestampToTimeSpec", { enumerable: true, get: function() {
      return timestamp_1.decodeTimestampToTimeSpec;
    } });
    Object.defineProperty(exports, "encodeTimestampExtension", { enumerable: true, get: function() {
      return timestamp_1.encodeTimestampExtension;
    } });
    Object.defineProperty(exports, "decodeTimestampExtension", { enumerable: true, get: function() {
      return timestamp_1.decodeTimestampExtension;
    } });
  }
});

// webR/error.ts
var WebRError = class extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var WebRWorkerError = class extends WebRError {
};
var WebRChannelError = class extends WebRError {
};
var WebRPayloadError = class extends WebRError {
};

// webR/compat.ts
var IN_NODE = typeof process !== "undefined" && process.release && process.release.name === "node";
var loadScript;
if (globalThis.document) {
  loadScript = (url) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
} else if (globalThis.importScripts) {
  loadScript = async (url) => {
    try {
      globalThis.importScripts(url);
    } catch (e) {
      if (e instanceof TypeError) {
        await Promise.resolve().then(() => __toESM(__require(url)));
      } else {
        throw e;
      }
    }
  };
} else if (IN_NODE) {
  loadScript = async (url) => {
    const nodePathMod = (await Promise.resolve().then(() => __toESM(__require("path")))).default;
    await Promise.resolve().then(() => __toESM(__require(nodePathMod.resolve(url))));
  };
} else {
  throw new WebRError("Cannot determine runtime environment");
}

// webR/emscripten.ts
var Module2 = {};
function dictEmFree(dict) {
  Object.keys(dict).forEach((key) => Module2._free(dict[key]));
}

// webR/robj.ts
var RTypeMap = {
  null: 0,
  symbol: 1,
  pairlist: 2,
  closure: 3,
  environment: 4,
  promise: 5,
  call: 6,
  special: 7,
  builtin: 8,
  string: 9,
  logical: 10,
  integer: 13,
  double: 14,
  complex: 15,
  character: 16,
  dots: 17,
  any: 18,
  list: 19,
  expression: 20,
  bytecode: 21,
  pointer: 22,
  weakref: 23,
  raw: 24,
  s4: 25,
  new: 30,
  free: 31,
  function: 99
};
function isWebRDataJs(value) {
  return !!value && typeof value === "object" && Object.keys(RTypeMap).includes(value.type);
}
function isComplex(value) {
  return !!value && typeof value === "object" && "re" in value && "im" in value;
}

// webR/utils-r.ts
function protect(x) {
  Module2._Rf_protect(handlePtr(x));
  return x;
}
function protectInc(x, prot) {
  Module2._Rf_protect(handlePtr(x));
  ++prot.n;
  return x;
}
function protectWithIndex(x) {
  const pLoc = Module2._malloc(4);
  Module2._R_ProtectWithIndex(handlePtr(x), pLoc);
  const loc = Module2.getValue(pLoc, "i32");
  return { loc, ptr: pLoc };
}
function unprotectIndex(index) {
  Module2._Rf_unprotect(1);
  Module2._free(index.ptr);
}
function reprotect(x, index) {
  Module2._R_Reprotect(handlePtr(x), index.loc);
  return x;
}
function unprotect(n) {
  Module2._Rf_unprotect(n);
}
function envPoke(env, sym, value) {
  Module2._Rf_defineVar(handlePtr(sym), handlePtr(value), handlePtr(env));
}
function parseEvalBare(code, env) {
  const strings = {};
  const prot = { n: 0 };
  try {
    const envObj = new REnvironment(env);
    protectInc(envObj, prot);
    strings.code = Module2.allocateUTF8(code);
    const out = Module2._R_ParseEvalString(strings.code, envObj.ptr);
    return RObject.wrap(out);
  } finally {
    dictEmFree(strings);
    unprotect(prot.n);
  }
}
function safeEval(call, env) {
  return Module2.getWasmTableEntry(Module2.GOT.ffi_safe_eval.value)(
    handlePtr(call),
    handlePtr(env)
  );
}

// webR/chan/task-common.ts
var SZ_BUF_DOESNT_FIT = 0;
var SZ_BUF_FITS_IDX = 1;
var SZ_BUF_SIZE_IDX = 0;
var transferCache = /* @__PURE__ */ new WeakMap();
function transfer(obj, transfers) {
  transferCache.set(obj, transfers);
  return obj;
}
function isUUID(x) {
  return typeof x === "string" && x.length === UUID_LENGTH;
}
var UUID_LENGTH = 63;
function generateUUID() {
  const result = Array.from({ length: 4 }, randomSegment).join("-");
  if (result.length !== UUID_LENGTH) {
    throw new Error("comlink internal error: UUID has the wrong length");
  }
  return result;
}
function randomSegment() {
  let result = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  const pad = 15 - result.length;
  if (pad > 0) {
    result = Array.from({ length: pad }, () => 0).join("") + result;
  }
  return result;
}

// webR/robj-worker.ts
function handlePtr(x) {
  if (isRObject(x)) {
    return x.ptr;
  } else {
    return x;
  }
}
function assertRType(obj, type) {
  if (Module2._TYPEOF(obj.ptr) !== RTypeMap[type]) {
    throw new Error(`Unexpected object type "${obj.type()}" when expecting type "${type}"`);
  }
}
function newObjectFromData(obj) {
  if (isWebRDataJs(obj)) {
    return new (getRWorkerClass(obj.type))(obj);
  }
  if (obj && typeof obj === "object" && "type" in obj && obj.type === "null") {
    return new RNull();
  }
  if (obj === null) {
    return new RLogical({ type: "logical", names: null, values: [null] });
  }
  if (typeof obj === "boolean") {
    return new RLogical(obj);
  }
  if (typeof obj === "number") {
    return new RDouble(obj);
  }
  if (typeof obj === "string") {
    return new RCharacter(obj);
  }
  if (isComplex(obj)) {
    return new RComplex(obj);
  }
  if (ArrayBuffer.isView(obj) || obj instanceof ArrayBuffer) {
    return new RRaw(obj);
  }
  if (Array.isArray(obj)) {
    return newObjectFromArray(obj);
  }
  if (typeof obj === "object") {
    return RDataFrame.fromObject(obj);
  }
  throw new Error("Robj construction for this JS object is not yet supported");
}
function newObjectFromArray(arr) {
  const prot = { n: 0 };
  const hasObjects = arr.every((v) => v && typeof v === "object" && !isRObject(v) && !isComplex(v));
  if (hasObjects) {
    const _arr = arr;
    const isConsistent = _arr.every((a) => {
      return Object.keys(a).filter((k) => !Object.keys(_arr[0]).includes(k)).length === 0 && Object.keys(_arr[0]).filter((k) => !Object.keys(a).includes(k)).length === 0;
    });
    const isAtomic = _arr.every((a) => Object.values(a).every((v) => {
      return isAtomicType(v) || isRVectorAtomic(v);
    }));
    if (isConsistent && isAtomic) {
      return RDataFrame.fromD3(_arr);
    }
  }
  if (arr.every((v) => typeof v === "boolean" || v === null)) {
    return new RLogical(arr);
  }
  if (arr.every((v) => typeof v === "number" || v === null)) {
    return new RDouble(arr);
  }
  if (arr.every((v) => typeof v === "string" || v === null)) {
    return new RCharacter(arr);
  }
  try {
    const call = new RCall([new RSymbol("c"), ...arr]);
    protectInc(call, prot);
    return call.eval();
  } finally {
    unprotect(prot.n);
  }
}
var RObjectBase = class {
  constructor(ptr) {
    this.ptr = ptr;
  }
  type() {
    const typeNumber = Module2._TYPEOF(this.ptr);
    const type = Object.keys(RTypeMap).find(
      (typeName) => RTypeMap[typeName] === typeNumber
    );
    return type;
  }
};
var _slice, slice_fn;
var _RObject = class extends RObjectBase {
  constructor(data) {
    if (!(data instanceof RObjectBase)) {
      return newObjectFromData(data);
    }
    super(data.ptr);
    __privateAdd(this, _slice);
  }
  static wrap(ptr) {
    const typeNumber = Module2._TYPEOF(ptr);
    const type = Object.keys(RTypeMap)[Object.values(RTypeMap).indexOf(typeNumber)];
    return new (getRWorkerClass(type))(new RObjectBase(ptr));
  }
  get [Symbol.toStringTag]() {
    return `RObject:${this.type()}`;
  }
  /** @internal */
  static getPersistentObject(prop) {
    return objs[prop];
  }
  /** @internal */
  getPropertyValue(prop) {
    return this[prop];
  }
  inspect() {
    parseEvalBare(".Internal(inspect(x))", { x: this });
  }
  isNull() {
    return Module2._TYPEOF(this.ptr) === RTypeMap.null;
  }
  isNa() {
    try {
      const result = parseEvalBare("is.na(x)", { x: this });
      protect(result);
      return result.toBoolean();
    } finally {
      unprotect(1);
    }
  }
  isUnbound() {
    return this.ptr === objs.unboundValue.ptr;
  }
  attrs() {
    return RPairlist.wrap(Module2._ATTRIB(this.ptr));
  }
  class() {
    const prot = { n: 0 };
    const classCall = new RCall([new RSymbol("class"), this]);
    protectInc(classCall, prot);
    try {
      return classCall.eval();
    } finally {
      unprotect(prot.n);
    }
  }
  setNames(values) {
    let namesObj;
    if (values === null) {
      namesObj = objs.null;
    } else if (Array.isArray(values) && values.every((v) => typeof v === "string" || v === null)) {
      namesObj = new RCharacter(values);
    } else {
      throw new Error("Argument to setNames must be null or an Array of strings or null");
    }
    Module2._Rf_setAttrib(this.ptr, objs.namesSymbol.ptr, namesObj.ptr);
    return this;
  }
  names() {
    const names = RCharacter.wrap(Module2._Rf_getAttrib(this.ptr, objs.namesSymbol.ptr));
    if (names.isNull()) {
      return null;
    } else {
      return names.toArray();
    }
  }
  includes(name) {
    const names = this.names();
    return names && names.includes(name);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJs(options = { depth: 0 }, depth = 1) {
    throw new Error("This R object cannot be converted to JS");
  }
  subset(prop) {
    return __privateMethod(this, _slice, slice_fn).call(this, prop, objs.bracketSymbol.ptr);
  }
  get(prop) {
    return __privateMethod(this, _slice, slice_fn).call(this, prop, objs.bracket2Symbol.ptr);
  }
  getDollar(prop) {
    return __privateMethod(this, _slice, slice_fn).call(this, prop, objs.dollarSymbol.ptr);
  }
  pluck(...path) {
    const index = protectWithIndex(objs.null);
    try {
      const getter = (obj, prop) => {
        const out = obj.get(prop);
        return reprotect(out, index);
      };
      const result = path.reduce(getter, this);
      return result.isNull() ? void 0 : result;
    } finally {
      unprotectIndex(index);
    }
  }
  set(prop, value) {
    const prot = { n: 0 };
    try {
      const idx = new _RObject(prop);
      protectInc(idx, prot);
      const valueObj = new _RObject(value);
      protectInc(valueObj, prot);
      const assign = new RSymbol("[[<-");
      const call = Module2._Rf_lang4(assign.ptr, this.ptr, idx.ptr, valueObj.ptr);
      protectInc(call, prot);
      return _RObject.wrap(safeEval(call, objs.baseEnv));
    } finally {
      unprotect(prot.n);
    }
  }
  /** @internal */
  static getMethods(obj) {
    const props = /* @__PURE__ */ new Set();
    let cur = obj;
    do {
      Object.getOwnPropertyNames(cur).map((p) => props.add(p));
    } while (cur = Object.getPrototypeOf(cur));
    return [...props.keys()].filter((i) => typeof obj[i] === "function");
  }
};
var RObject = _RObject;
_slice = new WeakSet();
slice_fn = function(prop, op) {
  const prot = { n: 0 };
  try {
    const idx = new _RObject(prop);
    protectInc(idx, prot);
    const call = Module2._Rf_lang3(op, this.ptr, idx.ptr);
    protectInc(call, prot);
    return _RObject.wrap(safeEval(call, objs.baseEnv));
  } finally {
    unprotect(prot.n);
  }
};
var RNull = class extends RObject {
  constructor() {
    super(new RObjectBase(Module2.getValue(Module2._R_NilValue, "*")));
    return this;
  }
  toJs() {
    return { type: "null" };
  }
};
var RSymbol = class extends RObject {
  // Note that symbols don't need to be protected. This also means
  // that allocating symbols in loops with random data is probably a
  // bad idea because this leaks memory.
  constructor(x) {
    if (x instanceof RObjectBase) {
      assertRType(x, "symbol");
      super(x);
      return;
    }
    const name = Module2.allocateUTF8(x);
    try {
      super(new RObjectBase(Module2._Rf_install(name)));
    } finally {
      Module2._free(name);
    }
  }
  toJs() {
    const obj = this.toObject();
    return {
      type: "symbol",
      printname: obj.printname,
      symvalue: obj.symvalue,
      internal: obj.internal
    };
  }
  toObject() {
    return {
      printname: this.printname().isUnbound() ? null : this.printname().toString(),
      symvalue: this.symvalue().isUnbound() ? null : this.symvalue().ptr,
      internal: this.internal().isNull() ? null : this.internal().ptr
    };
  }
  toString() {
    return this.printname().toString();
  }
  printname() {
    return RString.wrap(Module2._PRINTNAME(this.ptr));
  }
  symvalue() {
    return RObject.wrap(Module2._SYMVALUE(this.ptr));
  }
  internal() {
    return RObject.wrap(Module2._INTERNAL(this.ptr));
  }
};
var RPairlist = class extends RObject {
  constructor(val) {
    if (val instanceof RObjectBase) {
      assertRType(val, "pairlist");
      super(val);
      return this;
    }
    const prot = { n: 0 };
    try {
      const { names, values } = toWebRData(val);
      const list = RPairlist.wrap(Module2._Rf_allocList(values.length));
      protectInc(list, prot);
      for (let [i, next] = [0, list]; !next.isNull(); [i, next] = [i + 1, next.cdr()]) {
        next.setcar(new RObject(values[i]));
      }
      list.setNames(names);
      super(list);
    } finally {
      unprotect(prot.n);
    }
  }
  get length() {
    return this.toArray().length;
  }
  toArray(options = { depth: 1 }) {
    return this.toJs(options).values;
  }
  toObject({
    allowDuplicateKey = true,
    allowEmptyKey = false,
    depth = -1
  } = {}) {
    const entries = this.entries({ depth });
    const keys = entries.map(([k]) => k);
    if (!allowDuplicateKey && new Set(keys).size !== keys.length) {
      throw new Error("Duplicate key when converting pairlist without allowDuplicateKey enabled");
    }
    if (!allowEmptyKey && keys.some((k) => !k)) {
      throw new Error("Empty or null key when converting pairlist without allowEmptyKey enabled");
    }
    return Object.fromEntries(
      entries.filter((u, idx) => entries.findIndex((v) => v[0] === u[0]) === idx)
    );
  }
  entries(options = { depth: 1 }) {
    const obj = this.toJs(options);
    return obj.values.map((v, i) => [obj.names ? obj.names[i] : null, v]);
  }
  toJs(options = { depth: 0 }, depth = 1) {
    const namesArray = [];
    let hasNames = false;
    const values = [];
    for (let next = this; !next.isNull(); next = next.cdr()) {
      const symbol = next.tag();
      if (symbol.isNull()) {
        namesArray.push("");
      } else {
        hasNames = true;
        namesArray.push(symbol.toString());
      }
      if (options.depth && depth >= options.depth) {
        values.push(next.car());
      } else {
        values.push(next.car().toJs(options, depth + 1));
      }
    }
    const names = hasNames ? namesArray : null;
    return { type: "pairlist", names, values };
  }
  includes(name) {
    return name in this.toObject();
  }
  setcar(obj) {
    Module2._SETCAR(this.ptr, obj.ptr);
  }
  car() {
    return RObject.wrap(Module2._CAR(this.ptr));
  }
  cdr() {
    return RObject.wrap(Module2._CDR(this.ptr));
  }
  tag() {
    return RObject.wrap(Module2._TAG(this.ptr));
  }
};
var RCall = class extends RObject {
  constructor(val) {
    if (val instanceof RObjectBase) {
      assertRType(val, "call");
      super(val);
      return this;
    }
    const prot = { n: 0 };
    try {
      const { values } = toWebRData(val);
      const objs2 = values.map((value) => protectInc(new RObject(value), prot));
      const call = RCall.wrap(Module2._Rf_allocVector(RTypeMap.call, values.length));
      protectInc(call, prot);
      for (let [i, next] = [0, call]; !next.isNull(); [i, next] = [i + 1, next.cdr()]) {
        next.setcar(objs2[i]);
      }
      super(call);
    } finally {
      unprotect(prot.n);
    }
  }
  setcar(obj) {
    Module2._SETCAR(this.ptr, obj.ptr);
  }
  car() {
    return RObject.wrap(Module2._CAR(this.ptr));
  }
  cdr() {
    return RObject.wrap(Module2._CDR(this.ptr));
  }
  eval() {
    return Module2.webr.evalR(this, { env: objs.baseEnv });
  }
  capture(options = {}) {
    return Module2.webr.captureR(this, options);
  }
  deparse() {
    const prot = { n: 0 };
    try {
      const call = Module2._Rf_lang2(
        new RSymbol("deparse1").ptr,
        Module2._Rf_lang2(new RSymbol("quote").ptr, this.ptr)
      );
      protectInc(call, prot);
      const val = RCharacter.wrap(safeEval(call, objs.baseEnv));
      protectInc(val, prot);
      return val.toString();
    } finally {
      unprotect(prot.n);
    }
  }
};
var RList = class extends RObject {
  constructor(val, names = null) {
    if (val instanceof RObjectBase) {
      assertRType(val, "list");
      super(val);
      if (names) {
        if (names.length !== this.length) {
          throw new Error(
            "Can't construct named `RList`. Supplied `names` must be the same length as the list."
          );
        }
        this.setNames(names);
      }
      return this;
    }
    const prot = { n: 0 };
    try {
      const data = toWebRData(val);
      const ptr = Module2._Rf_allocVector(RTypeMap.list, data.values.length);
      protectInc(ptr, prot);
      data.values.forEach((v, i) => {
        Module2._SET_VECTOR_ELT(ptr, i, new RObject(v).ptr);
      });
      const _names = names ? names : data.names;
      if (_names && _names.length !== data.values.length) {
        throw new Error(
          "Can't construct named `RList`. Supplied `names` must be the same length as the list."
        );
      }
      RObject.wrap(ptr).setNames(_names);
      super(new RObjectBase(ptr));
    } finally {
      unprotect(prot.n);
    }
  }
  get length() {
    return Module2._LENGTH(this.ptr);
  }
  isDataFrame() {
    const classes = RPairlist.wrap(Module2._ATTRIB(this.ptr)).get("class");
    return !classes.isNull() && classes.toArray().includes("data.frame");
  }
  toArray(options = { depth: 1 }) {
    return this.toJs(options).values;
  }
  toObject({
    allowDuplicateKey = true,
    allowEmptyKey = false,
    depth = -1
  } = {}) {
    const entries = this.entries({ depth });
    const keys = entries.map(([k]) => k);
    if (!allowDuplicateKey && new Set(keys).size !== keys.length) {
      throw new Error("Duplicate key when converting list without allowDuplicateKey enabled");
    }
    if (!allowEmptyKey && keys.some((k) => !k)) {
      throw new Error("Empty or null key when converting list without allowEmptyKey enabled");
    }
    return Object.fromEntries(
      entries.filter((u, idx) => entries.findIndex((v) => v[0] === u[0]) === idx)
    );
  }
  toD3() {
    if (!this.isDataFrame()) {
      throw new Error(
        "Can't convert R list object to D3 format. Object must be of class 'data.frame'."
      );
    }
    const entries = this.entries();
    return entries.reduce((a, entry) => {
      entry[1].forEach((v, j) => a[j] = Object.assign(a[j] || {}, { [entry[0]]: v }));
      return a;
    }, []);
  }
  entries(options = { depth: -1 }) {
    const obj = this.toJs(options);
    if (this.isDataFrame() && options.depth < 0) {
      obj.values = obj.values.map((v) => v.toArray());
    }
    return obj.values.map((v, i) => [obj.names ? obj.names[i] : null, v]);
  }
  toJs(options = { depth: 0 }, depth = 1) {
    return {
      type: "list",
      names: this.names(),
      values: [...Array(this.length).keys()].map((i) => {
        if (options.depth && depth >= options.depth) {
          return this.get(i + 1);
        } else {
          return this.get(i + 1).toJs(options, depth + 1);
        }
      })
    };
  }
};
var RDataFrame = class extends RList {
  constructor(val) {
    if (val instanceof RObjectBase) {
      super(val);
      if (!this.isDataFrame()) {
        throw new Error("Can't construct `RDataFrame`. Supplied R object is not a `data.frame`.");
      }
      return this;
    }
    return RDataFrame.fromObject(val);
  }
  static fromObject(obj) {
    const { names, values } = toWebRData(obj);
    const prot = { n: 0 };
    try {
      const hasNames = !!names && names.length > 0 && names.every((v) => v);
      const hasArrays = values.length > 0 && values.every((v) => {
        return Array.isArray(v) || ArrayBuffer.isView(v) || v instanceof ArrayBuffer;
      });
      if (hasNames && hasArrays) {
        const _values = values;
        const isConsistentLength = _values.every((a) => a.length === _values[0].length);
        const isAtomic = _values.every((a) => {
          return isAtomicType(a[0]) || isRVectorAtomic(a[0]);
        });
        if (isConsistentLength && isAtomic) {
          const listObj = new RList({
            type: "list",
            names,
            values: _values.map((a) => newObjectFromData(a))
          });
          protectInc(listObj, prot);
          const asDataFrame = new RCall([new RSymbol("as.data.frame"), listObj]);
          protectInc(asDataFrame, prot);
          return new RDataFrame(asDataFrame.eval());
        }
      }
    } finally {
      unprotect(prot.n);
    }
    throw new Error("Can't construct `data.frame`. Source object is not eligible.");
  }
  static fromD3(arr) {
    return this.fromObject(
      Object.fromEntries(Object.keys(arr[0]).map((k) => [k, arr.map((v) => v[k])]))
    );
  }
};
var RFunction = class extends RObject {
  exec(...args) {
    const prot = { n: 0 };
    try {
      const call = new RCall([this, ...args]);
      protectInc(call, prot);
      return call.eval();
    } finally {
      unprotect(prot.n);
    }
  }
  capture(options = {}, ...args) {
    const prot = { n: 0 };
    try {
      const call = new RCall([this, ...args]);
      protectInc(call, prot);
      return call.capture(options);
    } finally {
      unprotect(prot.n);
    }
  }
};
var RString = class extends RObject {
  // Unlike symbols, strings are not cached and must thus be protected
  constructor(x) {
    if (x instanceof RObjectBase) {
      assertRType(x, "string");
      super(x);
      return;
    }
    const name = Module2.allocateUTF8(x);
    try {
      super(new RObjectBase(Module2._Rf_mkChar(name)));
    } finally {
      Module2._free(name);
    }
  }
  toString() {
    return Module2.UTF8ToString(Module2._R_CHAR(this.ptr));
  }
  toJs() {
    return {
      type: "string",
      value: this.toString()
    };
  }
};
var REnvironment = class extends RObject {
  constructor(val = {}) {
    if (val instanceof RObjectBase) {
      assertRType(val, "environment");
      super(val);
      return this;
    }
    let nProt = 0;
    try {
      const { names, values } = toWebRData(val);
      const ptr = protect(Module2._R_NewEnv(objs.globalEnv.ptr, 0, 0));
      ++nProt;
      values.forEach((v, i) => {
        const name = names ? names[i] : null;
        if (!name) {
          throw new Error("Can't create object in new environment with empty symbol name");
        }
        const sym = new RSymbol(name);
        const vObj = protect(new RObject(v));
        try {
          envPoke(ptr, sym, vObj);
        } finally {
          unprotect(1);
        }
      });
      super(new RObjectBase(ptr));
    } finally {
      unprotect(nProt);
    }
  }
  ls(all = false, sorted = true) {
    const ls = RCharacter.wrap(Module2._R_lsInternal3(this.ptr, Number(all), Number(sorted)));
    return ls.toArray();
  }
  bind(name, value) {
    const sym = new RSymbol(name);
    const valueObj = protect(new RObject(value));
    try {
      envPoke(this, sym, valueObj);
    } finally {
      unprotect(1);
    }
  }
  names() {
    return this.ls(true, true);
  }
  frame() {
    return RObject.wrap(Module2._FRAME(this.ptr));
  }
  subset(prop) {
    if (typeof prop === "number") {
      throw new Error("Object of type environment is not subsettable");
    }
    return this.getDollar(prop);
  }
  toObject({ depth = -1 } = {}) {
    const symbols = this.names();
    return Object.fromEntries(
      [...Array(symbols.length).keys()].map((i) => {
        const value = this.getDollar(symbols[i]);
        return [symbols[i], depth < 0 ? value : value.toJs({ depth })];
      })
    );
  }
  toJs(options = { depth: 0 }, depth = 1) {
    const names = this.names();
    const values = [...Array(names.length).keys()].map((i) => {
      if (options.depth && depth >= options.depth) {
        return this.getDollar(names[i]);
      } else {
        return this.getDollar(names[i]).toJs(options, depth + 1);
      }
    });
    return {
      type: "environment",
      names,
      values
    };
  }
};
var RVectorAtomic = class extends RObject {
  constructor(val, kind, newSetter) {
    if (val instanceof RObjectBase) {
      assertRType(val, kind);
      super(val);
      return this;
    }
    const prot = { n: 0 };
    try {
      const { names, values } = toWebRData(val);
      const ptr = Module2._Rf_allocVector(RTypeMap[kind], values.length);
      protectInc(ptr, prot);
      values.forEach(newSetter(ptr));
      RObject.wrap(ptr).setNames(names);
      super(new RObjectBase(ptr));
    } finally {
      unprotect(prot.n);
    }
  }
  get length() {
    return Module2._LENGTH(this.ptr);
  }
  get(prop) {
    return super.get(prop);
  }
  subset(prop) {
    return super.subset(prop);
  }
  getDollar() {
    throw new Error("$ operator is invalid for atomic vectors");
  }
  detectMissing() {
    const prot = { n: 0 };
    try {
      const call = Module2._Rf_lang2(new RSymbol("is.na").ptr, this.ptr);
      protectInc(call, prot);
      const val = RLogical.wrap(safeEval(call, objs.baseEnv));
      protectInc(val, prot);
      const ret = val.toTypedArray();
      return Array.from(ret).map((elt) => Boolean(elt));
    } finally {
      unprotect(prot.n);
    }
  }
  toArray() {
    const arr = this.toTypedArray();
    return this.detectMissing().map((m, idx) => m ? null : arr[idx]);
  }
  toObject({ allowDuplicateKey = true, allowEmptyKey = false } = {}) {
    const entries = this.entries();
    const keys = entries.map(([k]) => k);
    if (!allowDuplicateKey && new Set(keys).size !== keys.length) {
      throw new Error(
        "Duplicate key when converting atomic vector without allowDuplicateKey enabled"
      );
    }
    if (!allowEmptyKey && keys.some((k) => !k)) {
      throw new Error(
        "Empty or null key when converting atomic vector without allowEmptyKey enabled"
      );
    }
    return Object.fromEntries(
      entries.filter((u, idx) => entries.findIndex((v) => v[0] === u[0]) === idx)
    );
  }
  entries() {
    const values = this.toArray();
    const names = this.names();
    return values.map((v, i) => [names ? names[i] : null, v]);
  }
  toJs() {
    return {
      type: this.type(),
      names: this.names(),
      values: this.toArray()
    };
  }
};
var _newSetter;
var _RLogical = class extends RVectorAtomic {
  constructor(val) {
    super(val, "logical", __privateGet(_RLogical, _newSetter));
  }
  getBoolean(idx) {
    return this.get(idx).toArray()[0];
  }
  toBoolean() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getBoolean(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS boolean");
    }
    return val;
  }
  toTypedArray() {
    return new Int32Array(
      Module2.HEAP32.subarray(
        Module2._LOGICAL(this.ptr) / 4,
        Module2._LOGICAL(this.ptr) / 4 + this.length
      )
    );
  }
  toArray() {
    const arr = this.toTypedArray();
    return this.detectMissing().map((m, idx) => m ? null : Boolean(arr[idx]));
  }
};
var RLogical = _RLogical;
_newSetter = new WeakMap();
__privateAdd(RLogical, _newSetter, (ptr) => {
  const data = Module2._LOGICAL(ptr);
  const naLogical = Module2.getValue(Module2._R_NaInt, "i32");
  return (v, i) => {
    Module2.setValue(data + 4 * i, v === null ? naLogical : Boolean(v), "i32");
  };
});
var _newSetter2;
var _RInteger = class extends RVectorAtomic {
  constructor(val) {
    super(val, "integer", __privateGet(_RInteger, _newSetter2));
  }
  getNumber(idx) {
    return this.get(idx).toArray()[0];
  }
  toNumber() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getNumber(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS number");
    }
    return val;
  }
  toTypedArray() {
    return new Int32Array(
      Module2.HEAP32.subarray(
        Module2._INTEGER(this.ptr) / 4,
        Module2._INTEGER(this.ptr) / 4 + this.length
      )
    );
  }
};
var RInteger = _RInteger;
_newSetter2 = new WeakMap();
__privateAdd(RInteger, _newSetter2, (ptr) => {
  const data = Module2._INTEGER(ptr);
  const naInteger = Module2.getValue(Module2._R_NaInt, "i32");
  return (v, i) => {
    Module2.setValue(data + 4 * i, v === null ? naInteger : Math.round(Number(v)), "i32");
  };
});
var _newSetter3;
var _RDouble = class extends RVectorAtomic {
  constructor(val) {
    super(val, "double", __privateGet(_RDouble, _newSetter3));
  }
  getNumber(idx) {
    return this.get(idx).toArray()[0];
  }
  toNumber() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getNumber(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS number");
    }
    return val;
  }
  toTypedArray() {
    return new Float64Array(
      Module2.HEAPF64.subarray(Module2._REAL(this.ptr) / 8, Module2._REAL(this.ptr) / 8 + this.length)
    );
  }
};
var RDouble = _RDouble;
_newSetter3 = new WeakMap();
__privateAdd(RDouble, _newSetter3, (ptr) => {
  const data = Module2._REAL(ptr);
  const naDouble = Module2.getValue(Module2._R_NaReal, "double");
  return (v, i) => {
    Module2.setValue(data + 8 * i, v === null ? naDouble : v, "double");
  };
});
var _newSetter4;
var _RComplex = class extends RVectorAtomic {
  constructor(val) {
    super(val, "complex", __privateGet(_RComplex, _newSetter4));
  }
  getComplex(idx) {
    return this.get(idx).toArray()[0];
  }
  toComplex() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getComplex(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS object");
    }
    return val;
  }
  toTypedArray() {
    return new Float64Array(
      Module2.HEAPF64.subarray(
        Module2._COMPLEX(this.ptr) / 8,
        Module2._COMPLEX(this.ptr) / 8 + 2 * this.length
      )
    );
  }
  toArray() {
    const arr = this.toTypedArray();
    return this.detectMissing().map(
      (m, idx) => m ? null : { re: arr[2 * idx], im: arr[2 * idx + 1] }
    );
  }
};
var RComplex = _RComplex;
_newSetter4 = new WeakMap();
__privateAdd(RComplex, _newSetter4, (ptr) => {
  const data = Module2._COMPLEX(ptr);
  const naDouble = Module2.getValue(Module2._R_NaReal, "double");
  return (v, i) => {
    Module2.setValue(data + 8 * (2 * i), v === null ? naDouble : v.re, "double");
    Module2.setValue(data + 8 * (2 * i + 1), v === null ? naDouble : v.im, "double");
  };
});
var _newSetter5;
var _RCharacter = class extends RVectorAtomic {
  constructor(val) {
    super(val, "character", __privateGet(_RCharacter, _newSetter5));
  }
  getString(idx) {
    return this.get(idx).toArray()[0];
  }
  toString() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getString(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS string");
    }
    return val;
  }
  toTypedArray() {
    return new Uint32Array(
      Module2.HEAPU32.subarray(
        Module2._STRING_PTR(this.ptr) / 4,
        Module2._STRING_PTR(this.ptr) / 4 + this.length
      )
    );
  }
  toArray() {
    return this.detectMissing().map(
      (m, idx) => m ? null : Module2.UTF8ToString(Module2._R_CHAR(Module2._STRING_ELT(this.ptr, idx)))
    );
  }
};
var RCharacter = _RCharacter;
_newSetter5 = new WeakMap();
__privateAdd(RCharacter, _newSetter5, (ptr) => {
  return (v, i) => {
    if (v === null) {
      Module2._SET_STRING_ELT(ptr, i, objs.naString.ptr);
    } else {
      Module2._SET_STRING_ELT(ptr, i, new RString(v).ptr);
    }
  };
});
var _newSetter6;
var _RRaw = class extends RVectorAtomic {
  constructor(val) {
    if (val instanceof ArrayBuffer) {
      val = new Uint8Array(val);
    }
    super(val, "raw", __privateGet(_RRaw, _newSetter6));
  }
  getNumber(idx) {
    return this.get(idx).toArray()[0];
  }
  toNumber() {
    if (this.length !== 1) {
      throw new Error("Can't convert atomic vector of length > 1 to a scalar JS value");
    }
    const val = this.getNumber(1);
    if (val === null) {
      throw new Error("Can't convert missing value `NA` to a JS number");
    }
    return val;
  }
  toTypedArray() {
    return new Uint8Array(
      Module2.HEAPU8.subarray(Module2._RAW(this.ptr), Module2._RAW(this.ptr) + this.length)
    );
  }
};
var RRaw = _RRaw;
_newSetter6 = new WeakMap();
__privateAdd(RRaw, _newSetter6, (ptr) => {
  const data = Module2._RAW(ptr);
  return (v, i) => {
    Module2.setValue(data + i, Number(v), "i8");
  };
});
function toWebRData(jsObj) {
  if (isWebRDataJs(jsObj)) {
    return jsObj;
  } else if (Array.isArray(jsObj) || ArrayBuffer.isView(jsObj)) {
    return { names: null, values: jsObj };
  } else if (jsObj && typeof jsObj === "object" && !isComplex(jsObj)) {
    return {
      names: Object.keys(jsObj),
      values: Object.values(jsObj)
    };
  }
  return { names: null, values: [jsObj] };
}
function getRWorkerClass(type) {
  const typeClasses = {
    object: RObject,
    null: RNull,
    symbol: RSymbol,
    pairlist: RPairlist,
    closure: RFunction,
    environment: REnvironment,
    call: RCall,
    special: RFunction,
    builtin: RFunction,
    string: RString,
    logical: RLogical,
    integer: RInteger,
    double: RDouble,
    complex: RComplex,
    character: RCharacter,
    list: RList,
    raw: RRaw,
    function: RFunction,
    dataframe: RDataFrame
  };
  if (type in typeClasses) {
    return typeClasses[type];
  }
  return RObject;
}
function isRObject(value) {
  return value instanceof RObject;
}
function isRVectorAtomic(value) {
  const atomicRTypes = ["logical", "integer", "double", "complex", "character"];
  return isRObject(value) && atomicRTypes.includes(value.type()) || isRObject(value) && value.isNa();
}
function isAtomicType(value) {
  return value === null || typeof value === "number" || typeof value === "boolean" || typeof value === "string" || isComplex(value);
}
var objs;

// webR/utils.ts
function promiseHandles() {
  const out = {
    resolve: () => {
      return;
    },
    reject: () => {
      return;
    },
    promise: Promise.resolve()
  };
  const promise = new Promise((resolve, reject) => {
    out.resolve = resolve;
    out.reject = reject;
  });
  out.promise = promise;
  return out;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function replaceInObject(obj, test, replacer, ...replacerArgs) {
  if (obj === null || obj === void 0 || isImageBitmap(obj)) {
    return obj;
  }
  if (obj instanceof ArrayBuffer) {
    return new Uint8Array(obj);
  }
  if (test(obj)) {
    return replacer(obj, ...replacerArgs);
  }
  if (Array.isArray(obj) || ArrayBuffer.isView(obj)) {
    return obj.map(
      (v) => replaceInObject(v, test, replacer, ...replacerArgs)
    );
  }
  if (obj instanceof RObjectBase) {
    return obj;
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, replaceInObject(v, test, replacer, ...replacerArgs)])
    );
  }
  return obj;
}
function newCrossOriginWorker(url, cb) {
  const req = new XMLHttpRequest();
  req.open("get", url, true);
  req.onload = () => {
    const worker = new Worker(URL.createObjectURL(new Blob([req.responseText])));
    cb(worker);
  };
  req.send();
}
function isCrossOrigin(urlString) {
  if (IN_NODE)
    return false;
  const url1 = new URL(location.href);
  const url2 = new URL(urlString, location.origin);
  if (url1.host === url2.host && url1.port === url2.port && url1.protocol === url2.protocol) {
    return false;
  }
  return true;
}
function isImageBitmap(value) {
  return typeof ImageBitmap !== "undefined" && value instanceof ImageBitmap;
}

// webR/chan/task-main.ts
var import_msgpack = __toESM(require_dist());
var encoder = new TextEncoder();
async function syncResponse(endpoint, data, response) {
  try {
    let { taskId, sizeBuffer, dataBuffer, signalBuffer } = data;
    const bytes = (0, import_msgpack.encode)(response);
    const fits = bytes.length <= dataBuffer.length;
    Atomics.store(sizeBuffer, SZ_BUF_SIZE_IDX, bytes.length);
    Atomics.store(sizeBuffer, SZ_BUF_FITS_IDX, +fits);
    if (!fits) {
      const [uuid, dataPromise] = requestResponseMessage(endpoint);
      dataBuffer.set(encoder.encode(uuid));
      await signalRequester(signalBuffer, taskId);
      dataBuffer = (await dataPromise).dataBuffer;
    }
    dataBuffer.set(bytes);
    Atomics.store(sizeBuffer, SZ_BUF_FITS_IDX, 1);
    await signalRequester(signalBuffer, taskId);
  } catch (e) {
    console.warn(e);
  }
}
function requestResponseMessage(ep) {
  const id = generateUUID();
  return [
    id,
    new Promise((resolve) => {
      if (IN_NODE) {
        ep.once("message", (message) => {
          if (!message.id || message.id !== id) {
            return;
          }
          resolve(message);
        });
      } else {
        ep.addEventListener("message", function l(ev) {
          if (!ev.data || !ev.data.id || ev.data.id !== id) {
            return;
          }
          ep.removeEventListener("message", l);
          resolve(ev.data);
        });
      }
      if (ep.start) {
        ep.start();
      }
    })
  ];
}
async function signalRequester(signalBuffer, taskId) {
  const index = (taskId >> 1) % 32;
  let sleepTime = 1;
  while (Atomics.compareExchange(signalBuffer, index + 1, 0, taskId) !== 0) {
    await sleep(sleepTime);
    if (sleepTime < 32) {
      sleepTime *= 2;
    }
  }
  Atomics.or(signalBuffer, 0, 1 << index);
  Atomics.notify(signalBuffer, 0);
}

// webR/chan/queue.ts
var _promises, _resolvers, _add, add_fn;
var AsyncQueue = class {
  constructor() {
    __privateAdd(this, _add);
    __privateAdd(this, _promises, void 0);
    __privateAdd(this, _resolvers, void 0);
    __privateSet(this, _resolvers, []);
    __privateSet(this, _promises, []);
  }
  reset() {
    __privateSet(this, _resolvers, []);
    __privateSet(this, _promises, []);
  }
  put(t) {
    if (!__privateGet(this, _resolvers).length) {
      __privateMethod(this, _add, add_fn).call(this);
    }
    const resolve = __privateGet(this, _resolvers).shift();
    resolve(t);
  }
  async get() {
    if (!__privateGet(this, _promises).length) {
      __privateMethod(this, _add, add_fn).call(this);
    }
    const promise = __privateGet(this, _promises).shift();
    return promise;
  }
  isEmpty() {
    return !__privateGet(this, _promises).length;
  }
  isBlocked() {
    return !!__privateGet(this, _resolvers).length;
  }
  get length() {
    return __privateGet(this, _promises).length - __privateGet(this, _resolvers).length;
  }
};
_promises = new WeakMap();
_resolvers = new WeakMap();
_add = new WeakSet();
add_fn = function() {
  __privateGet(this, _promises).push(
    new Promise((resolve) => {
      __privateGet(this, _resolvers).push(resolve);
    })
  );
};

// webR/chan/message.ts
function newRequest(msg, transferables) {
  return newRequestResponseMessage(
    {
      type: "request",
      data: {
        uuid: generateUUID(),
        msg
      }
    },
    transferables
  );
}
function newResponse(uuid, resp, transferables) {
  return newRequestResponseMessage(
    {
      type: "response",
      data: {
        uuid,
        resp
      }
    },
    transferables
  );
}
function newRequestResponseMessage(msg, transferables) {
  if (transferables) {
    transfer(msg, transferables);
  }
  return msg;
}
function newSyncRequest(msg, data) {
  return {
    type: "sync-request",
    data: { msg, reqData: data }
  };
}

// webR/payload.ts
function webRPayloadAsError(payload) {
  const e = new WebRWorkerError(payload.obj.message);
  if (payload.obj.name !== "Error") {
    e.name = payload.obj.name;
  }
  e.stack = payload.obj.stack;
  return e;
}
function isWebRPayload(value) {
  return !!value && typeof value === "object" && "payloadType" in value && "obj" in value;
}
function isWebRPayloadPtr(value) {
  return isWebRPayload(value) && value.payloadType === "ptr";
}

// webR/chan/channel.ts
var _parked, _closed;
var ChannelMain = class {
  constructor() {
    this.inputQueue = new AsyncQueue();
    this.outputQueue = new AsyncQueue();
    this.systemQueue = new AsyncQueue();
    __privateAdd(this, _parked, /* @__PURE__ */ new Map());
    __privateAdd(this, _closed, false);
  }
  async read() {
    return await this.outputQueue.get();
  }
  async flush() {
    const msg = [];
    while (!this.outputQueue.isEmpty()) {
      msg.push(await this.read());
    }
    return msg;
  }
  async readSystem() {
    return await this.systemQueue.get();
  }
  write(msg) {
    if (__privateGet(this, _closed)) {
      throw new WebRChannelError("The webR communication channel has been closed.");
    }
    this.inputQueue.put(msg);
  }
  async request(msg, transferables) {
    const req = newRequest(msg, transferables);
    const { resolve, reject, promise } = promiseHandles();
    __privateGet(this, _parked).set(req.data.uuid, { resolve, reject });
    this.write(req);
    return promise;
  }
  putClosedMessage() {
    __privateSet(this, _closed, true);
    this.outputQueue.put({ type: "closed" });
  }
  resolveResponse(msg) {
    const uuid = msg.data.uuid;
    const handles = __privateGet(this, _parked).get(uuid);
    if (handles) {
      const payload = msg.data.resp;
      __privateGet(this, _parked).delete(uuid);
      if (payload.payloadType === "err") {
        handles.reject(webRPayloadAsError(payload));
      } else {
        handles.resolve(payload);
      }
    } else {
      console.warn("Can't find request.");
    }
  }
};
_parked = new WeakMap();
_closed = new WeakMap();

// webR/chan/task-worker.ts
var import_msgpack2 = __toESM(require_dist());
var decoder = new TextDecoder("utf-8");
var _scheduled, _resolved, _result, _exception, _syncGen;
var SyncTask = class {
  constructor(endpoint, msg, transfers = []) {
    __privateAdd(this, _scheduled, false);
    __privateAdd(this, _resolved, void 0);
    __privateAdd(this, _result, void 0);
    __privateAdd(this, _exception, void 0);
    __privateAdd(this, _syncGen, void 0);
    this.syncifier = new _Syncifier();
    this.endpoint = endpoint;
    this.msg = msg;
    this.transfers = transfers;
    __privateSet(this, _resolved, false);
  }
  scheduleSync() {
    if (__privateGet(this, _scheduled)) {
      return;
    }
    __privateSet(this, _scheduled, true);
    this.syncifier.scheduleTask(this);
    __privateSet(this, _syncGen, this.doSync());
    __privateGet(this, _syncGen).next();
    return this;
  }
  poll() {
    if (!__privateGet(this, _scheduled)) {
      throw new Error("Task not synchronously scheduled");
    }
    const { done, value } = __privateGet(this, _syncGen).next();
    if (!done) {
      return false;
    }
    __privateSet(this, _resolved, true);
    __privateSet(this, _result, value);
    return true;
  }
  *doSync() {
    const { endpoint, msg, transfers } = this;
    const sizeBuffer = new Int32Array(new SharedArrayBuffer(8));
    const signalBuffer = this.signalBuffer;
    const taskId = this.taskId;
    let dataBuffer = acquireDataBuffer(UUID_LENGTH);
    const syncMsg = newSyncRequest(msg, {
      sizeBuffer,
      dataBuffer,
      signalBuffer,
      taskId
    });
    endpoint.postMessage(syncMsg, transfers);
    yield;
    if (Atomics.load(sizeBuffer, SZ_BUF_FITS_IDX) === SZ_BUF_DOESNT_FIT) {
      const id = decoder.decode(dataBuffer.slice(0, UUID_LENGTH));
      releaseDataBuffer(dataBuffer);
      const size2 = Atomics.load(sizeBuffer, SZ_BUF_SIZE_IDX);
      dataBuffer = acquireDataBuffer(size2);
      endpoint.postMessage({ id, dataBuffer });
      yield;
    }
    const size = Atomics.load(sizeBuffer, SZ_BUF_SIZE_IDX);
    return (0, import_msgpack2.decode)(dataBuffer.slice(0, size));
  }
  get result() {
    if (__privateGet(this, _exception)) {
      throw __privateGet(this, _exception);
    }
    if (__privateGet(this, _resolved)) {
      return __privateGet(this, _result);
    }
    throw new Error("Not ready.");
  }
  syncify() {
    this.scheduleSync();
    this.syncifier.syncifyTask(this);
    return this.result;
  }
};
_scheduled = new WeakMap();
_resolved = new WeakMap();
_result = new WeakMap();
_exception = new WeakMap();
_syncGen = new WeakMap();
var _Syncifier = class {
  constructor() {
    this.nextTaskId = new Int32Array([1]);
    this.signalBuffer = new Int32Array(new SharedArrayBuffer(32 * 4 + 4));
    this.tasks = /* @__PURE__ */ new Map();
  }
  scheduleTask(task) {
    task.taskId = this.nextTaskId[0];
    this.nextTaskId[0] += 2;
    task.signalBuffer = this.signalBuffer;
    this.tasks.set(task.taskId, task);
  }
  waitOnSignalBuffer() {
    const timeout = 50;
    for (; ; ) {
      const status = Atomics.wait(this.signalBuffer, 0, 0, timeout);
      switch (status) {
        case "ok":
        case "not-equal":
          return;
        case "timed-out":
          if (interruptBuffer[0] !== 0) {
            handleInterrupt();
          }
          break;
        default:
          throw new Error("Unreachable");
      }
    }
  }
  *tasksIdsToWakeup() {
    const flag = Atomics.load(this.signalBuffer, 0);
    for (let i = 0; i < 32; i++) {
      const bit = 1 << i;
      if (flag & bit) {
        Atomics.and(this.signalBuffer, 0, ~bit);
        const wokenTask = Atomics.exchange(this.signalBuffer, i + 1, 0);
        yield wokenTask;
      }
    }
  }
  pollTasks(task) {
    let result = false;
    for (const wokenTaskId of this.tasksIdsToWakeup()) {
      const wokenTask = this.tasks.get(wokenTaskId);
      if (!wokenTask) {
        throw new Error(`Assertion error: unknown taskId ${wokenTaskId}.`);
      }
      if (wokenTask.poll()) {
        this.tasks.delete(wokenTaskId);
        if (wokenTask === task) {
          result = true;
        }
      }
    }
    return result;
  }
  syncifyTask(task) {
    for (; ; ) {
      this.waitOnSignalBuffer();
      if (this.pollTasks(task)) {
        return;
      }
    }
  }
};
var dataBuffers = [];
function acquireDataBuffer(size) {
  const powerof2 = Math.ceil(Math.log2(size));
  if (!dataBuffers[powerof2]) {
    dataBuffers[powerof2] = [];
  }
  const result = dataBuffers[powerof2].pop();
  if (result) {
    result.fill(0);
    return result;
  }
  return new Uint8Array(new SharedArrayBuffer(2 ** powerof2));
}
function releaseDataBuffer(buffer) {
  const powerof2 = Math.ceil(Math.log2(buffer.byteLength));
  dataBuffers[powerof2].push(buffer);
}
var interruptBuffer = new Int32Array(new ArrayBuffer(4));
var handleInterrupt = () => {
  interruptBuffer[0] = 0;
  throw new Error("Interrupted!");
};
function setInterruptHandler(handler) {
  handleInterrupt = handler;
}
function setInterruptBuffer(buffer) {
  interruptBuffer = new Int32Array(buffer);
}

// webR/chan/channel-shared.ts
if (IN_NODE) {
  globalThis.Worker = __require("worker_threads").Worker;
}
var _interruptBuffer, _handleEventsFromWorker, handleEventsFromWorker_fn, _onMessageFromWorker;
var SharedBufferChannelMain = class extends ChannelMain {
  constructor(config) {
    super();
    __privateAdd(this, _handleEventsFromWorker);
    __privateAdd(this, _interruptBuffer, void 0);
    this.close = () => {
      return;
    };
    __privateAdd(this, _onMessageFromWorker, async (worker, message) => {
      if (!message || !message.type) {
        return;
      }
      switch (message.type) {
        case "resolve":
          __privateSet(this, _interruptBuffer, new Int32Array(message.data));
          this.resolve();
          return;
        case "response":
          this.resolveResponse(message);
          return;
        case "system":
          this.systemQueue.put(message.data);
          return;
        default:
          this.outputQueue.put(message);
          return;
        case "sync-request": {
          const msg = message;
          const payload = msg.data.msg;
          const reqData = msg.data.reqData;
          switch (payload.type) {
            case "read": {
              const response = await this.inputQueue.get();
              await syncResponse(worker, reqData, response);
              break;
            }
            default:
              throw new WebRChannelError(`Unsupported request type '${payload.type}'.`);
          }
          return;
        }
        case "request":
          throw new WebRChannelError(
            "Can't send messages of type 'request' from a worker. Please Use 'sync-request' instead."
          );
      }
    });
    ({ resolve: this.resolve, reject: this.reject, promise: this.initialised } = promiseHandles());
    const initWorker = (worker) => {
      __privateMethod(this, _handleEventsFromWorker, handleEventsFromWorker_fn).call(this, worker);
      this.close = () => {
        worker.terminate();
        this.putClosedMessage();
      };
      const msg = {
        type: "init",
        data: { config, channelType: ChannelType.SharedArrayBuffer }
      };
      worker.postMessage(msg);
    };
    if (isCrossOrigin(config.baseUrl)) {
      newCrossOriginWorker(
        `${config.baseUrl}webr-worker.js`,
        (worker) => initWorker(worker)
      );
    } else {
      const worker = new Worker(`${config.baseUrl}webr-worker.js`);
      initWorker(worker);
    }
  }
  interrupt() {
    if (!__privateGet(this, _interruptBuffer)) {
      throw new WebRChannelError("Failed attempt to interrupt before initialising interruptBuffer");
    }
    this.inputQueue.reset();
    __privateGet(this, _interruptBuffer)[0] = 1;
  }
};
_interruptBuffer = new WeakMap();
_handleEventsFromWorker = new WeakSet();
handleEventsFromWorker_fn = function(worker) {
  if (IN_NODE) {
    worker.on("message", (message) => {
      void __privateGet(this, _onMessageFromWorker).call(this, worker, message);
    });
    worker.on("error", (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR SharedBufferChannel worker."
      ));
    });
  } else {
    worker.onmessage = (ev) => __privateGet(this, _onMessageFromWorker).call(this, worker, ev.data);
    worker.onerror = (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR SharedBufferChannel worker."
      ));
    };
  }
};
_onMessageFromWorker = new WeakMap();
var _ep, _dispatch, _interruptBuffer2, _interrupt;
var SharedBufferChannelWorker = class {
  constructor() {
    __privateAdd(this, _ep, void 0);
    __privateAdd(this, _dispatch, () => 0);
    __privateAdd(this, _interruptBuffer2, new Int32Array(new SharedArrayBuffer(4)));
    __privateAdd(this, _interrupt, () => {
      return;
    });
    this.onMessageFromMainThread = () => {
      return;
    };
    __privateSet(this, _ep, IN_NODE ? __require("worker_threads").parentPort : globalThis);
    setInterruptBuffer(__privateGet(this, _interruptBuffer2).buffer);
    setInterruptHandler(() => this.handleInterrupt());
  }
  resolve() {
    this.write({ type: "resolve", data: __privateGet(this, _interruptBuffer2).buffer });
  }
  write(msg, transfer2) {
    __privateGet(this, _ep).postMessage(msg, transfer2);
  }
  writeSystem(msg, transfer2) {
    __privateGet(this, _ep).postMessage({ type: "system", data: msg }, transfer2);
  }
  read() {
    const msg = { type: "read" };
    const task = new SyncTask(__privateGet(this, _ep), msg);
    return task.syncify();
  }
  inputOrDispatch() {
    for (; ; ) {
      const msg = this.read();
      if (msg.type === "stdin") {
        return Module2.allocateUTF8(msg.data);
      }
      __privateGet(this, _dispatch).call(this, msg);
    }
  }
  run(args) {
    try {
      Module2.callMain(args);
    } catch (e) {
      if (e instanceof WebAssembly.RuntimeError) {
        this.writeSystem({ type: "console.error", data: e.message });
        this.writeSystem({
          type: "console.error",
          data: "An unrecoverable WebAssembly error has occurred, the webR worker will be closed."
        });
        this.writeSystem({ type: "close" });
      }
      throw e;
    }
  }
  setInterrupt(interrupt) {
    __privateSet(this, _interrupt, interrupt);
  }
  handleInterrupt() {
    if (__privateGet(this, _interruptBuffer2)[0] !== 0) {
      __privateGet(this, _interruptBuffer2)[0] = 0;
      __privateGet(this, _interrupt).call(this);
    }
  }
  setDispatchHandler(dispatch) {
    __privateSet(this, _dispatch, dispatch);
  }
};
_ep = new WeakMap();
_dispatch = new WeakMap();
_interruptBuffer2 = new WeakMap();
_interrupt = new WeakMap();

// webR/chan/channel-service.ts
var import_msgpack3 = __toESM(require_dist());
if (IN_NODE) {
  globalThis.Worker = __require("worker_threads").Worker;
}
var _syncMessageCache, _registration, _interrupted, _registerServiceWorker, registerServiceWorker_fn, _onMessageFromServiceWorker, onMessageFromServiceWorker_fn, _handleEventsFromWorker2, handleEventsFromWorker_fn2, _onMessageFromWorker2;
var ServiceWorkerChannelMain = class extends ChannelMain {
  constructor(config) {
    super();
    __privateAdd(this, _registerServiceWorker);
    __privateAdd(this, _onMessageFromServiceWorker);
    __privateAdd(this, _handleEventsFromWorker2);
    this.close = () => {
      return;
    };
    __privateAdd(this, _syncMessageCache, /* @__PURE__ */ new Map());
    __privateAdd(this, _registration, void 0);
    __privateAdd(this, _interrupted, false);
    __privateAdd(this, _onMessageFromWorker2, (worker, message) => {
      if (!message || !message.type) {
        return;
      }
      switch (message.type) {
        case "resolve":
          this.resolve();
          return;
        case "response":
          this.resolveResponse(message);
          return;
        case "system":
          this.systemQueue.put(message.data);
          return;
        default:
          this.outputQueue.put(message);
          return;
        case "sync-request": {
          const request = message.data;
          __privateGet(this, _syncMessageCache).set(request.data.uuid, request.data.msg);
          return;
        }
        case "request":
          throw new WebRChannelError(
            "Can't send messages of type 'request' from a worker.Use service worker fetch request instead."
          );
      }
    });
    ({ resolve: this.resolve, reject: this.reject, promise: this.initialised } = promiseHandles());
    console.warn(
      "The ServiceWorker communication channel is deprecated and will be removed in a future version of webR. Consider using the PostMessage channel instead. If blocking input is required (for example, `browser()`) the SharedArrayBuffer channel should be used. See https://docs.r-wasm.org/webr/latest/serving.html for further information."
    );
    const initWorker = (worker) => {
      __privateMethod(this, _handleEventsFromWorker2, handleEventsFromWorker_fn2).call(this, worker);
      this.close = () => {
        worker.terminate();
        this.putClosedMessage();
      };
      void __privateMethod(this, _registerServiceWorker, registerServiceWorker_fn).call(this, `${config.serviceWorkerUrl}webr-serviceworker.js`).then(
        (clientId) => {
          const msg = {
            type: "init",
            data: {
              config,
              channelType: ChannelType.ServiceWorker,
              clientId,
              location: window.location.href
            }
          };
          worker.postMessage(msg);
        }
      );
    };
    if (isCrossOrigin(config.serviceWorkerUrl)) {
      newCrossOriginWorker(
        `${config.serviceWorkerUrl}webr-worker.js`,
        (worker) => initWorker(worker)
      );
    } else {
      const worker = new Worker(`${config.serviceWorkerUrl}webr-worker.js`);
      initWorker(worker);
    }
  }
  activeRegistration() {
    var _a;
    if (!((_a = __privateGet(this, _registration)) == null ? void 0 : _a.active)) {
      throw new WebRChannelError("Attempted to obtain a non-existent active registration.");
    }
    return __privateGet(this, _registration).active;
  }
  interrupt() {
    __privateSet(this, _interrupted, true);
  }
};
_syncMessageCache = new WeakMap();
_registration = new WeakMap();
_interrupted = new WeakMap();
_registerServiceWorker = new WeakSet();
registerServiceWorker_fn = async function(url) {
  __privateSet(this, _registration, await navigator.serviceWorker.register(url));
  await navigator.serviceWorker.ready;
  window.addEventListener("beforeunload", () => {
    var _a;
    void ((_a = __privateGet(this, _registration)) == null ? void 0 : _a.unregister());
  });
  const clientId = await new Promise((resolve) => {
    navigator.serviceWorker.addEventListener(
      "message",
      function listener(event) {
        if (event.data.type === "registration-successful") {
          navigator.serviceWorker.removeEventListener("message", listener);
          resolve(event.data.clientId);
        }
      }
    );
    this.activeRegistration().postMessage({ type: "register-client-main" });
  });
  navigator.serviceWorker.addEventListener("message", (event) => {
    void __privateMethod(this, _onMessageFromServiceWorker, onMessageFromServiceWorker_fn).call(this, event);
  });
  return clientId;
};
_onMessageFromServiceWorker = new WeakSet();
onMessageFromServiceWorker_fn = async function(event) {
  if (event.data.type === "request") {
    const uuid = event.data.data;
    const message = __privateGet(this, _syncMessageCache).get(uuid);
    if (!message) {
      throw new WebRChannelError("Request not found during service worker XHR request");
    }
    __privateGet(this, _syncMessageCache).delete(uuid);
    switch (message.type) {
      case "read": {
        const response = await this.inputQueue.get();
        this.activeRegistration().postMessage({
          type: "wasm-webr-fetch-response",
          uuid,
          response: newResponse(uuid, response)
        });
        break;
      }
      case "interrupt": {
        const response = __privateGet(this, _interrupted);
        this.activeRegistration().postMessage({
          type: "wasm-webr-fetch-response",
          uuid,
          response: newResponse(uuid, response)
        });
        this.inputQueue.reset();
        __privateSet(this, _interrupted, false);
        break;
      }
      default:
        throw new WebRChannelError(`Unsupported request type '${message.type}'.`);
    }
    return;
  }
};
_handleEventsFromWorker2 = new WeakSet();
handleEventsFromWorker_fn2 = function(worker) {
  if (IN_NODE) {
    worker.on("message", (message) => {
      __privateGet(this, _onMessageFromWorker2).call(this, worker, message);
    });
    worker.on("error", (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR ServiceWorkerChannel worker."
      ));
    });
  } else {
    worker.onmessage = (ev) => __privateGet(this, _onMessageFromWorker2).call(this, worker, ev.data);
    worker.onerror = (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR ServiceWorkerChannel worker."
      ));
    };
  }
};
_onMessageFromWorker2 = new WeakMap();
var _ep2, _mainThreadId, _location, _lastInterruptReq, _dispatch2, _interrupt2;
var ServiceWorkerChannelWorker = class {
  constructor(data) {
    __privateAdd(this, _ep2, void 0);
    __privateAdd(this, _mainThreadId, void 0);
    __privateAdd(this, _location, void 0);
    __privateAdd(this, _lastInterruptReq, Date.now());
    __privateAdd(this, _dispatch2, () => 0);
    __privateAdd(this, _interrupt2, () => {
      return;
    });
    this.onMessageFromMainThread = () => {
      return;
    };
    if (!data.clientId || !data.location) {
      throw new WebRChannelError("Can't start service worker channel");
    }
    __privateSet(this, _mainThreadId, data.clientId);
    __privateSet(this, _location, data.location);
    __privateSet(this, _ep2, IN_NODE ? __require("worker_threads").parentPort : globalThis);
  }
  resolve() {
    this.write({ type: "resolve" });
  }
  write(msg, transfer2) {
    __privateGet(this, _ep2).postMessage(msg, transfer2);
  }
  writeSystem(msg, transfer2) {
    __privateGet(this, _ep2).postMessage({ type: "system", data: msg }, transfer2);
  }
  syncRequest(message) {
    const request = newRequest(message);
    this.write({ type: "sync-request", data: request });
    let retryCount = 0;
    for (; ; ) {
      try {
        const url = new URL("__wasm__/webr-fetch-request/", __privateGet(this, _location));
        const xhr = new XMLHttpRequest();
        xhr.timeout = 6e4;
        xhr.responseType = "arraybuffer";
        xhr.open("POST", url, false);
        const fetchReqBody = {
          clientId: __privateGet(this, _mainThreadId),
          uuid: request.data.uuid
        };
        xhr.send((0, import_msgpack3.encode)(fetchReqBody));
        return (0, import_msgpack3.decode)(xhr.response);
      } catch (e) {
        if (e instanceof DOMException && retryCount++ < 1e3) {
          console.log("Service worker request failed - resending request");
        } else {
          throw e;
        }
      }
    }
  }
  read() {
    const response = this.syncRequest({ type: "read" });
    return response.data.resp;
  }
  inputOrDispatch() {
    for (; ; ) {
      const msg = this.read();
      if (msg.type === "stdin") {
        return Module2.allocateUTF8(msg.data);
      }
      __privateGet(this, _dispatch2).call(this, msg);
    }
  }
  run(args) {
    try {
      Module2.callMain(args);
    } catch (e) {
      if (e instanceof WebAssembly.RuntimeError) {
        this.writeSystem({ type: "console.error", data: e.message });
        this.writeSystem({
          type: "console.error",
          data: "An unrecoverable WebAssembly error has occurred, the webR worker will be closed."
        });
        this.writeSystem({ type: "close" });
      }
      throw e;
    }
  }
  setInterrupt(interrupt) {
    __privateSet(this, _interrupt2, interrupt);
  }
  handleInterrupt() {
    if (Date.now() > __privateGet(this, _lastInterruptReq) + 1e3) {
      __privateSet(this, _lastInterruptReq, Date.now());
      const response = this.syncRequest({ type: "interrupt" });
      const interrupted = response.data.resp;
      if (interrupted) {
        __privateGet(this, _interrupt2).call(this);
      }
    }
  }
  setDispatchHandler(dispatch) {
    __privateSet(this, _dispatch2, dispatch);
  }
};
_ep2 = new WeakMap();
_mainThreadId = new WeakMap();
_location = new WeakMap();
_lastInterruptReq = new WeakMap();
_dispatch2 = new WeakMap();
_interrupt2 = new WeakMap();

// webR/chan/channel-postmessage.ts
if (IN_NODE) {
  globalThis.Worker = __require("worker_threads").Worker;
}
var _worker, _handleEventsFromWorker3, handleEventsFromWorker_fn3, _onMessageFromWorker3;
var PostMessageChannelMain = class extends ChannelMain {
  constructor(config) {
    super();
    __privateAdd(this, _handleEventsFromWorker3);
    this.close = () => {
      return;
    };
    __privateAdd(this, _worker, void 0);
    __privateAdd(this, _onMessageFromWorker3, async (worker, message) => {
      if (!message || !message.type) {
        return;
      }
      switch (message.type) {
        case "resolve":
          this.resolve();
          return;
        case "response":
          this.resolveResponse(message);
          return;
        case "system":
          this.systemQueue.put(message.data);
          return;
        default:
          this.outputQueue.put(message);
          return;
        case "request": {
          const msg = message;
          const payload = msg.data.msg;
          switch (payload.type) {
            case "read": {
              const input = await this.inputQueue.get();
              if (__privateGet(this, _worker)) {
                const response = newResponse(msg.data.uuid, input);
                __privateGet(this, _worker).postMessage(response);
              }
              break;
            }
            default:
              throw new WebRChannelError(`Unsupported request type '${payload.type}'.`);
          }
          return;
        }
        case "sync-request":
          throw new WebRChannelError(
            "Can't send messages of type 'sync-request' in PostMessage mode. Use 'request' instead."
          );
      }
    });
    ({ resolve: this.resolve, reject: this.reject, promise: this.initialised } = promiseHandles());
    const initWorker = (worker) => {
      __privateSet(this, _worker, worker);
      __privateMethod(this, _handleEventsFromWorker3, handleEventsFromWorker_fn3).call(this, worker);
      this.close = () => {
        worker.terminate();
        this.putClosedMessage();
      };
      const msg = {
        type: "init",
        data: { config, channelType: ChannelType.PostMessage }
      };
      worker.postMessage(msg);
    };
    if (isCrossOrigin(config.baseUrl)) {
      newCrossOriginWorker(
        `${config.baseUrl}webr-worker.js`,
        (worker) => initWorker(worker)
      );
    } else {
      const worker = new Worker(`${config.baseUrl}webr-worker.js`);
      initWorker(worker);
    }
  }
  interrupt() {
    console.error("Interrupting R execution is not available when using the PostMessage channel");
  }
};
_worker = new WeakMap();
_handleEventsFromWorker3 = new WeakSet();
handleEventsFromWorker_fn3 = function(worker) {
  if (IN_NODE) {
    worker.on("message", (message) => {
      void __privateGet(this, _onMessageFromWorker3).call(this, worker, message);
    });
    worker.on("error", (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR PostMessageChannel worker."
      ));
    });
  } else {
    worker.onmessage = (ev) => __privateGet(this, _onMessageFromWorker3).call(this, worker, ev.data);
    worker.onerror = (ev) => {
      console.error(ev);
      this.reject(new WebRWorkerError(
        "An error occurred initialising the webR PostMessageChannel worker."
      ));
    };
  }
};
_onMessageFromWorker3 = new WeakMap();
var _ep3, _parked2, _dispatch3, _promptDepth, _asyncREPL;
var PostMessageChannelWorker = class {
  constructor() {
    __privateAdd(this, _ep3, void 0);
    __privateAdd(this, _parked2, /* @__PURE__ */ new Map());
    __privateAdd(this, _dispatch3, () => 0);
    __privateAdd(this, _promptDepth, 0);
    /*
     * This is a fallback REPL for webR running in PostMessage mode. The prompt
     * section of R's R_ReplDLLdo1 returns empty with -1, which allows this
     * fallback REPL to yield to the event loop with await.
     *
     * The drawback of this approach is that nested REPLs do not work, such as
     * readline, browser or menu. Attempting to use a nested REPL prints an error
     * to the JS console.
     *
     * R/Wasm errors during execution are caught and the REPL is restarted at the
     * top level. Any other JS errors are re-thrown.
     */
    __privateAdd(this, _asyncREPL, async () => {
      for (; ; ) {
        try {
          __privateSet(this, _promptDepth, 0);
          const msg = await this.request({ type: "read" });
          if (msg.type === "stdin") {
            const str = Module.allocateUTF8(msg.data);
            Module._strcpy(Module._DLLbuf, str);
            Module.setValue(Module._DLLbufp, Module._DLLbuf, "*");
            Module._free(str);
            try {
              while (Module._R_ReplDLLdo1() > 0)
                ;
            } catch (e) {
              if (e instanceof WebAssembly.Exception) {
                Module._R_ReplDLLinit();
                Module._R_ReplDLLdo1();
              } else {
                throw e;
              }
            }
          } else {
            __privateGet(this, _dispatch3).call(this, msg);
          }
        } catch (e) {
          if (e instanceof WebAssembly.RuntimeError) {
            this.writeSystem({ type: "console.error", data: e.message });
            this.writeSystem({
              type: "console.error",
              data: "An unrecoverable WebAssembly error has occurred, the webR worker will be closed."
            });
            this.writeSystem({ type: "close" });
          }
          if (!(e instanceof WebAssembly.Exception)) {
            throw e;
          }
        }
      }
    });
    __privateSet(this, _ep3, IN_NODE ? __require("worker_threads").parentPort : globalThis);
  }
  resolve() {
    this.write({ type: "resolve" });
  }
  write(msg, transfer2) {
    __privateGet(this, _ep3).postMessage(msg, transfer2);
  }
  writeSystem(msg, transfer2) {
    __privateGet(this, _ep3).postMessage({ type: "system", data: msg }, transfer2);
  }
  read() {
    throw new WebRChannelError(
      "Unable to synchronously read when using the `PostMessage` channel."
    );
  }
  inputOrDispatch() {
    if (__privateGet(this, _promptDepth) > 0) {
      __privateSet(this, _promptDepth, 0);
      const msg = Module.allocateUTF8OnStack(
        "Can't block for input when using the PostMessage communication channel."
      );
      Module._Rf_error(msg);
    }
    __privateWrapper(this, _promptDepth)._++;
    return 0;
  }
  run(_args) {
    const args = _args || [];
    args.unshift("R");
    const argc = args.length;
    const argv = Module._malloc(4 * (argc + 1));
    args.forEach((arg, idx) => {
      const argvPtr = argv + 4 * idx;
      const argPtr = Module.allocateUTF8(arg);
      Module.setValue(argvPtr, argPtr, "*");
    });
    this.writeSystem({
      type: "console.warn",
      data: "WebR is using `PostMessage` communication channel, nested R REPLs are not available."
    });
    Module._Rf_initialize_R(argc, argv);
    Module._setup_Rmainloop();
    Module._R_ReplDLLinit();
    Module._R_ReplDLLdo1();
    void __privateGet(this, _asyncREPL).call(this);
  }
  setDispatchHandler(dispatch) {
    __privateSet(this, _dispatch3, dispatch);
  }
  async request(msg, transferables) {
    const req = newRequest(msg, transferables);
    const { resolve, promise: prom } = promiseHandles();
    __privateGet(this, _parked2).set(req.data.uuid, resolve);
    this.write(req);
    return prom;
  }
  setInterrupt() {
    return;
  }
  handleInterrupt() {
    return;
  }
  onMessageFromMainThread(message) {
    const msg = message;
    const uuid = msg.data.uuid;
    const resolve = __privateGet(this, _parked2).get(uuid);
    if (resolve) {
      __privateGet(this, _parked2).delete(uuid);
      resolve(msg.data.resp);
    } else {
      console.warn("Can't find request.");
    }
  }
};
_ep3 = new WeakMap();
_parked2 = new WeakMap();
_dispatch3 = new WeakMap();
_promptDepth = new WeakMap();
_asyncREPL = new WeakMap();

// webR/chan/channel-common.ts
var ChannelType = {
  Automatic: 0,
  SharedArrayBuffer: 1,
  ServiceWorker: 2,
  PostMessage: 3
};
function newChannelMain(data) {
  switch (data.channelType) {
    case ChannelType.SharedArrayBuffer:
      return new SharedBufferChannelMain(data);
    case ChannelType.ServiceWorker:
      return new ServiceWorkerChannelMain(data);
    case ChannelType.PostMessage:
      return new PostMessageChannelMain(data);
    case ChannelType.Automatic:
    default:
      if (typeof SharedArrayBuffer !== "undefined") {
        return new SharedBufferChannelMain(data);
      } else {
        return new PostMessageChannelMain(data);
      }
  }
}

// webR/config.ts
var BASE_URL = IN_NODE ? __dirname + "/" : "./";
var PKG_BASE_URL = "https://repo.r-wasm.org";
var WEBR_VERSION = "0.4.3-dev";

// webR/robj-main.ts
function isRObject2(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && "payloadType" in value && isWebRPayloadPtr(value._payload);
}
function isRNull(value) {
  return isRObject2(value) && value._payload.obj.type === "null";
}
function isRSymbol(value) {
  return isRObject2(value) && value._payload.obj.type === "symbol";
}
function isRPairlist(value) {
  return isRObject2(value) && value._payload.obj.type === "pairlist";
}
function isREnvironment(value) {
  return isRObject2(value) && value._payload.obj.type === "environment";
}
function isRLogical(value) {
  return isRObject2(value) && value._payload.obj.type === "logical";
}
function isRInteger(value) {
  return isRObject2(value) && value._payload.obj.type === "integer";
}
function isRDouble(value) {
  return isRObject2(value) && value._payload.obj.type === "double";
}
function isRComplex(value) {
  return isRObject2(value) && value._payload.obj.type === "complex";
}
function isRCharacter(value) {
  return isRObject2(value) && value._payload.obj.type === "character";
}
function isRList(value) {
  return isRObject2(value) && value._payload.obj.type === "list";
}
function isRRaw(value) {
  return isRObject2(value) && value._payload.obj.type === "raw";
}
function isRCall(value) {
  return isRObject2(value) && value._payload.obj.type === "call";
}
function isRFunction(value) {
  var _a;
  return Boolean(isRObject2(value) && ((_a = value._payload.obj.methods) == null ? void 0 : _a.includes("exec")));
}

// webR/proxy.ts
function empty() {
  return;
}
function targetAsyncIterator(chan, proxy) {
  return async function* () {
    const msg = {
      type: "callRObjectMethod",
      data: {
        payload: proxy._payload,
        prop: "getPropertyValue",
        args: [{ payloadType: "raw", obj: "length" }],
        shelter: void 0
        // TODO
      }
    };
    const reply = await chan.request(msg);
    if (typeof reply.obj !== "number") {
      throw new WebRError("Cannot iterate over object, unexpected type for length property.");
    }
    for (let i = 1; i <= reply.obj; i++) {
      yield proxy.get(i);
    }
  };
}
function targetMethod(chan, prop, payload) {
  return async (..._args) => {
    const args = _args.map((arg) => {
      if (isRObject2(arg)) {
        return arg._payload;
      }
      return {
        obj: replaceInObject(arg, isRObject2, (obj) => obj._payload),
        payloadType: "raw"
      };
    });
    const msg = {
      type: "callRObjectMethod",
      data: { payload, prop, args }
    };
    const reply = await chan.request(msg);
    switch (reply.payloadType) {
      case "ptr":
        return newRProxy(chan, reply);
      case "raw": {
        const proxyReply = replaceInObject(
          reply,
          isWebRPayloadPtr,
          (obj, chan2) => newRProxy(chan2, obj),
          chan
        );
        return proxyReply.obj;
      }
    }
  };
}
async function newRObject(chan, objType, shelter, ...args) {
  const msg = {
    type: "newRObject",
    data: {
      objType,
      args: replaceInObject(args, isRObject2, (obj) => obj._payload),
      shelter
    }
  };
  const payload = await chan.request(msg);
  switch (payload.payloadType) {
    case "raw":
      throw new WebRPayloadError("Unexpected raw payload type returned from newRObject");
    case "ptr":
      return newRProxy(chan, payload);
  }
}
function newRProxy(chan, payload) {
  var _a;
  const proxy = new Proxy(
    // Assume we are proxying an RFunction if the methods list contains 'exec'.
    ((_a = payload.obj.methods) == null ? void 0 : _a.includes("exec")) ? Object.assign(empty, { ...payload }) : payload,
    {
      get: (_, prop) => {
        var _a2;
        if (prop === "_payload") {
          return payload;
        } else if (prop === Symbol.asyncIterator) {
          return targetAsyncIterator(chan, proxy);
        } else if ((_a2 = payload.obj.methods) == null ? void 0 : _a2.includes(prop.toString())) {
          return targetMethod(chan, prop.toString(), payload);
        }
      },
      apply: async (_, _thisArg, args) => {
        const res = await newRProxy(chan, payload).exec(...args);
        return isRFunction(res) ? res : res.toJs();
      }
    }
  );
  return proxy;
}
function newRClassProxy(chan, shelter, objType) {
  return new Proxy(RObject, {
    construct: (_, args) => newRObject(chan, objType, shelter, ...args),
    get: (_, prop) => {
      return targetMethod(chan, prop.toString());
    }
  });
}

// webR/console.ts
var _stdout, _stderr, _prompt, _canvasImage, _canvasNewPage, _defaultStdout, _defaultStderr, _defaultPrompt, _defaultCanvasImage, _defaultCanvasNewPage, _run, run_fn;
var Console = class {
  /**
   * @param {ConsoleCallbacks} callbacks A list of webR Console callbacks to
   * be used for this console.
   * @param {WebROptions} options The options to use for the new instance of
   * webR started to support this console.
   */
  constructor(callbacks = {}, options = {
    REnv: {
      R_HOME: "/usr/lib/R",
      FONTCONFIG_PATH: "/etc/fonts",
      R_ENABLE_JIT: "0"
    }
  }) {
    /*
     * Start the asynchronous infinite loop
     *
     * This loop waits for output from webR and dispatches callbacks based on the
     * message received.
     *
     * The promise returned by this asynchronous function resolves only once the
     * webR communication channel has closed.
     */
    __privateAdd(this, _run);
    /** Called when webR outputs to ``stdout`` */
    __privateAdd(this, _stdout, void 0);
    /** Called when webR outputs to ``stderr`` */
    __privateAdd(this, _stderr, void 0);
    /** Called when webR prompts for input */
    __privateAdd(this, _prompt, void 0);
    /** Called when webR writes to the HTML canvas element */
    __privateAdd(this, _canvasImage, void 0);
    /** Called when webR creates a new plot */
    __privateAdd(this, _canvasNewPage, void 0);
    /**
     * The default function called when webR outputs to ``stdout``
     * @param {string} text The line sent to stdout by webR.
     */
    __privateAdd(this, _defaultStdout, (text) => {
      console.log(text);
    });
    /**
     * The default function called when webR outputs to ``stderr``
     * @param {string} text The line sent to stderr by webR.
     */
    __privateAdd(this, _defaultStderr, (text) => {
      console.error(text);
    });
    /**
     * The default function called when webR writes out a prompt
     * @param {string} text The text content of the prompt.
     */
    __privateAdd(this, _defaultPrompt, (text) => {
      const input = prompt(text);
      if (input)
        this.stdin(`${input}
`);
    });
    /**
     * The default function called when webR writes to HTML canvas
     * @param {ImageBitmap} image An ImageBitmap containing the image data.
     */
    __privateAdd(this, _defaultCanvasImage, (image) => {
      if (IN_NODE) {
        throw new Error("Plotting with HTML canvas is not yet supported under Node");
      }
      this.canvas.getContext("2d").drawImage(image, 0, 0);
    });
    /**
     * The default function called when webR creates a new plot
     */
    __privateAdd(this, _defaultCanvasNewPage, () => {
      if (IN_NODE) {
        throw new Error("Plotting with HTML canvas is not yet supported under Node");
      }
      this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    });
    this.webR = new WebR(options);
    if (!IN_NODE) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("width", "1008");
      this.canvas.setAttribute("height", "1008");
    }
    __privateSet(this, _stdout, callbacks.stdout || __privateGet(this, _defaultStdout));
    __privateSet(this, _stderr, callbacks.stderr || __privateGet(this, _defaultStderr));
    __privateSet(this, _prompt, callbacks.prompt || __privateGet(this, _defaultPrompt));
    __privateSet(this, _canvasImage, callbacks.canvasImage || __privateGet(this, _defaultCanvasImage));
    __privateSet(this, _canvasNewPage, callbacks.canvasNewPage || __privateGet(this, _defaultCanvasNewPage));
    void this.webR.evalRVoid("options(device=webr::canvas)");
  }
  /**
   * Write a line of input to webR's REPL through ``stdin``
   * @param {string} input A line of input text.
   */
  stdin(input) {
    this.webR.writeConsole(input);
  }
  /**
   * Interrupt a long running R computation and return to the prompt
   */
  interrupt() {
    this.webR.interrupt();
  }
  /**
   * Start the webR console
   */
  run() {
    void __privateMethod(this, _run, run_fn).call(this);
  }
};
_stdout = new WeakMap();
_stderr = new WeakMap();
_prompt = new WeakMap();
_canvasImage = new WeakMap();
_canvasNewPage = new WeakMap();
_defaultStdout = new WeakMap();
_defaultStderr = new WeakMap();
_defaultPrompt = new WeakMap();
_defaultCanvasImage = new WeakMap();
_defaultCanvasNewPage = new WeakMap();
_run = new WeakSet();
run_fn = async function() {
  for (; ; ) {
    const output = await this.webR.read();
    switch (output.type) {
      case "stdout":
        __privateGet(this, _stdout).call(this, output.data);
        break;
      case "stderr":
        __privateGet(this, _stderr).call(this, output.data);
        break;
      case "prompt":
        __privateGet(this, _prompt).call(this, output.data);
        break;
      case "canvas":
        if (output.data.event === "canvasImage") {
          __privateGet(this, _canvasImage).call(this, output.data.image);
        } else if (output.data.event === "canvasNewPage") {
          __privateGet(this, _canvasNewPage).call(this);
        }
        break;
      case "closed":
        return;
      default:
        console.warn(`Unhandled output type for webR Console: ${output.type}.`);
    }
  }
};

// webR/webr-main.ts
var defaultEnv = {
  FONTCONFIG_PATH: "/etc/fonts",
  R_HOME: "/usr/lib/R",
  R_ENABLE_JIT: "0",
  WEBR: "1",
  WEBR_VERSION
};
var defaultOptions = {
  RArgs: [],
  REnv: defaultEnv,
  baseUrl: BASE_URL,
  serviceWorkerUrl: "",
  repoUrl: PKG_BASE_URL,
  homedir: "/home/web_user",
  interactive: true,
  channelType: ChannelType.Automatic,
  createLazyFilesystem: true
};
var _chan, _initialised, _handleSystemMessages, handleSystemMessages_fn;
var WebR = class {
  constructor(options = {}) {
    __privateAdd(this, _handleSystemMessages);
    __privateAdd(this, _chan, void 0);
    __privateAdd(this, _initialised, void 0);
    this.version = WEBR_VERSION;
    this.FS = {
      lookupPath: async (path) => {
        const msg = { type: "lookupPath", data: { path } };
        const payload = await __privateGet(this, _chan).request(msg);
        return payload.obj;
      },
      mkdir: async (path) => {
        const msg = { type: "mkdir", data: { path } };
        const payload = await __privateGet(this, _chan).request(msg);
        return payload.obj;
      },
      mount: async (type, options, mountpoint) => {
        let promises = [];
        if ("blobs" in options && options.blobs) {
          promises = [...promises, ...options.blobs.map((item) => {
            if (item.data instanceof Blob) {
              return item.data.arrayBuffer().then((data) => {
                item.data = new Uint8Array(data);
              });
            } else {
              return Promise.resolve();
            }
          })];
        }
        if ("packages" in options && options.packages) {
          promises = [...promises, ...options.packages.map((pkg) => {
            if (pkg.blob instanceof Blob) {
              return pkg.blob.arrayBuffer().then((data) => {
                pkg.blob = new Uint8Array(data);
              });
            } else {
              return Promise.resolve();
            }
          })];
        }
        await Promise.all(promises);
        const msg = { type: "mount", data: { type, options, mountpoint } };
        await __privateGet(this, _chan).request(msg);
      },
      syncfs: async (populate) => {
        const msg = { type: "syncfs", data: { populate } };
        await __privateGet(this, _chan).request(msg);
      },
      readFile: async (path, flags) => {
        const msg = { type: "readFile", data: { path, flags } };
        const payload = await __privateGet(this, _chan).request(msg);
        return payload.obj;
      },
      rmdir: async (path) => {
        const msg = { type: "rmdir", data: { path } };
        await __privateGet(this, _chan).request(msg);
      },
      writeFile: async (path, data, flags) => {
        const msg = { type: "writeFile", data: { path, data, flags } };
        await __privateGet(this, _chan).request(msg);
      },
      unlink: async (path) => {
        const msg = { type: "unlink", data: { path } };
        await __privateGet(this, _chan).request(msg);
      },
      unmount: async (mountpoint) => {
        const msg = { type: "unmount", data: { path: mountpoint } };
        await __privateGet(this, _chan).request(msg);
      }
    };
    const config = {
      ...defaultOptions,
      ...options,
      REnv: {
        ...defaultOptions.REnv,
        ...options.REnv
      }
    };
    __privateSet(this, _chan, newChannelMain(config));
    this.objs = {};
    this.Shelter = newShelterProxy(__privateGet(this, _chan));
    __privateSet(this, _initialised, __privateGet(this, _chan).initialised.then(async () => {
      this.globalShelter = await new this.Shelter();
      this.RObject = this.globalShelter.RObject;
      this.RLogical = this.globalShelter.RLogical;
      this.RInteger = this.globalShelter.RInteger;
      this.RDouble = this.globalShelter.RDouble;
      this.RComplex = this.globalShelter.RComplex;
      this.RCharacter = this.globalShelter.RCharacter;
      this.RRaw = this.globalShelter.RRaw;
      this.RList = this.globalShelter.RList;
      this.RDataFrame = this.globalShelter.RDataFrame;
      this.RPairlist = this.globalShelter.RPairlist;
      this.REnvironment = this.globalShelter.REnvironment;
      this.RSymbol = this.globalShelter.RSymbol;
      this.RString = this.globalShelter.RString;
      this.RCall = this.globalShelter.RCall;
      this.objs = {
        baseEnv: await this.RObject.getPersistentObject("baseEnv"),
        globalEnv: await this.RObject.getPersistentObject("globalEnv"),
        null: await this.RObject.getPersistentObject("null"),
        true: await this.RObject.getPersistentObject("true"),
        false: await this.RObject.getPersistentObject("false"),
        na: await this.RObject.getPersistentObject("na")
      };
      void __privateMethod(this, _handleSystemMessages, handleSystemMessages_fn).call(this);
    }));
  }
  /**
   * @returns {Promise<void>} A promise that resolves once webR has been
   * initialised.
   */
  async init() {
    return __privateGet(this, _initialised);
  }
  /**
   * Close the communication channel between the main thread and the worker
   * thread cleanly. Once this has been executed, webR will be unable to
   * continue.
   */
  close() {
    __privateGet(this, _chan).close();
  }
  /**
   * Read from the communication channel and return an output message.
   * @returns {Promise<Message>} The output message
   */
  async read() {
    return await __privateGet(this, _chan).read();
  }
  /**
   * Flush the output queue in the communication channel and return all output
   * messages.
   * @returns {Promise<Message[]>} The output messages
   */
  async flush() {
    return await __privateGet(this, _chan).flush();
  }
  /**
   * Send a message to the communication channel input queue.
   * @param {Message} msg Message to be added to the input queue.
   */
  write(msg) {
    __privateGet(this, _chan).write(msg);
  }
  /**
   * Send a line of standard input to the communication channel input queue.
   * @param {string} input Message to be added to the input queue.
   */
  writeConsole(input) {
    this.write({ type: "stdin", data: input + "\n" });
  }
  /** Attempt to interrupt a running R computation. */
  interrupt() {
    __privateGet(this, _chan).interrupt();
  }
  /**
   * Install a list of R packages from Wasm binary package repositories.
   * @param {string | string[]} packages An string or array of strings
   *   containing R package names.
   * @param {InstallPackagesOptions} [options] Options to be used when
   *   installing webR packages.
   */
  async installPackages(packages, options) {
    const op = Object.assign({
      quiet: false,
      mount: true
    }, options);
    const msg = { type: "installPackages", data: { name: packages, options: op } };
    await __privateGet(this, _chan).request(msg);
  }
  /**
   * Destroy an R object reference.
   * @param {RObject} x An R object reference.
   */
  async destroy(x) {
    await this.globalShelter.destroy(x);
  }
  /**
   * Evaluate the given R code.
   *
   * Stream outputs and any conditions raised during execution are written to
   * the JavaScript console.
   * @param {string} code The R code to evaluate.
   * @param {EvalROptions} [options] Options for the execution environment.
   * @returns {Promise<RObject>} The result of the computation.
   */
  async evalR(code, options) {
    return this.globalShelter.evalR(code, options);
  }
  async evalRVoid(code, options) {
    return this.evalRRaw(code, "void", options);
  }
  async evalRBoolean(code, options) {
    return this.evalRRaw(code, "boolean", options);
  }
  async evalRNumber(code, options) {
    return this.evalRRaw(code, "number", options);
  }
  async evalRString(code, options) {
    return this.evalRRaw(code, "string", options);
  }
  async evalRRaw(code, outputType, options = {}) {
    const opts = replaceInObject(options, isRObject2, (obj) => obj._payload);
    const msg = {
      type: "evalRRaw",
      data: { code, options: opts, outputType }
    };
    const payload = await __privateGet(this, _chan).request(msg);
    switch (payload.payloadType) {
      case "raw":
        return payload.obj;
      case "ptr":
        throw new WebRPayloadError("Unexpected ptr payload type returned from evalRVoid");
    }
  }
  async invokeWasmFunction(ptr, ...args) {
    const msg = {
      type: "invokeWasmFunction",
      data: { ptr, args }
    };
    const resp = await __privateGet(this, _chan).request(msg);
    return resp.obj;
  }
};
_chan = new WeakMap();
_initialised = new WeakMap();
_handleSystemMessages = new WeakSet();
handleSystemMessages_fn = async function() {
  for (; ; ) {
    const msg = await __privateGet(this, _chan).readSystem();
    switch (msg.type) {
      case "setTimeoutWasm":
        setTimeout(
          (ptr, args) => {
            void this.invokeWasmFunction(ptr, ...args);
          },
          msg.data.delay,
          msg.data.ptr,
          msg.data.args
        );
        break;
      case "console.log":
        console.log(msg.data);
        break;
      case "console.warn":
        console.warn(msg.data);
        break;
      case "console.error":
        console.error(msg.data);
        break;
      case "close":
        __privateGet(this, _chan).close();
        break;
      default:
        throw new WebRError("Unknown system message type `" + msg.type + "`");
    }
  }
};
var _id, _chan2, _initialised2;
var Shelter = class {
  /** @internal */
  constructor(chan) {
    __privateAdd(this, _id, "");
    __privateAdd(this, _chan2, void 0);
    __privateAdd(this, _initialised2, false);
    __privateSet(this, _chan2, chan);
  }
  /** @internal */
  async init() {
    if (__privateGet(this, _initialised2)) {
      return;
    }
    const msg = { type: "newShelter" };
    const payload = await __privateGet(this, _chan2).request(msg);
    __privateSet(this, _id, payload.obj);
    this.RObject = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "object");
    this.RLogical = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "logical");
    this.RInteger = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "integer");
    this.RDouble = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "double");
    this.RComplex = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "complex");
    this.RCharacter = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "character");
    this.RRaw = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "raw");
    this.RList = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "list");
    this.RDataFrame = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "dataframe");
    this.RPairlist = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "pairlist");
    this.REnvironment = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "environment");
    this.RSymbol = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "symbol");
    this.RString = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "string");
    this.RCall = newRClassProxy(__privateGet(this, _chan2), __privateGet(this, _id), "call");
    __privateSet(this, _initialised2, true);
  }
  async purge() {
    const msg = {
      type: "shelterPurge",
      data: __privateGet(this, _id)
    };
    await __privateGet(this, _chan2).request(msg);
  }
  async destroy(x) {
    const msg = {
      type: "shelterDestroy",
      data: { id: __privateGet(this, _id), obj: x._payload }
    };
    await __privateGet(this, _chan2).request(msg);
  }
  async size() {
    const msg = {
      type: "shelterSize",
      data: __privateGet(this, _id)
    };
    const payload = await __privateGet(this, _chan2).request(msg);
    return payload.obj;
  }
  /**
   * Evaluate the given R code.
   *
   * Stream outputs and any conditions raised during execution are written to
   * the JavaScript console. The returned R object is protected by the shelter.
   * @param {string} code The R code to evaluate.
   * @param {EvalROptions} [options] Options for the execution environment.
   * @returns {Promise<RObject>} The result of the computation.
   */
  async evalR(code, options = {}) {
    const opts = replaceInObject(options, isRObject2, (obj) => obj._payload);
    const msg = {
      type: "evalR",
      data: { code, options: opts, shelter: __privateGet(this, _id) }
    };
    const payload = await __privateGet(this, _chan2).request(msg);
    switch (payload.payloadType) {
      case "raw":
        throw new WebRPayloadError("Unexpected payload type returned from evalR");
      default:
        return newRProxy(__privateGet(this, _chan2), payload);
    }
  }
  /**
   * Evaluate the given R code, capturing output.
   *
   * Stream outputs and conditions raised during execution are captured and
   * returned as part of the output of this function. Returned R objects are
   * protected by the shelter.
   * @param {string} code The R code to evaluate.
   * @param {EvalROptions} [options] Options for the execution environment.
   * @returns {Promise<{
   *   result: RObject,
   *   output: { type: string; data: any }[],
   *   images: ImageBitmap[]
   * }>} An object containing the result of the computation, an array of output,
   *   and an array of captured plots.
   */
  async captureR(code, options = {}) {
    const opts = replaceInObject(options, isRObject2, (obj) => obj._payload);
    const msg = {
      type: "captureR",
      data: {
        code,
        options: opts,
        shelter: __privateGet(this, _id)
      }
    };
    const payload = await __privateGet(this, _chan2).request(msg);
    switch (payload.payloadType) {
      case "ptr":
        throw new WebRPayloadError("Unexpected payload type returned from evalR");
      case "raw": {
        const data = payload.obj;
        const result = newRProxy(__privateGet(this, _chan2), data.result);
        const output = data.output;
        const images = data.images;
        for (let i = 0; i < output.length; ++i) {
          if (output[i].type !== "stdout" && output[i].type !== "stderr") {
            output[i].data = newRProxy(__privateGet(this, _chan2), output[i].data);
          }
        }
        return { result, output, images };
      }
    }
  }
};
_id = new WeakMap();
_chan2 = new WeakMap();
_initialised2 = new WeakMap();
function newShelterProxy(chan) {
  return new Proxy(Shelter, {
    construct: async () => {
      const out = new Shelter(chan);
      await out.init();
      return out;
    }
  });
}
export {
  ChannelType,
  Console,
  Shelter,
  WebR,
  WebRChannelError,
  WebRError,
  WebRPayloadError,
  WebRWorkerError,
  isRCall,
  isRCharacter,
  isRComplex,
  isRDouble,
  isREnvironment,
  isRFunction,
  isRInteger,
  isRList,
  isRLogical,
  isRNull,
  isRObject2 as isRObject,
  isRPairlist,
  isRRaw,
  isRSymbol,
  isUUID as isShelterID
};
//# sourceMappingURL=webr.mjs.map
