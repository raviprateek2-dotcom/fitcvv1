
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var pdfjsLib;

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.shadow = exports.removeNullCharacters = exports.ReadableStream = exports.PasswordResponses = exports.PasswordException = exports.Parser = exports.PDF_VERSION_REGEXP = exports.PDF_HEADER_REGEXP = exports.OPS = exports.OperatorList = exports.OBJECT_STREAM = exports.numerosi = exports.normalizeUnicode = exports.normalizeRect = exports.MissingDataException = exports.LINEARIZED = exports.Lexer = exports.isWhiteSpace = exports.isString = exports.isStream = exports.isSpace = exports.isRef = exports.isPDFFunction = exports.isName = exports.isNum = exports.isHexDigit = exports.isEOF = exports.isDict = exports.isCmd = exports.isBool = exports.isArray = exports.InvalidPDFException = exports.isSentinal = exports.isChar = exports.ImageKind = exports.getVerbosityLevel = exports.getLookupTableFactory = exports.getWarn = exports.getShadingPatternFromIR = exports.getAxialShadingFromIR = exports.FONT_IDENTITY_MATRIX = exports.FormatError = exports.DocStats = exports.Dict = exports.createValidAbsoluteUrl = exports.createPromiseCapability = exports.createObjectURL = exports.createImageCache = exports.createCanvas = exports.clearPrimitiveCaches = exports.assert = exports.arrayBytePool = exports.AnnotationStorage = exports.AnnotationBorderStyleType = exports.Annotation = exports.IDENTITY_MATRIX = exports.CIRCULAR_REF = exports.AbortException = exports.Util = exports.UNSUPPORTED_FEATURES = exports.UnknownErrorException = exports.UnexpectedResponseException = exports.stringToPDFString = exports.stringToBytes = exports.setVerbosityLevel = void 0;
exports.warn = warn;
const CIRCULAR_REF = Symbol("CIRCULAR_REF");
exports.CIRCULAR_REF = CIRCULAR_REF;
function getVerbosityLevel() {
  return shadow(getVerbosityLevel, "verbosity", 1);
}
function setVerbosityLevel(level) {
  if (typeof level !== "number" || !Number.isInteger(level) || level < 0) {
    throw new Error(`Invalid verbosity level: ${level}`);
  }
  shadow(getVerbosityLevel, "verbosity", level);
}
function getLookupTableFactory() {
  return shadow(getLookupTableFactory, "lookupTableFactory", function (canvas) {
    return canvas.getContext("2d").createImageData(1, 1).data;
  });
}
function warn(msg) {
  if (getVerbosityLevel() >= 1) {
    console.warn(msg);
  }
}
function getWarn() {
  if (getVerbosityLevel() >= 1) {
    return console.warn.bind(console);
  }
  return () => {};
}
class AbortException extends Error {
  constructor(msg) {
    super(msg);
    this.name = "AbortException";
  }
}
exports.AbortException = AbortException;
class MissingDataException extends Error {
  constructor(begin, end) {
    super(`Missing data [${begin}, ${end})`);
    this.name = "MissingDataException";
    this.begin = begin;
    this.end = end;
  }
}
exports.MissingDataException = MissingDataException;
class InvalidPDFException extends Error {
  constructor(msg) {
    super(msg);
    this.name = "InvalidPDFException";
  }
}
exports.InvalidPDFException = InvalidPDFException;
class UnexpectedResponseException extends Error {
  constructor(msg, status) {
    super(msg);
    this.name = "UnexpectedResponseException";
    this.status = status;
  }
}
exports.UnexpectedResponseException = UnexpectedResponseException;
class UnknownErrorException extends Error {
  constructor(msg, details) {
    super(msg);
    this.name = "UnknownErrorException";
    this.details = details;
  }
}
exports.UnknownErrorException = UnknownErrorException;
class FormatError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "FormatError";
  }
}
exports.FormatError = FormatError;
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
exports.PasswordResponses = PasswordResponses;
class PasswordException extends Error {
  constructor(msg, code) {
    super(msg);
    this.name = "PasswordException";
    this.code = code;
  }
}
exports.PasswordException = PasswordException;
const UNSUPPORTED_FEATURES = {
  forms: "forms",
  javaScript: "javaScript",
  smask: "smask",
  shadingPattern: "shadingPattern",
  font: "font"
};
exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
const ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};
exports.ImageKind = ImageKind;
const AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};
exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
const PDF_VERSION_REGEXP = /^[1-9]\.[0-9]$/;
exports.PDF_VERSION_REGEXP = PDF_VERSION_REGEXP;
const PDF_HEADER_REGEXP = /^%PDF-(\d\.\d)/;
exports.PDF_HEADER_REGEXP = PDF_HEADER_REGEXP;
const LINEARIZED = {
  dictionary: null,
  isLinearized: false,
  isFirstPageLoaded: false,
  isLastPageLoaded: false,
  pageNumbers: null,
  implicitFirstPage: false
};
exports.LINEARIZED = LINEARIZED;
const OBJECT_STREAM = {
  num: 0,
  gen: 0,
  collection: [],
  first: 0
};
exports.OBJECT_STREAM = OBJECT_STREAM;
const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
const OPS = {
  dependency: 1,
  setStrokeRGBColor: 2,
  setStrokeGray: 3,
  setStrokeCMYKColor: 4,
  setStrokeRGBColorN: 5,
  setStrokeGrayN: 6,
  setStrokeCMYKN: 7,
  setStrokeColor: 8,
  setStrokeColorN: 9,
  setStrokePattern: 10,
  setStrokePatternN: 11,
  shadingFill: 12,
  setFillRGBColor: 13,
  setFillGray: 14,
  setFillCMYKColor: 15,
  setFillRGBColorN: 16,
  setFillGrayN: 17,
  setFillCMYKN: 18,
  setFillColor: 19,
  setFillColorN: 20,
  setFillPattern: 21,
  setFillPatternN: 22,
  setRenderingIntent: 23,
  setFlatness: 24,
  setLineCap: 25,
  setLineJoin: 26,
  setMiterLimit: 27,
  setLineWidth: 28,
  setDash: 29,
  setGState: 30,
  save: 31,
  restore: 32,
  transform: 33,
  moveTo: 34,
  lineTo: 35,
  curveTo: 36,
  curveTo2: 37,
  curveTo3: 38,
  closePath: 39,
  rectangle: 40,
  stroke: 41,
  closeStroke: 42,
  fill: 43,
  eoFill: 44,
  fillStroke: 45,
  eoFillStroke: 46,
  closeFillStroke: 47,
  closeEOFillStroke: 48,
  endPath: 49,
  clip: 50,
  eoClip: 51,
  beginText: 52,
  endText: 53,
  setCharSpacing: 54,
  setWordSpacing: 55,
  setHScale: 56,
  setLeading: 57,
  setFont: 58,
  setTextRenderingMode: 59,
  setTextRise: 60,
  moveText: 61,
  setLeadingMoveText: 62,
  setTextMatrix: 63,
  nextTextLine: 64,
  showText: 65,
  showSpacedText: 66,
  nextTextLineShowText: 67,
  nextTextLineShowSpacedText: 68,
  setCharPantomSpace: 69,
  setCharSpace: 70,
  paintXObject: 71,
  markPoint: 72,
  markPointProps: 73,
  beginMarkedContent: 74,
  beginMarkedContentProps: 75,
  endMarkedContent: 76,
  beginCompat: 77,
  endCompat: 78,
  paintFormXObjectBegin: 79,
  paintFormXObjectEnd: 80,
  beginGroup: 81,
  endGroup: 82,
  beginTilingPattern: 83,
  endTilingPattern: 84,
  paintShading: 85,
  paintImageMaskXObject: 86,
  paintImageMaskXObjectGroup: 87,
  paintImageXObject: 88,
  paintInlineImageXObject: 89,
  paintInlineImageXObjectGroup: 90,
  paintImageXObjectRepeat: 91,
  paintInlineImageXObjectRepeat: 92,
  paintJpegXObject: 93,
  paintSoftMaskXObject: 94,
  paintJpxXObject: 95,
  beginAnnotations: 96,
  endAnnotations: 97,
  beginAnnotation: 98,
  endAnnotation: 99,
  setTextDirection: 100,
  setOptionalContent: 101,
  paintDefineType3Font: 102,
  beginTextCommand: 103,
  endTextCommand: 104,
  applyTextTransform: 105,
  setZeroHandling: 106,
  beginMarkedContentReplaced: 107
};
exports.OPS = OPS;
function getAxialShadingFromIR(ir) {
  const type = ir[0];
  if (type !== "axial") {
    throw new FormatError("Invalid Axial Shading IR");
  }
  return {
    type: "axial",
    coords: ir[1],
    domain: ir[2],
    func: getShadingPatternFromIR(ir[3]),
    extend: ir[4]
  };
}
function getShadingPatternFromIR(ir) {
  if (!ir) {
    return null;
  }
  if (typeof ir === "number") {
    return {
      type: "const",
      values: ir
    };
  }
  const type = ir[0];
  switch (type) {
    case "const":
      return {
        type: "const",
        values: ir[1]
      };
    case "func":
      return {
        type: "func",
        func: ir[1],
        domain: ir[2],
        range: ir[3],
        bounds: ir[4],
        matrix: ir[5]
      };
    case "sum":
      return {
        type: "sum",
        patterns: ir[1].map(getShadingPatternFromIR)
      };
    case "lerp":
      return {
        type: "lerp",
        patterns: ir[1].map(getShadingPatternFromIR)
      };
    default:
      throw new FormatError(`Unknown Shading Pattern IR: "${type}"`);
  }
}
function isSpace(ch) {
  return ch === 0x20 || ch === 0x09 || ch === 0x0d || ch === 0x0a;
}
function isWhiteSpace(ch) {
  return isSpace(ch) || ch === 0 || ch === 0x0c;
}
function isBool(v) {
  return typeof v === "boolean";
}
function isInt(v) {
  return typeof v === "number" && (v | 0) === v;
}
function isNum(v) {
  return typeof v === "number";
}
function isString(v) {
  return typeof v === "string";
}
function isName(v) {
  return v instanceof Name;
}
function isCmd(v, cmd) {
  return v instanceof Cmd && v.cmd === cmd;
}
function isDict(v, type) {
  if (!(v instanceof Dict)) {
    return false;
  }
  if (!type) {
    return true;
  }
  const dictType = v.get("Type");
  return isName(dictType) && dictType.name === type;
}
function isRef(v) {
  return v instanceof Ref;
}
function isRefSet(v) {
  return v instanceof RefSet;
}
function isStream(v) {
  return typeof v === "object" && v !== null && "getReader" in v;
}
function isArray(v) {
  return Array.isArray(v);
}
function isPDFFunction(v) {
  if (v instanceof PDFFunction) {
    return true;
  }
  let dict;
  if (!isStream(v)) {
    return false;
  }
  dict = v.dict;
  return isDict(dict) && dict.has("FunctionType");
}
function clearPrimitiveCaches() {
  Cmd.clearCache();
  Name.clearCache();
}
class Name {
  constructor(name) {
    if (typeof name !== "string") {
      throw new Error("Name: The argument must be a string.");
    }
    this.name = name;
  }
  static get(name) {
    const nameValue = Name.cache[name];
    return nameValue || (Name.cache[name] = new Name(name));
  }
  static clearCache() {
    Name.cache = Object.create(null);
  }
}
exports.Name = Name;
Name.cache = Object.create(null);
class Cmd {
  constructor(cmd) {
    if (typeof cmd !== "string") {
      throw new Error("Cmd: The argument must be a string.");
    }
    this.cmd = cmd;
  }
  static get(cmd) {
    const cmdValue = Cmd.cache[cmd];
    return cmdValue || (Cmd.cache[cmd] = new Cmd(cmd));
  }
  static clearCache() {
    Cmd.cache = Object.create(null);
  }
}
exports.Cmd = Cmd;
Cmd.cache = Object.create(null);
class Dict {
  constructor(xref) {
    this._map = Object.create(null);
    this.xref = xref;
    this.objId = null;
    this.suppressEncryption = false;
    this.isView = false;
  }
  assignXref(newXref) {
    this.xref = newXref;
  }
  get(key) {
    const value = this._map[key];
    if (value === undefined && this.isView) {
      const {
        dict
      } = this.view;
      if (dict instanceof Dict && dict.has(key)) {
        return dict.get(key);
      }
    }
    return value;
  }
  getArray(key) {
    let value = this._map[key];
    if (value === undefined && this.isView) {
      const {
        dict
      } = this.view;
      if (dict instanceof Dict && dict.has(key)) {
        value = dict.get(key);
      }
    }
    if (!this.xref) {
      return value;
    }
    return this.xref.fetchIfRef(value);
  }
  getAsync(key) {
    return this.xref.fetchIfRefAsync(this.get(key));
  }
  getMaybe(key) {
    if (this.has(key)) {
      return this.getArray(key);
    }
    return null;
  }
  getKeys() {
    if (!this.isView) {
      return Object.keys(this._map);
    }
    const {
      dict
    } = this.view;
    if (!(dict instanceof Dict)) {
      return Object.keys(this._map);
    }
    const mainKeys = Object.keys(this._map);
    const fallbackKeys = dict.getKeys();
    const allKeys = new Set([...mainKeys, ...fallbackKeys]);
    return [...allKeys];
  }
  getRaw(key) {
    return this._map[key];
  }
  set(key, value) {
    if (typeof key !== "string") {
      throw new Error(`Dict.set: The key must be a string, got "${key}".`);
    }
    this._map[key] = value;
  }
  has(key) {
    if (this.isView) {
      const {
        dict
      } = this.view;
      return this._map[key] !== undefined || dict instanceof Dict && dict.has(key);
    }
    return this._map[key] !== undefined;
  }
  forEach(callback) {
    for (const key of this.getKeys()) {
      callback(key, this.get(key));
    }
  }
  static get empty() {
    const emptyDict = new Dict(null);
    Object.defineProperty(this, "empty", {
      value: emptyDict,
      enumerable: true,
      configurable: false,
      writable: false
    });
    return emptyDict;
  }
  get size() {
    return this.getKeys().length;
  }
  static merge({
    xref,
    dictArray
  }) {
    const mergedDict = new Dict(xref);
    for (const dict of dictArray) {
      if (!(dict instanceof Dict)) {
        continue;
      }
      for (const key of dict.getKeys()) {
        if (!mergedDict.has(key)) {
          mergedDict.set(key, dict.getRaw(key));
        }
      }
    }
    return mergedDict;
  }
}
exports.Dict = Dict;
class Ref {
  constructor(num, gen) {
    this.num = num;
    this.gen = gen;
  }
  toString() {
    if (this.gen === 0) {
      return `${this.num}R`;
    }
    return `${this.num}R${this.gen}`;
  }
  static get(num, gen) {
    if (gen !== 0) {
      return new Ref(num, gen);
    }
    const refValue = Ref.cache[num];
    return refValue || (Ref.cache[num] = new Ref(num, 0));
  }
  static clearCache() {
    Ref.cache = [];
  }
}
exports.Ref = Ref;
Ref.cache = [];
class RefSet {
  constructor(parent) {
    this._set = new Set(parent?._set);
  }
  has(ref) {
    return this._set.has(ref.toString());
  }
  put(ref) {
    this._set.add(ref.toString());
  }
  remove(ref) {
    this._set.delete(ref.toString());
  }
  [Symbol.iterator]() {
    return this._set.values();
  }
  clear() {
    this._set.clear();
  }
}
class RefSetCache {
  constructor() {
    this._map = new Map();
  }
  get(ref) {
    return this._map.get(ref.toString());
  }
  has(ref) {
    return this._map.has(ref.toString());
  }
  put(ref, obj) {
    this._map.set(ref.toString(), obj);
  }
  putAlias(ref, aliasRef) {
    this._map.set(ref.toString(), this.get(aliasRef));
  }
  [Symbol.iterator]() {
    return this._map.values();
  }
  clear() {
    this._map.clear();
  }
}
const EOF = Symbol("EOF");
class BaseStream {
  constructor() {
    if (this.constructor === BaseStream) {
      throw new Error("Cannot initialize BaseStream.");
    }
  }
  get length() {
    throw new Error("Abstract getter `length` not implemented.");
  }
  get isEmpty() {
    return this.length === 0;
  }
  getByte() {
    throw new Error("Abstract method `getByte` not implemented.");
  }
  getBytes(length) {
    throw new Error("Abstract method `getBytes` not implemented.");
  }
  peekByte() {
    const byte = this.getByte();
    if (byte !== EOF) {
      this.pos--;
    }
    return byte;
  }
  peekBytes(length) {
    const bytes = this.getBytes(length);
    this.pos -= bytes.length;
    return bytes;
  }
  skip(n) {
    this.pos += n;
  }
  reset() {
    this.start = 0;
    this.pos = 0;
  }
  moveStart() {
    this.start = this.pos;
  }
  makeSubStream(start, length, dict = null) {
    throw new Error("Abstract method `makeSubStream` not implemented.");
  }
  getReader() {
    throw new Error("Abstract method `getReader` not implemented.");
  }
  getIR() {
    throw new Error("Abstract method `getIR` not implemented.");
  }
}
class Stream extends BaseStream {
  constructor(arrayBuffer, start, length, dict) {
    super();
    this.arrayBuffer = arrayBuffer;
    this.start = start || 0;
    this.pos = this.start;
    this.end = start + length || arrayBuffer.length;
    this.dict = dict;
    if (arrayBuffer instanceof Uint8Array) {
      this.bytes = arrayBuffer;
    } else {
      if (!(arrayBuffer instanceof ArrayBuffer) && !Array.isArray(arrayBuffer)) {
        throw new Error("Invalid argument for Stream");
      }
      this.bytes = new Uint8Array(arrayBuffer);
    }
  }
  get length() {
    return this.end - this.start;
  }
  getByte() {
    if (this.pos >= this.end) {
      return EOF;
    }
    return this.bytes[this.pos++];
  }
  getUint16() {
    if (this.pos + 2 > this.end) {
      return EOF;
    }
    const b0 = this.bytes[this.pos],
      b1 = this.bytes[this.pos + 1];
    this.pos += 2;
    return b0 << 8 | b1;
  }
  getInt32() {
    if (this.pos + 4 > this.end) {
      return EOF;
    }
    const b0 = this.bytes[this.pos],
      b1 = this.bytes[this.pos + 1],
      b2 = this.bytes[this.pos + 2],
      b3 = this.bytes[this.pos + 3];
    this.pos += 4;
    return b0 << 24 | b1 << 16 | b2 << 8 | b3;
  }
  getBytes(length) {
    let bytes;
    if (length === undefined) {
      bytes = this.bytes.subarray(this.pos, this.end);
      this.pos = this.end;
      return bytes;
    }
    const end = this.pos + length;
    if (end > this.end) {
      bytes = this.bytes.subarray(this.pos, this.end);
      this.pos = this.end;
      return bytes;
    }
    bytes = this.bytes.subarray(this.pos, end);
    this.pos = end;
    return bytes;
  }
  getString(length, stopWhen) {
    const bytes = this.getBytes(length);
    const str = stringToBytes(bytes);
    if (stopWhen) {
      const i = str.indexOf(stopWhen);
      if (i >= 0) {
        this.pos += i - length;
        return str.substring(0, i);
      }
    }
    return str;
  }
  skip(n) {
    if (n === undefined) {
      n = 1;
    }
    this.pos += n;
  }
  reset() {
    this.pos = this.start;
  }
  moveStart() {
    this.start = this.pos;
  }
  makeSubStream(start, length, dict = null) {
    return new Stream(this.bytes.buffer, start, length, dict);
  }
  getReader() {
    return new StreamReader(this);
  }
  getIR() {
    return Array.from(this.bytes.subarray(this.start, this.end));
  }
}
class StringStream extends BaseStream {
  constructor(str) {
    super();
    const bytes = new Uint8Array(str.length);
    for (let i = 0, n = str.length; i < n; i++) {
      bytes[i] = str.charCodeAt(i) & 0xff;
    }
    this.str = str;
    this.bytes = bytes;
    this.start = 0;
    this.pos = 0;
    this.end = str.length;
  }
  get length() {
    return this.end - this.start;
  }
  getByte() {
    if (this.pos >= this.end) {
      return EOF;
    }
    return this.str.charCodeAt(this.pos++) & 0xff;
  }
  getBytes(length) {
    if (length === undefined) {
      const bytes = this.bytes.subarray(this.pos, this.end);
      this.pos = this.end;
      return bytes;
    }
    const end = this.pos + length;
    if (end > this.end) {
      const bytes = this.bytes.subarray(this.pos, this.end);
      this.pos = this.end;
      return bytes;
    }
    const bytes = this.bytes.subarray(this.pos, end);
    this.pos = end;
    return bytes;
  }
  getReader() {
    return new StreamReader(this);
  }
  getIR() {
    return Array.from(this.bytes.subarray(this.start, this.end));
  }
  reset() {
    this.pos = this.start;
  }
}
class StreamReader {
  constructor(stream) {
    this.stream = stream;
    this.pos = 0;
    this.streamPos = stream.pos;
    this._prevMark = 0;
  }
  get position() {
    return this.pos;
  }
  get length() {
    return this.stream.length;
  }
  get isRangeSupported() {
    return false;
  }
  get isStreamingSupported() {
    return false;
  }
  get bytes() {
    return this.stream.bytes;
  }
  read(desiredSize) {
    const chunk = this.stream.getBytes(desiredSize);
    this.pos += chunk.length;
    return Promise.resolve({
      value: chunk,
      done: chunk.length === 0
    });
  }
  async readByte() {
    const {
      value,
      done
    } = await this.read(1);
    return done ? -1 : value[0];
  }
  async readBytes(length) {
    const {
      value
    } = await this.read(length);
    return value;
  }
  cancel() {}
  mark() {
    this._prevMark = this.stream.pos;
  }
  reset() {
    this.stream.pos = this._prevMark;
  }
}
class NullStream extends BaseStream {
  constructor() {
    super();
    this.start = 0;
    this.pos = 0;
    this.end = 0;
  }
  get length() {
    return 0;
  }
  getByte() {
    return EOF;
  }
  getBytes(length) {
    return new Uint8Array(0);
  }
  getReader() {
    return new StreamReader(this);
  }
  getIR() {
    return [];
  }
}
class DecodeStream extends BaseStream {
  constructor(stream, maybeMinBufferLength) {
    super();
    if (this.constructor === DecodeStream) {
      throw new Error("Cannot initialize DecodeStream.");
    }
    this.str = stream;
    this.dict = stream.dict;
    const minBufferLength = maybeMinBufferLength || 512;
    this._rawMinBufferLength = minBufferLength;
    this.minBufferLength = Math.max(0, minBufferLength);
    this.pos = 0;
    this.buffer = new Uint8Array(this.minBufferLength);
    this.bufferLength = 0;
    this.eof = false;
    this.buf1 = -1;
  }
  get length() {
    return this.bufferLength - this.pos;
  }
  get isEmpty() {
    return this.bufferLength === this.pos && this.eof;
  }
  _ensureBuffer(requested) {
    if (requested <= this.bufferLength - this.pos) {
      return;
    }
    const newBufferLength = this.bufferLength - this.pos;
    if (this.eof) {
      return;
    }
    if (this.pos > 0) {
      this.buffer.set(this.buffer.subarray(this.pos, this.bufferLength), 0);
      this.bufferLength = newBufferLength;
      this.pos = 0;
    }
    let bytesToRead;
    while (!this.eof && newBufferLength + requested > this.bufferLength) {
      if (this.bufferLength === 0) {
        bytesToRead = this._readBlock();
      } else {
        const currentLength = this.bufferLength;
        const newLength = Math.max(currentLength * 2, newBufferLength + requested, this.minBufferLength);
        const newBuffer = new Uint8Array(newLength);
        newBuffer.set(this.buffer.subarray(0, currentLength));
        this.buffer = newBuffer;
        bytesToRead = this._readBlock();
      }
    }
  }
  _readBlock() {
    throw new Error("Abstract method `_readBlock` not implemented.");
  }
  getByte() {
    this._ensureBuffer(1);
    if (this.pos >= this.bufferLength) {
      return EOF;
    }
    return this.buffer[this.pos++];
  }
  get bytes() {
    this._ensureBuffer(this.str.length);
    return this.buffer.subarray(this.pos, this.bufferLength);
  }
  getBytes(length) {
    if (length === undefined) {
      this._ensureBuffer(this.str.length);
      const bytes = this.buffer.subarray(this.pos, this.bufferLength);
      this.pos = this.bufferLength;
      return bytes;
    }
    this._ensureBuffer(length);
    const end = Math.min(this.pos + length, this.bufferLength);
    const bytes = this.buffer.subarray(this.pos, end);
    this.pos = end;
    return bytes;
  }
  peekByte() {
    this._ensureBuffer(1);
    if (this.pos >= this.bufferLength) {
      return EOF;
    }
    return this.buffer[this.pos];
  }
  peekBytes(length) {
    this._ensureBuffer(length);
    return this.buffer.subarray(this.pos, Math.min(this.pos + length, this.bufferLength));
  }
  makeSubStream(start, length, dict = null) {
    this._ensureBuffer(start + length);
    const end = Math.min(start + length, this.bufferLength);
    return new Stream(this.buffer.buffer, this.pos + start, end - start, dict);
  }
  getReader() {
    return new StreamReader(this);
  }
  getIR() {
    this._ensureBuffer(this.str.length);
    return Array.from(this.buffer.subarray(this.pos, this.bufferLength));
  }
  reset() {
    this.pos = 0;
  }
}
class FakeStream extends BaseStream {
  constructor(stream) {
    super();
    this.actual = stream;
    this.dict = stream.dict;
    this.pos = 0;
  }
  get length() {
    return this.actual.length;
  }
  get isEmpty() {
    return this.actual.isEmpty;
  }
  getByte() {
    return this.actual.getByte();
  }
  getBytes(length) {
    return this.actual.getBytes(length);
  }
  peekByte() {
    return this.actual.peekByte();
  }
  peekBytes(length) {
    return this.actual.peekBytes(length);
  }
  skip(n) {
    this.actual.skip(n);
  }
  reset() {
    this.actual.reset();
  }
  moveStart() {
    this.actual.moveStart();
  }
  makeSubStream(start, length, dict = null) {
    return this.actual.makeSubStream(start, length, dict);
  }
  getReader() {
    return new StreamReader(this);
  }
  getIR() {
    return this.actual.getIR();
  }
}
class FlateStream extends DecodeStream {
  constructor(stream, maybeMinBufferLength) {
    super(stream, maybeMinBufferLength);
    this.flate = new Flate(this.str);
    this.eof = false;
  }
  _readBlock() {
    const bytes = this.flate.read(this.buffer.length - this.bufferLength);
    if (bytes === null) {
      this.eof = true;
      return 0;
    }
    const newBufferLength = this.bufferLength + bytes.length;
    if (newBufferLength > this.buffer.length) {
      const newBuffer = new Uint8Array(newBufferLength);
      newBuffer.set(this.buffer.subarray(0, this.bufferLength));
      newBuffer.set(bytes, this.bufferLength);
      this.buffer = newBuffer;
    } else {
      this.buffer.set(bytes, this.bufferLength);
    }
    this.bufferLength = newBufferLength;
    return bytes.length;
  }
  reset() {
    this.flate.reset();
    this.eof = false;
    this.bufferLength = 0;
    this.pos = 0;
  }
}
const codeLen = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
const codeDist = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];
const codeLenExt = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0];
const codeDistExt = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0];
const fixedLitLen = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8];
const fixedLitLenCodes = {};
const fixedDist = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const fixedDistCodes = {};
const huffmanTreeBuild = (lengths, codes) => {
  const table = new Array(1 << 16);
  for (let i = 0, ii = lengths.length; i < ii; ++i) {
    const len = lengths[i];
    if (len === 0) {
      continue;
    }
    let code = codes[i];
    const first = 1 << 16 - len;
    for (let j = 0; j < first; ++j) {
      table[code] = len << 16 | i;
      code += 1 << len;
    }
  }
  return {
    table,
    maxLen: 15
  };
};
const huffmanTreeGet = (tree, code) => {
  const codeTrunc = code & (1 << tree.maxLen) - 1;
  const pair = tree.table[codeTrunc];
  if (pair & 0x80000000) {
    throw new Error("Invalid huffman code");
  }
  const len = pair >> 16;
  if (len > tree.maxLen) {
    throw new Error("Invalid huffman code");
  }
  if ((codeTrunc & (1 << len) - 1) !== 0) {}
  return pair;
};
class Flate {
  constructor(stream) {
    this.stream = stream;
    this.bytes = stream.bytes;
    this.bytesPos = 0;
    this.bitBuffer = 0;
    this.bits = 0;
  }
  read(maxBytes) {
    if (this.eof) {
      return null;
    }
    const bytes = new Uint8Array(maxBytes);
    let bytesPos = 0;
    while (!this.eof && bytesPos < maxBytes) {
      let eof = false;
      const final = this.readBits(1);
      const type = this.readBits(2);
      if (final === 1) {
        eof = true;
      }
      if (type === 0) {
        const len = this.readBits(16);
        const nlen = this.readBits(16);
        this.bitBuffer = 0;
        this.bits = 0;
        const block = this.stream.getBytes(len);
        for (let i = 0; i < len; ++i) {
          bytes[bytesPos++] = block[i];
        }
      } else if (type === 1) {
        if (!fixedLitLenCodes.table) {
          const codes = new Uint32Array(fixedLitLen.length);
          let code = 0;
          let prevLen = 0;
          for (let i = 0; i < fixedLitLen.length; ++i) {
            const len = fixedLitLen[i];
            if (len > prevLen) {
              code <<= len - prevLen;
              prevLen = len;
            } else if (len < prevLen) {
              code >>= prevLen - len;
            }
            codes[i] = code++;
          }
          fixedLitLenCodes.table = huffmanTreeBuild(fixedLitLen, codes).table;
          fixedLitLenCodes.maxLen = 15;
          const distCodes = new Uint32Array(fixedDist.length);
          code = 0;
          prevLen = 0;
          for (let i = 0; i < fixedDist.length; ++i) {
            const len = fixedDist[i];
            if (len > prevLen) {
              code <<= len - prevLen;
              prevLen = len;
            }
            distCodes[i] = code++;
          }
          fixedDistCodes.table = huffmanTreeBuild(fixedDist, distCodes).table;
          fixedDistCodes.maxLen = 15;
        }
        bytesPos = this.decode(bytes, bytesPos, fixedLitLenCodes, fixedDistCodes);
      } else if (type === 2) {
        const hlit = this.readBits(5) + 257;
        const hdist = this.readBits(5) + 1;
        const hclen = this.readBits(4) + 4;
        const clen = new Uint8Array(19);
        const order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        for (let i = 0; i < hclen; ++i) {
          clen[order[i]] = this.readBits(3);
        }
        const clenCodes = new Uint32Array(clen.length);
        let code = 0,
          prevLen = 0;
        for (let i = 0; i < clen.length; ++i) {
          const len = clen[i];
          if (len > prevLen) {
            code <<= len - prevLen;
            prevLen = len;
          } else if (len < prevLen) {
            code >>= prevLen - len;
          }
          clenCodes[i] = code++;
        }
        const clenTree = huffmanTreeBuild(clen, clenCodes);
        const lenAndDist = new Uint8Array(hlit + hdist);
        let i = 0;
        while (i < hlit + hdist) {
          const pair = this.readCode(clenTree);
          const val = pair & 0xffff;
          if (val < 16) {
            lenAndDist[i++] = val;
            continue;
          }
          let repeat = 0,
            what = 0;
          if (val === 16) {
            repeat = this.readBits(2) + 3;
            what = lenAndDist[i - 1];
          } else if (val === 17) {
            repeat = this.readBits(3) + 3;
          } else if (val === 18) {
            repeat = this.readBits(7) + 11;
          }
          for (let j = 0; j < repeat; ++j) {
            lenAndDist[i++] = what;
          }
        }
        const litLen = lenAndDist.subarray(0, hlit);
        const dist = lenAndDist.subarray(hlit);
        const litLenCodes = new Uint32Array(litLen.length);
        code = 0;
        prevLen = 0;
        for (let i = 0; i < litLen.length; ++i) {
          const len = litLen[i];
          if (len > prevLen) {
            code <<= len - prevLen;
            prevLen = len;
          } else if (len < prevLen) {
            code >>= prevLen - len;
          }
          litLenCodes[i] = code++;
        }
        const litLenTree = huffmanTreeBuild(litLen, litLenCodes);
        const distCodes = new Uint32Array(dist.length);
        code = 0;
        prevLen = 0;
        for (let i = 0; i < dist.length; ++i) {
          const len = dist[i];
          if (len > prevLen) {
            code <<= len - prevLen;
            prevLen = len;
          } else if (len < prevLen) {
            code >>= prevLen - len;
          }
          distCodes[i] = code++;
        }
        const distTree = huffmanTreeBuild(dist, distCodes);
        bytesPos = this.decode(bytes, bytesPos, litLenTree, distTree);
      } else {
        throw new Error("Unknown compression type");
      }
      if (eof) {
        this.eof = true;
      }
    }
    if (bytesPos < maxBytes) {
      return bytes.subarray(0, bytesPos);
    }
    return bytes;
  }
  decode(bytes, bytesPos, litLenTree, distTree) {
    let val;
    while ((val = this.readCode(litLenTree)) !== 256) {
      val &= 0xffff;
      if (val < 256) {
        bytes[bytesPos++] = val;
      } else {
        let len = codeLen[val - 257];
        const lenExt = codeLenExt[val - 257];
        if (lenExt > 0) {
          len += this.readBits(lenExt);
        }
        const distPair = this.readCode(distTree);
        const distVal = distPair & 0xffff;
        let dist = codeDist[distVal];
        const distExt = codeDistExt[distVal];
        if (distExt > 0) {
          dist += this.readBits(distExt);
        }
        let j = bytesPos - dist;
        for (let i = 0; i < len; ++i) {
          bytes[bytesPos++] = bytes[j++];
        }
      }
    }
    return bytesPos;
  }
  readBits(n) {
    while (this.bits < n) {
      const byte = this.stream.getByte();
      if (byte === EOF) {
        throw new Error("unexpected eof");
      }
      this.bitBuffer |= byte << this.bits;
      this.bits += 8;
    }
    const val = this.bitBuffer & (1 << n) - 1;
    this.bitBuffer >>= n;
    this.bits -= n;
    return val;
  }
  readCode(tree) {
    let code = 0,
      len = 0;
    while (this.bits < 15) {
      const byte = this.stream.getByte();
      if (byte === EOF) {
        throw new Error("unexpected eof");
      }
      this.bitBuffer |= byte << this.bits;
      this.bits += 8;
    }
    const pair = huffmanTreeGet(tree, this.bitBuffer);
    len = pair >> 16;
    this.bitBuffer >>= len;
    this.bits -= len;
    return pair;
  }
  reset() {}
}
const PredictorPNG = {
  None: 0,
  Sub: 1,
  Up: 2,
  Average: 3,
  Paeth: 4
};
class PredictorStream extends DecodeStream {
  constructor(stream, maybeMinBufferLength, params) {
    super(stream, maybeMinBufferLength);
    this.predictor = params.get("Predictor") || PredictorPNG.None;
    const colors = params.get("Colors") || 1;
    const bits = params.get("BitsPerComponent") || 8;
    const columns = params.get("Columns") || 1;
    this.bpp = colors * bits + 7 >> 3;
    this.rowBytes = columns * colors * bits + 7 >> 3;
    this.prevRow = new Uint8Array(this.rowBytes);
  }
  readNextRow() {
    const row = this.str.getBytes(this.rowBytes);
    if (row.length === 0) {
      this.eof = true;
      return;
    }
    const predictor = this.str.getByte();
    if (predictor === EOF) {
      this.eof = true;
      return;
    }
    if (predictor === PredictorPNG.None) {} else if (predictor === PredictorPNG.Sub) {
      for (let i = this.bpp; i < this.rowBytes; ++i) {
        row[i] = row[i] + row[i - this.bpp] & 0xff;
      }
    } else if (predictor === PredictorPNG.Up) {
      for (let i = 0; i < this.rowBytes; ++i) {
        row[i] = row[i] + this.prevRow[i] & 0xff;
      }
    } else if (predictor === PredictorPNG.Average) {
      for (let i = 0; i < this.rowBytes; ++i) {
        const sub = i < this.bpp ? 0 : row[i - this.bpp];
        const up = this.prevRow[i];
        row[i] = row[i] + (sub + up >> 1) & 0xff;
      }
    } else if (predictor === PredictorPNG.Paeth) {
      for (let i = 0; i < this.rowBytes; ++i) {
        const sub = i < this.bpp ? 0 : row[i - this.bpp];
        const up = this.prevRow[i];
        const upSub = i < this.bpp ? 0 : this.prevRow[i - this.bpp];
        const p = sub + up - upSub;
        const pa = Math.abs(p - sub);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upSub);
        let peath;
        if (pa <= pb && pa <= pc) {
          peath = sub;
        } else if (pb <= pc) {
          peath = up;
        } else {
          peath = upSub;
        }
        row[i] = row[i] + peath & 0xff;
      }
    } else {
      throw new Error(`Unsupported predictor: ${predictor}`);
    }
    this.prevRow = row;
    const newBufferLength = this.bufferLength + row.length;
    if (newBufferLength > this.buffer.length) {
      const newBuffer = new Uint8Array(newBufferLength);
      newBuffer.set(this.buffer.subarray(0, this.bufferLength));
      this.buffer = newBuffer;
    }
    this.buffer.set(row, this.bufferLength);
    this.bufferLength = newBufferLength;
  }
  _readBlock() {
    this.readNextRow();
    return this.bufferLength - this.pos;
  }
  reset() {
    this.prevRow = new Uint8Array(this.rowBytes);
    super.reset();
  }
}
class LZWStream extends DecodeStream {
  constructor(stream, maybeMinBufferLength, params) {
    super(stream, maybeMinBufferLength);
    const earlyChange = params.get("EarlyChange") || 1;
    this.eod = 257;
    this.earlyChange = earlyChange;
    this.table = [];
    this.tableSize = 0;
    this.codeSize = 0;
    this.prevCode = -1;
    this.buildInitialTable();
  }
  buildInitialTable() {
    this.table.length = 0;
    for (let i = 0; i < 256; i++) {
      this.table.push(new Uint8Array([i]));
    }
    this.tableSize = 258;
    this.codeSize = 9;
  }
  readNextChunk(ab) {
    if (this.str.isEmpty) {
      this.eof = true;
      return 0;
    }
    if (this.buf1 !== -1) {
      const b = this.str.getByte();
      if (b === EOF) {
        this.eof = true;
        return 0;
      }
      this.buf1 = this.buf1 << 8 | b;
    }
    return 0;
  }
  _readBlock() {
    let toDecode = 1;
    while (!this.str.isEmpty) {
      let code, nextCode;
      if (this.buf1 === -1) {
        const b = this.str.getByte();
        if (b === EOF) {
          break;
        }
        this.buf1 = b << 8;
        const b2 = this.str.getByte();
        if (b2 === EOF) {
          break;
        }
        this.buf1 |= b2;
      }
      if (this.codeSize === 9) {
        code = this.buf1 >> 7;
        this.buf1 = this.buf1 << 9 & 0xffff;
        const b3 = this.str.getByte();
        if (b3 !== EOF) {
          this.buf1 |= b3 << 1;
        }
      } else {
        throw new Error("Unsupported LZW code size");
      }
      if (code === 256) {
        this.buildInitialTable();
        this.prevCode = -1;
        continue;
      } else if (code === this.eod) {
        this.eof = true;
        return;
      }
      let chunk;
      if (this.prevCode !== -1) {
        if (code < this.tableSize) {
          chunk = this.table[code];
          const newChunk = new Uint8Array(this.table[this.prevCode].length + 1);
          newChunk.set(this.table[this.prevCode]);
          newChunk[newChunk.length - 1] = chunk[0];
          this.table[this.tableSize++] = newChunk;
        } else {
          chunk = this.table[this.prevCode];
          const newChunk = new Uint8Array(chunk.length + 1);
          newChunk.set(chunk);
          newChunk[newChunk.length - 1] = chunk[0];
          this.table[this.tableSize++] = newChunk;
        }
      }
      if (this.tableSize >= 2048 - this.earlyChange) {
        this.codeSize = 12;
      } else if (this.tableSize >= 1024 - this.earlyChange) {
        this.codeSize = 11;
      } else if (this.tableSize >= 512 - this.earlyChange) {
        this.codeSize = 10;
      }
      chunk = this.table[code];
      const newBufferLength = this.bufferLength + chunk.length;
      if (newBufferLength > this.buffer.length) {
        const newBuffer = new Uint8Array(newBufferLength);
        newBuffer.set(this.buffer.subarray(0, this.bufferLength));
        this.buffer = newBuffer;
      }
      this.buffer.set(chunk, this.bufferLength);
      this.bufferLength = newBufferLength;
      this.prevCode = code;
    }
  }
}
class CCITTFaxStream extends DecodeStream {
  constructor(stream, maybeMinBufferLength, params) {
    super(stream, maybeMinBufferLength);
    const K = params.get("K") || 0;
    const EOL = params.get("EndOfLine") || false;
    const EncodedByteAlign = params.get("EncodedByteAlign") || false;
    const Columns = params.get("Columns") || 1728;
    const Rows = params.get("Rows") || 0;
    const EOFB = params.get("EndOfBlock") || true;
    const BlackIs1 = params.get("BlackIs1") || false;
  }
  _readBlock() {}
}
class JpegStream extends BaseStream {
  constructor(stream, dict, env) {
    if (env.jpegjs === undefined) {
      throw new Error("JpegStream requires jpeg.js lib");
    }
    super();
    this.env = env;
    this.stream = stream;
    this.dict = dict;
    this.maybeLength = stream.length;
  }
  getReader() {
    return new JpegStreamReader(this, this.env.jpegjs);
  }
  get bytes() {
    return this.stream.bytes;
  }
  get length() {
    if (Number.isInteger(this.maybeLength)) {
      return this.maybeLength;
    }
    const MAX_LENGTH = 1000000000;
    warn("JpegStream returning undefined length");
    return MAX_LENGTH;
  }
}
class JpegStreamReader {
  constructor(jpegStream, JpegImage) {
    this.jpegStream = jpegStream;
    this.JpegImage = JpegImage;
    this.streamReader = jpegStream.stream.getReader();
    this.eof = false;
    this.chunks = [];
  }
  async _readAllChunks() {
    let read;
    while ((read = await this.streamReader.read())) {
      if (read.done) {
        break;
      }
      this.chunks.push(read.value);
    }
    let buffer;
    if (this.chunks.length === 1) {
      buffer = this.chunks[0];
    } else {
      buffer = new Uint8Array(this.jpegStream.length);
      let offset = 0;
      for (const chunk of this.chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }
    }
    const jpegImage = new this.JpegImage();
    jpegImage.parse(buffer);
    jpegImage.colorTransform = false;
    const image = {
      width: jpegImage.width,
      height: jpegImage.height,
      kind: ImageKind.RGB_24BPP,
      data: jpegImage.getData(jpegImage.width, jpegImage.height)
    };
    return {
      value: image,
      done: true
    };
  }
  read(desiredSize) {
    if (this.eof) {
      return Promise.resolve({
        value: undefined,
        done: true
      });
    }
    this.eof = true;
    return this._readAllChunks();
  }
  cancel() {}
  get isRangeSupported() {
    return false;
  }
  get isStreamingSupported() {
    return false;
  }
}
class RunLengthStream extends DecodeStream {
  constructor(stream, maybeMinBufferLength) {
    super(stream, maybeMinBufferLength);
  }
  _readBlock() {
    const newBytes = new Uint8Array(128);
    let newBytesLength = 0;
    let b;
    while ((b = this.str.getByte()) !== EOF && b !== 128) {
      if (b < 128) {
        const chunk = this.str.getBytes(b + 1);
        if (newBytesLength + chunk.length > newBytes.length) {
          const tmp = new Uint8Array(newBytesLength + chunk.length);
          tmp.set(newBytes.subarray(0, newBytesLength));
          tmp.set(chunk, newBytesLength);
          newBytes = tmp;
        } else {
          newBytes.set(chunk, newBytesLength);
        }
        newBytesLength += chunk.length;
      } else {
        const b2 = this.str.getByte();
        if (b2 === EOF) {
          break;
        }
        const len = 257 - b;
        for (let i = 0; i < len; i++) {
          if (newBytesLength >= newBytes.length) {
            const tmp = new Uint8Array(newBytesLength + 128);
            tmp.set(newBytes.subarray(0, newBytesLength));
            newBytes = tmp;
          }
          newBytes[newBytesLength++] = b2;
        }
      }
    }
    const newBufferLength = this.bufferLength + newBytesLength;
    if (newBufferLength > this.buffer.length) {
      const newBuffer = new Uint8Array(newBufferLength);
      newBuffer.set(this.buffer.subarray(0, this.bufferLength));
      this.buffer = newBuffer;
    }
    this.buffer.set(newBytes.subarray(0, newBytesLength), this.bufferLength);
    this.bufferLength = newBufferLength;
    this.eof = b === EOF || b === 128;
  }
}
class AHLOS extends DecodeStream {
  constructor(str, maybeMinBufferLength) {
    super(str, maybeMinBufferLength);
  }
  _readBlock() {
    const chunk = this.str.getBytes(this._rawMinBufferLength);
    if (chunk.length === 0) {
      this.eof = true;
      return;
    }
    let newChunk = new Uint8Array(chunk.length);
    let newChunkLength = 0;
    let eod = false;
    for (let i = 0, ii = chunk.length; i < ii; ++i) {
      const value = chunk[i];
      if (value === 0x7e) {
        eod = true;
        break;
      }
      if (value >= 0x41 && value <= 0x5a || value >= 0x61 && value <= 0x7a || value >= 0x30 && value <= 0x39 || value === 0x2b || value === 0x2f) {
        warn("AHD: invalid character");
      }
      newChunk[newChunkLength++] = value;
    }
    newChunk = newChunk.subarray(0, newChunkLength);
    const newBufferLength = this.bufferLength + newChunkLength;
    if (newBufferLength > this.buffer.length) {
      const newBuffer = new Uint8Array(newBufferLength);
      newBuffer.set(this.buffer.subarray(0, this.bufferLength));
      this.buffer = newBuffer;
    }
    this.buffer.set(newChunk, this.bufferLength);
    this.bufferLength = newBufferLength;
    this.eof = eod;
  }
}
class PostScriptParser {
  constructor(lexer) {
    this.lexer = lexer;
    this.operators = [];
    this.token = null;
  }
  parse() {
    this.token = this.lexer.getToken();
    while (this.token) {
      if (this.token.type === PostScriptTokenTypes.OPERATOR) {
        this.operators.push(this.token.value);
      }
      this.token = this.lexer.getToken();
    }
    return this.operators;
  }
}
const PostScriptTokenTypes = {
  LITERAL: 0,
  OPERATOR: 1
};
class PostScriptLexer {
  constructor(stream) {
    this.stream = stream;
    this.next_token = null;
    this.token_type = null;
  }
  getToken() {
    if (this.next_token) {
      const token = this.next_token;
      const type = this.token_type;
      this.next_token = null;
      this.token_type = null;
      return {
        type,
        value: token
      };
    }
    let comment = false;
    let buffer = [];
    let ch;
    while ((ch = this.stream.getByte()) !== EOF) {
      if (comment) {
        if (ch === 0x0a || ch === 0x0d) {
          comment = false;
        }
        continue;
      }
      if (ch === 0x25) {
        comment = true;
        continue;
      }
      if (isWhiteSpace(ch)) {
        continue;
      }
      if (ch === 0x7b || ch === 0x7d || ch === 0x3c && this.stream.peekByte() === 0x3c || ch === 0x3e && this.stream.peekByte() === 0x3e) {
        if (buffer.length > 0) {
          const value = String.fromCharCode.apply(null, buffer);
          let type;
          if (value === "true" || value === "false") {
            type = PostScriptTokenTypes.LITERAL;
          } else {
            type = PostScriptTokenTypes.OPERATOR;
          }
          this.next_token = String.fromCharCode(ch);
          this.token_type = PostScriptTokenTypes.OPERATOR;
          return {
            type,
            value
          };
        }
        return {
          type: PostScriptTokenTypes.OPERATOR,
          value: String.fromCharCode(ch)
        };
      }
      buffer.push(ch);
    }
    if (buffer.length > 0) {
      return {
        type: PostScriptTokenTypes.OPERATOR,
        value: String.fromCharCode.apply(null, buffer)
      };
    }
    return null;
  }
}
class PDFFunction {
  constructor() {
    if (this.constructor === PDFFunction) {
      throw new Error("Cannot initialize PDFFunction.");
    }
  }
  get numOutputs() {
    return this.range.length >> 1;
  }
  get resultSize() {
    let result = 0;
    for (const range of this.range) {
      result += range.length;
    }
    return result;
  }
  getIR() {
    throw new Error("Abstract method `getIR` not implemented.");
  }
  static get(xref, ref, evalFn) {
    if (!isRef(ref)) {
      return evalFn.isDataLoaded ? Promise.resolve(evalFn) : evalFn.dataLoaded;
    }
    return xref.fetchAsync(ref).then(function (obj) {
      if (!isStream(obj) && !isDict(obj)) {
        throw new FormatError("Fun dictionary is not a stream or dictionary");
      }
      return PDFFunction.parse({
        xref,
        dict: isStream(obj) ? obj.dict : obj,
        stream: isStream(obj) ? obj : null,
        evalFn
      });
    });
  }
  static parse({
    xref,
    dict,
    stream,
    evalFn
  }) {
    dict = dict instanceof Dict ? dict : Dict.empty;
    const domain = dict.getArray("Domain");
    const range = dict.getArray("Range");
    if (!domain || !range) {
      throw new FormatError("Invalid function");
    }
    const fnType = dict.get("FunctionType");
    const numOutputs = range.length / 2;
    switch (fnType) {
      case 0:
        const size = dict.getArray("Size");
        const bitsPerSample = dict.get("BitsPerSample");
        const order = dict.get("Order") || 1;
        if (order !== 1) {
          warn("No support for cubic spline interpolation: " + order);
        }
        const encode = dict.getArray("Encode");
        const decode = dict.getArray("Decode");
        if (stream === null) {
          throw new FormatError("Sampled function requires a stream.");
        }
        return new SampledFunction(size, range, domain, stream, bitsPerSample, encode, decode);
      case 2:
        const c0 = dict.getArray("C0") || [0];
        const c1 = dict.getArray("C1") || [1];
        const n = dict.get("N");
        if (!Array.isArray(c0) || c0.length < numOutputs || !Array.isArray(c1) || c1.length < numOutputs || !isNum(n)) {
          throw new FormatError("Invalid exponential function");
        }
        return new ExponentialFunction(domain, range, c0, c1, n);
      case 3:
        const fnRefs = dict.getArray("Functions");
        const fns = [];
        if (Array.isArray(fnRefs)) {
          for (const fnRef of fnRefs) {
            fns.push(PDFFunction.get(xref, fnRef, evalFn));
          }
        }
        const bounds = dict.getArray("Bounds");
        const encodeStitching = dict.getArray("Encode");
        return Promise.all(fns).then(function (fns) {
          return new StitchingFunction(domain, range, fns, bounds, encodeStitching);
        });
      case 4:
        const streamContents = stream.getBytes();
        const lexer = new PostScriptLexer(new Stream(streamContents));
        const parser = new PostScriptParser(lexer);
        const operators = parser.parse();
        if (operators) {
          return new PostScriptFunction(domain, range, operators);
        }
        throw new FormatError("Invalid postscript function");
      default:
        throw new FormatError("Unknown function type: " + fnType);
    }
  }
}
exports.PDFFunction = PDFFunction;
class SampledFunction extends PDFFunction {
  constructor(size, range, domain, stream, bitsPerSample, encode, decode) {
    super();
    this.size = size;
    this.range = range;
    this.domain = domain;
    this.stream = stream;
    this.bitsPerSample = bitsPerSample;
    this.encode = encode;
    this.decode = decode;
    const numInputs = domain.length >> 1;
    this.inputSize = [];
    for (let i = 0; i < numInputs; i++) {
      this.inputSize[i] = size[i];
    }
  }
  getIR() {
    return ["func", this, this.domain, this.range, null, null];
  }
}
class ExponentialFunction extends PDFFunction {
  constructor(domain, range, c0, c1, n) {
    super();
    this.domain = domain;
    this.range = range;
    this.c0 = c0;
    this.c1 = c1;
    this.n = n;
  }
}
class StitchingFunction extends PDFFunction {
  constructor(domain, range, fns, bounds, encode) {
    super();
    this.domain = domain;
    this.range = range;
    this.fns = fns;
    this.bounds = bounds;
    this.encode = encode;
  }
}
class PostScriptFunction extends PDFFunction {
  constructor(domain, range, an) {
    super();
    this.domain = domain;
    this.range = range;
    this.operators = an;
  }
}
const SID_UPPER_MAP = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const SID_LOWER_MAP = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const SID_DIGIT_MAP = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
class CFFExpertSubsetCharset {
  constructor() {
    this.expertSubset = ["space", "exclamsmall", "Hungarumlautsmall", "dollaroldstyle", "dollarsuperior", "ampersandsmall", "Acutesmall", "parenleftsuperior", "parenrightsuperior", "twodotenleader", "onedotenleader", "comma", "hyphen", "period", "fraction", "zerooldstyle", "oneoldstyle", "twooldstyle", "threeoldstyle", "fouroldstyle", "fiveoldstyle", "sixoldstyle", "sevenoldstyle", "eightoldstyle", "nineoldstyle", "colon", "semicolon", "commasuperior", "threequartersemdash", "periodsuperior", "questionsmall", "asuperior", "bsuperior", "centsuperior", "dsuperior", "esuperior", "isuperior", "lsuperior", "msuperior", "nsuperior", "osuperior", "rsuperior", "ssuperior", "tsuperior", "ff", "fi", "fl", "ffi", "ffl", "parenleftinferior", "parenrightinferior", "Circumflexsmall", "hyphensuperior", "Gravesmall", "Asmall", "Bsmall", "Csmall", "Dsmall", "Esmall", "Fsmall", "Gsmall", "Hsmall", "Ismall", "Jsmall", "Ksmall", "Lsmall", "Msmall", "Nsmall", "Osmall", "Psmall", "Qsmall", "Rsmall", "Ssmall", "Tsmall", "Usmall", "Vsmall", "Wsmall", "Xsmall", "Ysmall", "Zsmall", "colonmonetary", "onequarter", "onehalf", "threequarters", "exclamdownsmall", "Eightsmall", "fourtenths", "oneeighth", "onefifth", "onequarter", "onesixth", "onethird", "threeeighths", "threefifths", "threequarters", "threesixteenths", "twothirds", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ellipsis", "exclam", "question", "quotedbl", "quoteleft", "quoteright", "numbersign", "dollar", "percent", "ampersand", "quotesingle", "parenleft", "parenright", "asterisk", "plus", "slash", "at", "backslash", "asciicircum", "asciitilde", "lessequal", "greater equal", "notequal", "infinity", "plusminus", "lozenge", "mu", "summation", "product", "pi", "integral", "ordfeminine", "ordmasculine", "Omega", "radical", "approxequal", "Delta", "partialdiff", "minus", "divide", "multiply", "logicalnot", "arrowleft", "arrowup", "arrowright", "arrowdown", "darrowleft", "darrowup", "darrowright", "darrowdown", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Agrave", "Aacute", "Acircumflex", "Atilde", "Adieresis", "Aring", "AE", "Ccedilla", "Egrave", "Eacute", "Ecircumflex", "Edieresis", "Igrave", "Iacute", "Icircumflex", "Idieresis", "Eth", "Ntilde", "Ograve", "Oacute", "Ocircumflex", "Otilde", "Odieresis", "OE", "Scaron", "Oslash", "Ugrave", "Uacute", "Ucircumflex", "Udieresis", "Yacute", "Ydieresis", "Zcaron", "agrave", "aacute", "acircumflex", "atilde", "adieresis", "aring", "ae", "ccedilla", "egrave", "eacute", "ecircumflex", "edieresis", "igrave", "iacute", "icircumflex", "idieresis", "eth", "ntilde", "ograve", "oacute", "ocircumflex", "otilde", "odieresis", "oe", "scaron", "oslash", "ugrave", "uacute", "ucircumflex", "udieresis", "yacute", "ydieresis", "zcaron"];
  }
  getSID(name) {
    if (name.startsWith("e")) {
      const index = SID_UPPER_MAP.indexOf(name.substring(1));
      if (index !== -1) {
        return 96 + index;
      }
    }
    const index = this.expertSubset.indexOf(name);
    return index === -1 ? 0 : index;
  }
}
class CFFStandardStrings {
  constructor() {
    this.standardStrings = [".notdef", "space", "exclam", "quotedbl", "numbersign", "dollar", "percent", "ampersand", "quoteright", "parenleft", "parenright", "asterisk", "plus", "comma", "hyphen", "period", "slash", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "colon", "semicolon", "less", "equal", "greater", "question", "at", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "bracketleft", "backslash", "bracketright", "asciicircum", "underscore", "quoteleft", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "braceleft", "bar", "braceright", "asciitilde", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "exclamdown", "cent", "sterling", "fraction", "yen", "florin", "section", "currency", "quotesingle", "quotedblleft", "guillemotleft", "guilsinglleft", "guilsinglright", "fi", "fl", null, "endash", "dagger", "daggerdbl", "periodcentered", null, "paragraph", "bullet", "quotesinglbase", "quotedblbase", "quotedblright", "guillemotright", "ellipsis", "perthousand", null, "questiondown", null, "grave", "acute", "circumflex", "tilde", "macron", "breve", "dotaccent", "dieresis", null, "ring", "cedilla", null, "hungarumlaut", "ogonek", "caron", "emdash", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "AE", null, "ordfeminine", null, null, null, null, "Lslash", "Oslash", "OE", "ordmasculine", null, null, null, null, null, "ae", null, null, null, "dotlessi", null, null, "lslash", "oslash", "oe", "germandbls", null, null, null, null];
  }
}
class CFFParser {
  constructor(stream, properties) {
    this.stream = stream;
    this.properties = properties;
  }
  parse() {
    const header = this.parseHeader();
    const nameIndex = this.parseIndex();
    const topDictIndex = this.parseIndex();
    const stringIndex = this.parseIndex();
    const globalSubrIndex = this.parseIndex();
    const topDictParsed = this.parseDict(topDictIndex.get(0));
    const topDict = new CFFTopDict(this.properties, stringIndex, globalSubrIndex, nameIndex);
    topDict.parse(topDictParsed);
    const privateDict = topDict.privateDict;
    if (privateDict) {
      privateDict.parse(this.parseDict(privateDict.bytes));
    }
    const charStringsIndex = topDict.charStringsIndex;
    if (charStringsIndex) {
      charStringsIndex.parse(this.parseIndex(charStringsIndex.offset));
    }
    const charset = topDict.charset;
    if (charset) {
      charset.parse();
    }
    const encoding = topDict.encoding;
    if (encoding) {
      encoding.parse();
    }
    const localSubrIndex = privateDict?.localSubrIndex;
    if (localSubrIndex) {
      localSubrIndex.bytes.forEach(function (bytes) {
        localSubrIndex.parse(this.parseIndex(localSubrIndex.offset + bytes));
      }, this);
    }
    return [{
      header,
      nameIndex,
      topDictIndex,
      stringIndex,
      globalSubrIndex,
      topDict,
      privateDict,
      charStringsIndex,
      charset,
      encoding
    }];
  }
  parseHeader() {
    return {
      major: this.stream.getByte(),
      minor: this.stream.getByte(),
      hdrSize: this.stream.getByte(),
      offSize: this.stream.getByte()
    };
  }
  parseIndex(offset) {
    if (offset) {
      this.stream.pos = offset;
    }
    const index = new CFFIndex();
    const count = this.stream.getUint16();
    if (count === 0) {
      return index;
    }
    const offSize = this.stream.getByte();
    const startPos = this.stream.pos;
    const offsets = [];
    for (let i = 0; i <= count; i++) {
      let offset = 0;
      for (let j = 0; j < offSize; j++) {
        offset = offset * 256 + this.stream.getByte();
      }
      offsets.push(offset);
    }
    const data = [];
    const endPos = startPos + offSize * (count + 1);
    for (let i = 0; i < count; i++) {
      this.stream.pos = endPos + offsets[i] - 1;
      const obj = this.stream.getBytes(offsets[i + 1] - offsets[i]);
      data.push(obj);
    }
    index.set(data);
    return index;
  }
  parseDict(dict) {
    const stream = new Stream(dict);
    const lexer = new CFFLexer(stream);
    const parser = new CFFParser(lexer);
    return parser.parse();
  }
}
class CFFIndex {
  constructor() {
    this.objects = [];
  }
  set(objects) {
    this.objects = objects;
  }
  get(index) {
    return this.objects[index];
  }
  get length() {
    return this.objects.length;
  }
}
class CFFStrings {
  constructor() {
    this.strings = [];
  }
  get(index) {
    return this.strings[index];
  }
  get length() {
    return this.strings.length;
  }
}
class CFFTopDict {
  constructor(properties, stringIndex, globalSubrIndex, nameIndex) {
    this.properties = properties;
    this.stringIndex = stringIndex;
    this.globalSubrIndex = globalSubrIndex;
    this.nameIndex = nameIndex;
    this.privateDict = null;
    this.charStringsIndex = null;
    this.charset = null;
    this.encoding = null;
  }
  parse(dict) {}
}
class CFFPrivateDict {
  constructor(properties, stringIndex) {
    this.properties = properties;
    this.stringIndex = stringIndex;
    this.localSubrIndex = null;
  }
  parse(dict) {}
}
class CFFCharset {
  constructor() {
    this.charset = [];
  }
  parse() {}
}
class CFFEncoding {
  constructor() {
    this.encoding = {};
  }
  parse() {}
}
class CFFLexer {
  constructor(stream) {
    this.stream = stream;
  }
  getToken() {}
}
class CFFToken {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
function stringToBytes(str) {
  const length = str.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }
  return bytes;
}
function stringToPDFString(str) {
  let i,
    n = str.length,
    strBuf = "";
  if (n === 0) {
    return "()";
  }
  let hasUnicode = false;
  for (i = 0; i < n; ++i) {
    const char = str.charCodeAt(i);
    if (char >= 0x80) {
      hasUnicode = true;
      break;
    }
  }
  if (hasUnicode) {
    strBuf += "\xFE\xFF";
    for (i = 0; i < n; ++i) {
      const char = str.charCodeAt(i);
      const hi = char >> 8,
        lo = char & 0xff;
      strBuf += String.fromCharCode(hi, lo);
    }
  } else {
    for (i = 0; i < n; ++i) {
      strBuf += str[i];
    }
  }
  let strBufEncoded = "(";
  for (i = 0; i < strBuf.length; ++i) {
    const c = strBuf[i];
    if (c === "(" || c === ")" || c === "\\") {
      strBufEncoded += "\\" + c;
    } else {
      strBufEncoded += c;
    }
  }
  strBufEncoded += ")";
  return strBufEncoded;
}
function bytesToString(bytes) {
  let str = "",
    n = bytes.length;
  for (let i = 0; i < n; ++i) {
    str += String.fromCharCode(bytes[i]);
  }
  return str;
}
function log2(x) {
  let n = 1,
    i = 0;
  while (n < x) {
    n <<= 1;
    i++;
  }
  return i;
}
function readInt(bytes, bigEndian, size) {
  let x = 0;
  const sig = bigEndian ? 1 : -1;
  const start = bigEndian ? 0 : size - 1;
  const end = bigEndian ? size : -1;
  for (let i = start; i !== end; i += sig) {
    x = x << 8 | bytes[i];
  }
  const max = 1 << 8 * size;
  if (x >= max / 2) {
    x -= max;
  }
  return x;
}
function readUint(bytes, bigEndian, size) {
  let x = 0;
  const sig = bigEndian ? 1 : -1;
  const start = bigEndian ? 0 : size - 1;
  const end = bigEndian ? size : -1;
  for (let i = start; i !== end; i += sig) {
    x = x << 8 | bytes[i];
  }
  return x;
}
function writeInt(bytes, value, bigEndian, size) {
  const sig = bigEndian ? -1 : 1;
  const start = bigEndian ? size - 1 : 0;
  const end = bigEndian ? -1 : size;
  for (let i = start; i !== end; i += sig) {
    bytes[i] = value & 0xff;
    value >>= 8;
  }
}
function writeUint(bytes, value, bigEndian, size) {
  writeInt(bytes, value, bigEndian, size);
}
function shadow(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: true,
    configurable: true,
    writable: false
  });
  return value;
}
exports.shadow = shadow;
const arrayBytePool = {
  get(size, checkZero) {
    if (this.freeArr.length === 0) {
      return new Uint8Array(size);
    }
    let min = -1;
    for (let i = 0; i < this.freeArr.length; i++) {
      if (this.freeArr[i].length < size) {
        continue;
      }
      if (min === -1 || this.freeArr[i].length < this.freeArr[min].length) {
        min = i;
      }
    }
    if (min === -1) {
      return new Uint8Array(size);
    }
    const arr = this.freeArr.splice(min, 1)[0];
    if (checkZero) {
      arr.fill(0);
    }
    return arr;
  },
  release(arr) {
    this.freeArr.push(arr);
  },
  freeArr: []
};
exports.arrayBytePool = arrayBytePool;
class Util {
  static get AxialShadingFfromIR() {
    return shadow(this, "AxialShadingFromIR", getAxialShadingFromIR);
  }
  static get getShadingPatternFromIR() {
    return shadow(this, "getShadingPatternFromIR", getShadingPatternFromIR);
  }
  static get isSpace() {
    return shadow(this, "isSpace", isSpace);
  }
  static get isWhiteSpace() {
    return shadow(this, "isWhiteSpace", isWhiteSpace);
  }
  static get isBool() {
    return shadow(this, "isBool", isBool);
  }
  static get isInt() {
    return shadow(this, "isInt", isInt);
  }
  static get isNum() {
    return shadow(this, "isNum", isNum);
  }
  static get isString() {
    return shadow(this, "isString", isString);
  }
  static get isName() {
    return shadow(this, "isName", isName);
  }
  static get isCmd() {
    return shadow(this, "isCmd", isCmd);
  }
  static get isDict() {
    return shadow(this, "isDict", isDict);
  }
  static get isRef() {
    return shadow(this, "isRef", isRef);
  }
  static get isRefSet() {
    return shadow(this, "isRefSet", isRefSet);
  }
  static get isStream() {
    return shadow(this, "isStream", isStream);
  }
  static get isArray() {
    return shadow(this, "isArray", isArray);
  }
  static get isPDFFunction() {
    return shadow(this, "isPDFFunction", isPDFFunction);
  }
  static get clearPrimitiveCaches() {
    return shadow(this, "clearPrimitiveCaches", clearPrimitiveCaches);
  }
  static get Name() {
    return shadow(this, "Name", Name);
  }
  static get Cmd() {
    return shadow(this, "Cmd", Cmd);
  }
  static get Dict() {
    return shadow(this, "Dict", Dict);
  }
  static get Ref() {
    return shadow(this, "Ref", Ref);
  }
  static get RefSet() {
    return shadow(this, "RefSet", RefSet);
  }
  static get RefSetCache() {
    return shadow(this, "RefSetCache", RefSetCache);
  }
  static get EOF() {
    return shadow(this, "EOF", EOF);
  }
  static get BaseStream() {
    return shadow(this, "BaseStream", BaseStream);
  }
  static get Stream() {
    return shadow(this, "Stream", Stream);
  }
  static get StringStream() {
    return shadow(this, "StringStream", StringStream);
  }
  static get NullStream() {
    return shadow(this, "NullStream", NullStream);
  }
  static get DecodeStream() {
    return shadow(this, "DecodeStream", DecodeStream);
  }
  static get FakeStream() {
    return shadow(this, "FakeStream", FakeStream);
  }
  static get FlateStream() {
    return shadow(this, "FlateStream", FlateStream);
  }
  static get PredictorStream() {
    return shadow(this, "PredictorStream", PredictorStream);
  }
  static get LZWStream() {
    return shadow(this, "LZWStream", LZWStream);
  }
  static get CCITTFaxStream() {
    return shadow(this, "CCITTFaxStream", CCITTFaxStream);
  }
  static get JpegStream() {
    return shadow(this, "JpegStream", JpegStream);
  }
  static get RunLengthStream() {
    return shadow(this, "RunLengthStream", RunLengthStream);
  }
  static get AHLOS() {
    return shadow(this, "AHLOS", AHLOS);
  }
  static get PDFFunction() {
    return shadow(this, "PDFFunction", PDFFunction);
  }
  static get PostScriptParser() {
    return shadow(this, "PostScriptParser", PostScriptParser);
  }
  static get PostScriptLexer() {
    return shadow(this, "PostScriptLexer", PostScriptLexer);
  }
  static get CFFParser() {
    return shadow(this, "CFFParser", CFFParser);
  }
  static get CFFStandardStrings() {
    return shadow(this, "CFFStandardStrings", CFFStandardStrings);
  }
  static get CFFExpertSubsetCharset() {
    return shadow(this, "CFFExpertSubsetCharset", CFFExpertSubsetCharset);
  }
  static get Flate() {
    return shadow(this, "Flate", Flate);
  }
  static get createFlateStream() {
    return shadow(this, "createFlateStream", createFlateStream);
  }
  static get createAEF() {
    return shadow(this, "createAEF", createAEF);
  }
  static get createA85() {
    return shadow(this, "createA85", createA85);
  }
  static get createLZW() {
    return shadow(this, "createLZW", createLZW);
  }
  static get createRL() {
    return shadow(this, "createRL", createRL);
  }
  static get createCryptStream() {
    return shadow(this, "createCryptStream", createCryptStream);
  }
  static get Decrypt() {
    return shadow(this, "Decrypt", Decrypt);
  }
  static get isChar() {
    return shadow(this, "isChar", isChar);
  }
  static get isHexDigit() {
    return shadow(this, "isHexDigit", isHexDigit);
  }
  static get isOctalDigit() {
    return shadow(this, "isOctalDigit", isOctalDigit);
  }
  static get log2() {
    return shadow(this, "log2", log2);
  }
  static get readInt() {
    return shadow(this, "readInt", readInt);
  }
  static get readUint() {
    return shadow(this, "readUint", readUint);
  }
  static get writeInt() {
    return shadow(this, "writeInt", writeInt);
  }
  static get writeUint() {
    return shadow(this, "writeUint", writeUint);
  }
  static get bytesToString() {
    return shadow(this, "bytesToString", bytesToString);
  }
  static get stringToBytes() {
    return shadow(this, "stringToBytes", stringToBytes);
  }
  static get stringToPDFString() {
    return shadow(this, "stringToPDFString", stringToPDFString);
  }
  static get XRef() {
    return shadow(this, "XRef", XRef);
  }
  static get Linearization() {
    return shadow(this, "Linearization", Linearization);
  }
}
function HuffmanDecoder(stream) {
  this.stream = stream;
  this.bit_buffer = 0;
  this.bits = 0;
}
HuffmanDecoder.prototype = {
  buildHuffmanTable(lengths) {
    const table = [];
    const max_len = Math.max.apply(null, lengths);
    const codes = new Array(max_len + 1);
    let code = 0;
    for (let len = 1; len <= max_len; len++) {
      for (let i = 0; i < lengths.length; i++) {
        if (lengths[i] === len) {
          codes[i] = code++;
        }
      }
      code <<= 1;
    }
    for (let i = 0; i < lengths.length; i++) {
      const len = lengths[i];
      if (len === 0) {
        continue;
      }
      const code = codes[i];
      table[code] = len << 16 | i;
    }
    return [table, max_len];
  },
  _readBits(n) {
    while (this.bits < n) {
      const c = this.stream.getByte();
      if (c === EOF) {
        return -1;
      }
      this.bit_buffer = this.bit_buffer << 8 | c;
      this.bits += 8;
    }
    const bits = this.bit_buffer >> this.bits - n & (1 << n) - 1;
    this.bits -= n;
    return bits;
  },
  decode(table, max_len) {
    let code = 0;
    let len = 0;
    while (true) {
      len++;
      code = code << 1 | this._readBits(1);
      if (len > max_len) {
        throw new FormatError("Invalid huffman code");
      }
      const pair = table[code];
      if (pair && pair >> 16 === len) {
        return pair & 0xffff;
      }
    }
  },
  expandBuffer(buffer_length) {
    const new_buffer = new Uint8Array(buffer_length * 2);
    new_buffer.set(this.buffer.subarray(0, buffer_length));
    this.buffer = new_buffer;
  },
  decode: function HuffmanDecoder_decode() {
    let buffer = new Uint8Array(512),
      buffer_length = 0;
    let bfinal, btype;
    do {
      bfinal = this._readBits(1);
      btype = this._readBits(2);
      if (btype === 0) {
        const len = this._readBits(16);
        const nlen = this._readBits(16);
        this.bits = 0;
        this.bit_buffer = 0;
        const block = this.stream.getBytes(len);
        if (buffer_length + len > buffer.length) {
          const new_buffer = new Uint8Array(buffer_length + len);
          new_buffer.set(buffer);
          buffer = new_buffer;
        }
        buffer.set(block, buffer_length);
        buffer_length += len;
        continue;
      }
      if (btype === 1) {
        const lit_len = [],
          dist = [];
        let i;
        for (i = 0; i <= 143; i++) lit_len.push(8);
        for (i = 144; i <= 255; i++) lit_len.push(9);
        for (i = 256; i <= 279; i++) lit_len.push(7);
        for (i = 280; i <= 287; i++) lit_len.push(8);
        for (i = 0; i <= 31; i++) dist.push(5);
        let lit_len_code = this.buildHuffmanTable(lit_len);
        let dist_code = this.buildHuffmanTable(dist);
        var ll = lit_len_code[1],
          ld = dist_code[1];
        lit_len_code = lit_len_code[0];
        dist_code = dist_code[0];
      } else if (btype === 2) {
        const hlit = this._readBits(5) + 257;
        const hdist = this._readBits(5) + 1;
        const hclen = this._readBits(4) + 4;
        const clen = [];
        const order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        for (let i = 0; i < hclen; i++) {
          clen[order[i]] = this._readBits(3);
        }
        for (let i = hclen; i < 19; i++) {
          clen[order[i]] = 0;
        }
        const clen_code = this.buildHuffmanTable(clen);
        var cl = clen_code[1];
        clen_code = clen_code[0];
        const copy_len_and_dist = new Uint8Array(hlit + hdist);
        let i = 0;
        let code, repeat;
        while (i < hlit + hdist) {
          code = this.decode(clen_code, cl);
          if (code < 16) {
            copy_len_and_dist[i++] = code;
            continue;
          }
          if (code === 16) {
            repeat = this._readBits(2) + 3;
            if (i === 0) {
              throw new FormatError("Invalid block: no elements to copy.");
            }
            const prev = copy_len_and_dist[i - 1];
            for (let j = 0; j < repeat; j++) {
              copy_len_and_dist[i++] = prev;
            }
            continue;
          }
          if (code === 17) {
            repeat = this._readBits(3) + 3;
            for (let j = 0; j < repeat; j++) {
              copy_len_and_dist[i++] = 0;
            }
            continue;
          }
          if (code === 18) {
            repeat = this._readBits(7) + 11;
            for (let j = 0; j < repeat; j++) {
              copy_len_and_dist[i++] = 0;
            }
            continue;
          }
          throw new FormatError(`Invalid code: ${code}`);
        }
        const lit_len_code = this.buildHuffmanTable(copy_len_and_dist.subarray(0, hlit));
        const dist_code = this.buildHuffmanTable(copy_len_and_dist.subarray(hlit, hlit + hdist));
        var ll = lit_len_code[1],
          ld = dist_code[1];
        lit_len_code = lit_len_code[0];
        dist_code = dist_code[0];
      } else {
        throw new FormatError(`Invalid btype: ${btype}`);
      }
      let literal;
      while (true) {
        literal = this.decode(lit_len_code, ll);
        if (literal < 256) {
          if (buffer_length === buffer.length) {
            buffer = this.expandBuffer(buffer_length);
          }
          buffer[buffer_length++] = literal;
          continue;
        }
        if (literal === 256) {
          break;
        }
        literal -= 257;
        let len = codeLen[literal];
        if (codeLenExt[literal] > 0) {
          len += this._readBits(codeLenExt[literal]);
        }
        literal = this.decode(dist_code, ld);
        let dist = codeDist[literal];
        if (codeDistExt[literal] > 0) {
          dist += this._readBits(codeDistExt[literal]);
        }
        if (buffer_length === buffer.length) {
          buffer = this.expandBuffer(buffer_length);
        }
        const back_pos = buffer_length - dist;
        if (len > dist) {
          for (let i = 0; i < len; i++) {
            if (buffer_length === buffer.length) {
              buffer = this.expandBuffer(buffer_length);
            }
            buffer[buffer_length++] = buffer[back_pos + i];
          }
        } else {
          if (buffer_length + len > buffer.length) {
            buffer = this.expandBuffer(buffer_length);
          }
          buffer.set(buffer.subarray(back_pos, back_pos + len), buffer_length);
          buffer_length += len;
        }
      }
    } while (bfinal === 0);
    return buffer.subarray(0, buffer_length);
  }
};
function constructor(stream) {
  let buffer, buffer_length;
  let eof = false;
  const MIN_BUFFER_SIZE = 512;
  const ZLIB_HEADER = 78;
  const CHECK_sum = {
    ADLER32: 0,
    FLaG: 0
  };
  function readBlock() {
    let header;
    try {
      header = stream.getByte();
    } catch (e) {
      warn("FlateStream_readBlock: " + e);
      eof = true;
      return;
    }
    if (header === EOF) {
      eof = true;
      return;
    }
    if ((ZLIB_HEADER & 0x0f) !== 8) {
      throw new Error("Invalid compression method");
    }
    if ((ZLIB_HEADER >> 4) + 8 > 15) {
      throw new Error("Invalid window size");
    }
    if ((header & 0x20) >> 5) {
      const FDICT = stream.getInt32();
      CHECK_sum.ADLER32 = FDICT;
    }
    const cm = header & 0x0f;
    const cinfo = header >> 4;
    if (cm !== 8) {
      throw new Error(`Invalid compression method: ${cm}`);
    }
    if (cinfo > 7) {
      throw new Error(`Invalid window size: ${cinfo}`);
    }
    const check = (header * 256 + stream.getByte()) % 31;
    if (check !== 0) {
      throw new Error("Invalid FCHECK");
    }
    if ((header & 0x20) !== 0) {
      const dictId = stream.getBytes(4);
      warn("Need to support an external dictionary");
    }
    const fLaG = (header & 0xc0) >> 6;
    CHECK_sum.FLaG = fLaG;
    const decoder = new HuffmanDecoder(stream);
    const current_buffer = decoder.decode();
    const current_buffer_length = current_buffer.length;
    if (!buffer) {
      buffer = current_buffer;
      buffer_length = current_buffer_length;
    } else {
      const new_buffer = new Uint8Array(buffer_length + current_buffer_length);
      new_buffer.set(buffer);
      new_buffer.set(current_buffer, buffer_length);
      buffer = new_buffer;
      buffer_length += current_buffer_length;
    }
    const adler32 = (stream.getByte() << 24 | stream.getByte() << 16 | stream.getByte() << 8 | stream.getByte()) >>> 0;
    const adler32_buffer = buffer;
    let a = 1;
    let b = 0;
    for (let i = 0; i < adler32_buffer.length; i++) {
      a = (a + adler32_buffer[i]) % 65521;
      b = (b + a) % 65521;
    }
    const adler32_calculated = b << 16 | a;
    if (adler32 !== adler32_calculated) {}
  }
  const decodeStream = new DecodeStream(stream);
  decodeStream.readBlock = readBlock;
  return decodeStream;
}
function applyPredictor(stream, predictor, colors, bits, columns) {
  if (predictor === 1) {
    return stream;
  }
  const bpp = (colors * bits + 7 >> 3) * 8;
  const rowBytes = columns * colors * bits + 7 >> 3;
  let prevRow = new Uint8Array(rowBytes);
  let buffer, buffer_length;
  function readBlock() {
    const row = stream.getBytes(rowBytes);
    if (row.length === 0) {
      eof = true;
      return;
    }
    const predictor = stream.getByte();
    if (predictor === EOF) {
      eof = true;
      return;
    }
    if (predictor === PredictorPNG.None) {} else if (predictor === PredictorPNG.Sub) {
      for (let i = bpp; i < rowBytes; ++i) {
        row[i] = row[i] + row[i - bpp] & 0xff;
      }
    } else if (predictor === PredictorPNG.Up) {
      for (let i = 0; i < rowBytes; ++i) {
        row[i] = row[i] + prevRow[i] & 0xff;
      }
    } else if (predictor === PredictorPNG.Average) {
      for (let i = 0; i < rowBytes; ++i) {
        const sub = i < bpp ? 0 : row[i - bpp];
        const up = prevRow[i];
        row[i] = row[i] + (sub + up >> 1) & 0xff;
      }
    } else if (predictor === PredictorPNG.Paeth) {
      for (let i = 0; i < rowBytes; ++i) {
        const sub = i < bpp ? 0 : row[i - bpp];
        const up = prevRow[i];
        const upSub = i < bpp ? 0 : prevRow[i - bpp];
        const p = sub + up - upSub;
        const pa = Math.abs(p - sub);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upSub);
        let peath;
        if (pa <= pb && pa <= pc) {
          peath = sub;
        } else if (pb <= pc) {
          peath = up;
        } else {
          peath = upSub;
        }
        row[i] = row[i] + peath & 0xff;
      }
    } else {
      throw new Error(`Unsupported predictor: ${predictor}`);
    }
    prevRow = row;
    if (!buffer) {
      buffer = row;
      buffer_length = row.length;
    } else {
      const new_buffer = new Uint8Array(buffer_length + row.length);
      new_buffer.set(buffer);
      new_buffer.set(row, buffer_length);
      buffer = new_buffer;
      buffer_length += row.length;
    }
  }
  let eof = false;
  const predictorStream = new DecodeStream(stream);
  predictorStream.readBlock = readBlock;
  return predictorStream;
}
function createFlateStream(stream, dict) {
  const params = dict;
  const predictor = params.get("Predictor");
  if (predictor > 1) {
    const colors = params.get("Colors");
    const bits = params.get("BitsPerComponent");
    const columns = params.get("Columns");
    stream = applyPredictor(stream, predictor, colors, bits, columns);
  }
  stream = constructor(stream);
  return stream;
}
function createAEF(stream) {
  let eof = false;
  let buffer, buffer_length;
  function readBlock() {
    const chunk = stream.getBytes(MIN_BUFFER_SIZE);
    if (!chunk || chunk.length === 0) {
      eof = true;
      return;
    }
    if (!buffer) {
      buffer = chunk;
      buffer_length = chunk.length;
    } else {
      const new_buffer = new Uint8Array(buffer_length + chunk.length);
      new_buffer.set(buffer);
      new_buffer.set(chunk, buffer_length);
      buffer = new_buffer;
      buffer_length += chunk.length;
    }
  }
  const aefStream = new DecodeStream(stream);
  aefStream.readBlock = readBlock;
  return aefStream;
}
function createA85(stream) {
  let eof = false;
  const powers = [1, 85, 7225, 614125, 52200625];
  function readBlock() {
    let chunk = stream.getBytes();
    if (!chunk || chunk.length === 0) {
      eof = true;
      return;
    }
    chunk = chunk.subarray(0, chunk.length - 2);
    let buffer, buffer_length;
    const padding = chunk.length % 5;
    if (padding > 0) {
      const tmp = new Uint8Array(chunk.length + 5 - padding);
      tmp.set(chunk);
      for (let i = 0; i < 5 - padding; i++) {
        tmp[chunk.length + i] = 0x75;
      }
      chunk = tmp;
    }
    const n = chunk.length / 5;
    let decoded = new Uint8Array(n * 4);
    let decoded_length = 0;
    for (let i = 0; i < n; i++) {
      let value = 0;
      for (let j = 0; j < 5; j++) {
        value += (chunk[i * 5 + j] - 0x21) * powers[4 - j];
      }
      decoded[decoded_length++] = value >> 24 & 0xff;
      decoded[decoded_length++] = value >> 16 & 0xff;
      decoded[decoded_length++] = value >> 8 & 0xff;
      decoded[decoded_length++] = value & 0xff;
    }
    if (padding > 0) {
      decoded = decoded.subarray(0, decoded.length - (5 - padding));
    }
    if (!buffer) {
      buffer = decoded;
      buffer_length = decoded.length;
    } else {
      const new_buffer = new Uint8Array(buffer_length + decoded.length);
      new_buffer.set(buffer);
      new_buffer.set(decoded, buffer_length);
      buffer = new_buffer;
      buffer_length += decoded.length;
    }
  }
  const a85Stream = new DecodeStream(stream);
  a85Stream.readBlock = readBlock;
  return a85Stream;
}
function createLZW(stream, dict) {
  const earlyChange = dict.get("EarlyChange") || 1;
  const eod = 257;
  let table = [];
  for (let i = 0; i < 256; i++) {
    table[i] = [i];
  }
  let table_size = 258;
  let code_size = 9;
  let prev_code = -1;
  let buffer, buffer_length;
  let eof = false;
  function readBlock() {
    let bits = 0;
    let bit_buffer = 0;
    function readBits(n) {
      while (bits < n) {
        const c = stream.getByte();
        if (c === EOF) {
          return null;
        }
        bit_buffer = bit_buffer << 8 | c;
        bits += 8;
      }
      const code = bit_buffer >> bits - n & (1 << n) - 1;
      bits -= n;
      return code;
    }
    let code, prev_code;
    while (!eof) {
      code = readBits(code_size);
      if (code === null) {
        break;
      }
      if (code === 256) {
        table = [];
        for (let i = 0; i < 256; i++) {
          table[i] = [i];
        }
        table_size = 258;
        code_size = 9;
        prev_code = -1;
        continue;
      }
      if (code === eod) {
        eof = true;
        break;
      }
      let chunk;
      if (prev_code !== -1) {
        if (code < table_size) {
          chunk = table[code];
          const new_chunk = table[prev_code].slice();
          new_chunk.push(chunk[0]);
          table[table_size++] = new_chunk;
        } else {
          chunk = table[prev_code].slice();
          chunk.push(chunk[0]);
          table[table_size++] = chunk;
        }
      }
      if (table_size === 511 && earlyChange === 1) {
        code_size = 10;
      } else if (table_size === 1023 && earlyChange === 1) {
        code_size = 11;
      } else if (table_size === 2047 && earlyChange === 1) {
        code_size = 12;
      }
      chunk = table[code];
      if (!buffer) {
        buffer = new Uint8Array(chunk);
        buffer_length = chunk.length;
      } else {
        const new_buffer = new Uint8Array(buffer_length + chunk.length);
        new_buffer.set(buffer);
        new_buffer.set(chunk, buffer_length);
        buffer = new_buffer;
        buffer_length += chunk.length;
      }
      prev_code = code;
    }
  }
  const lzwStream = new DecodeStream(stream);
  lzwStream.readBlock = readBlock;
  return lzwStream;
}
function createRL(stream) {
  let eof = false;
  let buffer, buffer_length;
  function readBlock() {
    const chunk = stream.getBytes(128);
    if (!chunk || chunk.length === 0) {
      eof = true;
      return;
    }
    if (!buffer) {
      buffer = chunk;
      buffer_length = chunk.length;
    } else {
      const new_buffer = new Uint8Array(buffer_length + chunk.length);
      new_buffer.set(buffer);
      new_buffer.set(chunk, buffer_length);
      buffer = new_buffer;
      buffer_length += chunk.length;
    }
  }
  const rlStream = new DecodeStream(stream);
  rlStream.readBlock = readBlock;
  return rlStream;
}
function createCryptStream(stream, dict, xref) {
  const crypt = xref.encrypt;
  if (!crypt) {
    return stream;
  }
  let cryptStream = stream;
  if (crypt.name === "Identity") {
    return cryptStream;
  }
  throw new Error(`Unsupported crypt filter: ${crypt.name}`);
}
class Decrypt {
  constructor(password, encrypt) {
    this.password = password;
    this.encrypt = encrypt;
  }
  static create(password, encrypt) {
    return new Decrypt(password, encrypt);
  }
}
function isChar(c) {
  return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
}
function isHexDigit(c) {
  return c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F";
}
function isOctalDigit(c) {
  return c >= "0" && c <= "7";
}
const specialChars = ["(", ")", "<", ">", "[", "]", "{", "}", "/", "%"];
class Lexer {
  constructor(stream, knownCommands) {
    this.stream = stream;
    this.knownCommands = knownCommands;
  }
  static isSpecialChar(c) {
    return specialChars.includes(c);
  }
  getObj(recursion) {
    let ch = this.stream.getByte();
    while (isWhiteSpace(ch)) {
      ch = this.stream.getByte();
    }
    if (ch === EOF) {
      return EOF;
    }
    if (ch >= 0x30 && ch <= 0x39 || ch === 0x2b || ch === 0x2e || ch === 0x2d) {
      let str = String.fromCharCode(ch);
      while ((ch = this.stream.peekByte()) !== EOF && (ch >= 0x30 && ch <= 0x39 || ch === 0x2e)) {
        str += String.fromCharCode(this.stream.getByte());
      }
      if (str.includes(".")) {
        return parseFloat(str);
      }
      return parseInt(str, 10);
    }
    if (ch === 0x28) {
      let str = "";
      let parens = 1;
      while ((ch = this.stream.getByte()) !== EOF) {
        if (ch === 0x28) {
          parens++;
        } else if (ch === 0x29) {
          parens--;
          if (parens === 0) {
            break;
          }
        } else if (ch === 0x5c) {
          ch = this.stream.getByte();
          if (ch === EOF) {
            break;
          }
          if (ch === 0x6e) {
            str += "\n";
          } else if (ch === 0x72) {
            str += "\r";
          } else if (ch === 0x74) {
            str += "\t";
          } else if (ch === 0x62) {
            str += "\b";
          } else if (ch === 0x66) {
            str += "\f";
          } else if (ch === 0x5c || ch === 0x28 || ch === 0x29) {
            str += String.fromCharCode(ch);
          } else if (isOctalDigit(String.fromCharCode(ch))) {
            let octal = String.fromCharCode(ch);
            ch = this.stream.peekByte();
            if (isOctalDigit(String.fromCharCode(ch))) {
              octal += String.fromCharCode(this.stream.getByte());
              ch = this.stream.peekByte();
              if (isOctalDigit(String.fromCharCode(ch))) {
                octal += String.fromCharCode(this.stream.getByte());
              }
            }
            str += String.fromCharCode(parseInt(octal, 8));
          } else {
            str += String.fromCharCode(ch);
          }
        } else {
          str += String.fromCharCode(ch);
        }
      }
      return str;
    }
    if (ch === 0x2f) {
      let str = "";
      while ((ch = this.stream.peekByte()) !== EOF && !isWhiteSpace(ch) && !Lexer.isSpecialChar(String.fromCharCode(ch))) {
        str += String.fromCharCode(this.stream.getByte());
      }
      return Name.get(str);
    }
    if (ch === 0x3c) {
      ch = this.stream.peekByte();
      if (ch === 0x3c) {
        this.stream.skip();
        return Cmd.get("<<");
      }
      let str = "";
      while ((ch = this.stream.getByte()) !== EOF && ch !== 0x3e) {
        if (!isWhiteSpace(ch)) {
          str += String.fromCharCode(ch);
        }
      }
      if (str.length % 2 !== 0) {
        str += "0";
      }
      const bytes = new Uint8Array(str.length / 2);
      for (let i = 0; i < str.length; i += 2) {
        bytes[i / 2] = parseInt(str.substring(i, i + 2), 16);
      }
      return new Stream(bytes);
    }
    if (ch === 0x3e) {
      ch = this.stream.peekByte();
      if (ch === 0x3e) {
        this.stream.skip();
        return Cmd.get(">>");
      }
      return Cmd.get(">");
    }
    if (ch === 0x5b) {
      const arr = [];
      while ((ch = this.stream.peekByte()) !== EOF && ch !== 0x5d) {
        arr.push(this.getObj(recursion));
      }
      this.stream.skip();
      return arr;
    }
    if (ch === 0x5d) {
      return Cmd.get("]");
    }
    if (ch === 0x7b) {
      return Cmd.get("{");
    }
    if (ch === 0x7d) {
      return Cmd.get("}");
    }
    if (ch === 0x25) {
      while ((ch = this.stream.getByte()) !== EOF && ch !== 0x0a && ch !== 0x0d) {}
      return this.getObj(recursion);
    }
    let str = String.fromCharCode(ch);
    while ((ch = this.stream.peekByte()) !== EOF && !isWhiteSpace(ch) && !Lexer.isSpecialChar(String.fromCharCode(ch))) {
      str += String.fromCharCode(this.stream.getByte());
    }
    if (this.knownCommands && str in this.knownCommands) {
      return Cmd.get(str);
    }
    return str;
  }
}
exports.Lexer = Lexer;
class Parser {
  constructor({
    lexer,
    xref,
    recoveryMode = false
  }) {
    this.lexer = lexer;
    this.xref = xref;
    this.recoveryMode = recoveryMode;
    this.objectLoader = new Map();
  }
  getObj(recursion) {
    const obj = this.lexer.getObj(recursion);
    if (isCmd(obj)) {
      if (obj.cmd === "<<") {
        const dict = new Dict(this.xref);
        while (true) {
          const key = this.getObj(recursion);
          if (isCmd(key, ">>")) {
            break;
          }
          const value = this.getObj(recursion);
          dict.set(key.name, value);
        }
        return dict;
      }
      return obj;
    }
    if (Number.isInteger(obj) && Number.isInteger(this.lexer.stream.peekByte())) {
      const num = obj;
      const gen = this.lexer.getObj(recursion);
      if (isCmd(this.lexer.getObj(recursion), "R")) {
        return Ref.get(num, gen);
      }
    }
    return obj;
  }
}
exports.Parser = Parser;
function isEOF(v) {
  return v === EOF;
}
function isCmd(v, cmd) {
  return v instanceof Cmd && v.cmd === cmd;
}
class Linearization {
  constructor(stream) {
    this.parser = new Parser({
      lexer: new Lexer(stream),
      xref: null,
      recoveryMode: true
    });
    this.stream = stream;
  }
  staticcreate(stream) {
    const linearization = new Linearization(stream);
    return linearization.parse(stream);
  }
  parse(stream) {
    const parser = this.parser;
    const obj = parser.getObj();
    if (!Number.isInteger(obj)) {
      return null;
    }
    if (parser.getObj() !== "obj") {
      return null;
    }
    const dict = parser.getObj();
    if (!isDict(dict) || !dict.has("Linearized")) {
      return null;
    }
    if (dict.get("Linearized") !== 1.0) {
      return null;
    }
    const linearization = {
      length: dict.get("L"),
      hints: dict.get("H"),
      objectNumber: dict.get("O"),
      end: dict.get("E"),
      pageCount: dict.get("N"),
      mainXRefEntriesOffset: dict.get("T"),
      pageFirst: dict.get("P") || 0
    };
    const hints = linearization.hints;
    let hintsStream;
    if (Array.isArray(hints)) {
      hintsStream = new Stream(hints);
    } else {
      hintsStream = stream.makeSubStream(hints[0], hints[1]);
    }
    const hintsLexer = new Lexer(hintsStream);
    const hintsParser = new Parser({
      lexer: hintsLexer,
      xref: null,
      recoveryMode: true
    });
    linearization.hints = hintsParser.getObj();
    return linearization;
  }
}
class XRef {
  constructor(stream, password) {
    this.stream = stream;
    this.entries = [];
    this.xrefstms = Object.create(null);
    this.password = password;
    this.encrypt = null;
    this.trailer = null;
  }
  setPassword(password) {
    this.password = password;
  }
  parse(trailerDict) {
    let prev = trailerDict.get("Prev");
    if (prev) {
      this.parse(prev);
    }
    let xrefStream = trailerDict.get("XRefStm");
    if (xrefStream) {
      let stream = this.stream.makeSubStream(xrefStream);
      let lexer = new Lexer(stream);
      let parser = new Parser({
        lexer,
        xref: this,
        recoveryMode: true
      });
      let obj = parser.getObj();
      if (!Number.isInteger(obj)) {
        throw new FormatError("Invalid XRefStm entry");
      }
      obj = parser.getObj();
      if (!isCmd(obj, "obj")) {
        throw new FormatError("Invalid XRefStm entry");
      }
      const dict = parser.getObj();
      if (!isDict(dict)) {
        throw new FormatError("Invalid XRefStm entry");
      }
      const length = dict.get("Length");
      const filter = dict.get("Filter");
      const decodeParams = dict.get("DecodeParms");
      stream = new Stream(stream.getBytes(length), 0, length, dict);
      stream = this.stream.filter(stream, filter, decodeParams);
      const streamLexer = new Lexer(stream);
      const streamParser = new Parser({
        lexer: streamLexer,
        xref: this,
        recoveryMode: true
      });
      while (!stream.isEmpty) {
        const num = streamParser.getObj();
        const gen = streamParser.getObj();
        const offset = streamParser.getObj();
        const type = streamParser.getObj();
        if (type === 0) {
          delete this.entries[num];
        } else if (type === 1) {
          this.entries[num] = {
            offset,
            gen,
            type
          };
        } else if (type === 2) {
          const streamNum = streamParser.getObj();
          const streamGen = streamParser.getObj();
          this.entries[num] = {
            offset: streamGen,
            gen,
            type,
            stream: streamNum
          };
        }
      }
      this.xrefstms[xrefStream] = true;
    }
  }
  fetch(ref, suppressEncryption) {
    if (!isRef(ref)) {
      return ref;
    }
    const num = ref.num;
    const entry = this.entries[num];
    if (!entry) {
      return undefined;
    }
    if (entry.type === 2) {
      return this.fetchStream(ref);
    }
    const stream = this.stream.makeSubStream(entry.offset);
    const lexer = new Lexer(stream);
    const parser = new Parser({
      lexer,
      xref: this,
      recoveryMode: true
    });
    const obj1 = parser.getObj();
    const obj2 = parser.getObj();
    const obj3 = parser.getObj();
    if (obj1 !== num || obj2 !== entry.gen || !isCmd(obj3, "obj")) {
      throw new FormatError("Invalid object header");
    }
    let obj = parser.getObj();
    if (isDict(obj) && !obj.objId) {
      obj.objId = ref.toString();
    } else if (isStream(obj) && !obj.dict.objId) {
      obj.dict.objId = ref.toString();
    }
    if (!suppressEncryption) {
      if (this.encrypt) {
        if (isString(obj)) {
          obj = this.encrypt.decrypt(obj, ref);
        } else if (isStream(obj)) {
          obj = this.encrypt.decrypt(obj, ref);
        }
      }
    }
    return obj;
  }
  fetchIfRef(obj, suppressEncryption) {
    if (!isRef(obj)) {
      return obj;
    }
    return this.fetch(obj, suppressEncryption);
  }
  fetchAsync(ref, suppressEncryption) {
    return new Promise(resolve => {
      resolve(this.fetch(ref, suppressEncryption));
    });
  }
  fetchIfRefAsync(obj, suppressEncryption) {
    return new Promise(resolve => {
      resolve(this.fetchIfRef(obj, suppressEncryption));
    });
  }
  fetchStream(ref) {
    const num = ref.num;
    const entry = this.entries[num];
    const streamRef = Ref.get(entry.stream, 0);
    const stream = this.fetch(streamRef);
    if (!isStream(stream)) {
      throw new FormatError("Object stream is not a stream");
    }
    const first = stream.dict.get("First");
    const n = stream.dict.get("N");
    if (!Number.isInteger(first) || !Number.isInteger(n)) {
      throw new FormatError("Invalid object stream");
    }
    const streamBytes = stream.getBytes();
    const subStream = new Stream(streamBytes, first);
    const subLexer = new Lexer(subStream);
    const subParser = new Parser({
      lexer: subLexer,
      xref: this,
      recoveryMode: true
    });
    let i, j;
    for (i = 0; i < n; i++) {
      const objNum = subParser.getObj();
      const objOffset = subParser.getObj();
      if (objNum !== ref.num) {
        continue;
      }
      subStream.pos = first + objOffset;
      const obj = subParser.getObj();
      return obj;
    }
  }
  get trailer() {
    return this.trailer;
  }
  set trailer(dict) {
    this.trailer = dict;
  }
}
function createPromiseCapability() {
  let capability = {};
  capability.promise = new Promise(function (resolve, reject) {
    capability.resolve = resolve;
    capability.reject = reject;
  });
  return capability;
}
function createObjectURL(data, contentType, forceDataSchema) {
  if (typeof URL === "undefined" || forceDataSchema) {
    const buffer = [];
    for (let i = 0, ii = data.length; i < ii; i++) {
      buffer.push(String.fromCharCode(data[i]));
    }
    const url = `data:${contentType};base64,${btoa(buffer.join(""))}`;
    return Promise.resolve(url);
  }
  const blob = new Blob([data], {
    type: contentType
  });
  const url = URL.createObjectURL(blob);
  return Promise.resolve(url);
}
function removeNullCharacters(str) {
  return str.replace(/\0/g, "");
}
function normalizeUnicode(str) {
  return str.normalize();
}
function normalizeRect(rect) {
  const r = rect.slice(0);
  if (rect[0] > rect[2]) {
    r[0] = rect[2];
    r[2] = rect[0];
  }
  if (rect[1] > rect[3]) {
    r[1] = rect[3];
    r[3] = rect[1];
  }
  return r;
}
class Annotation {
  constructor(params) {
    this.data = params.data;
  }
  static get ANNots() {
    const ANNOTS = ["Text", "Link", "FreeText", "Line", "Square", "Circle", "Polygon", "PolyLine", "Highlight", "Underline", "Squiggly", "StrikeOut", "Stamp", "Caret", "Ink", "Popup", "FileAttachment", "Sound", "Movie", "Widget", "Screen", "PrinterMark", "TrapNet", "Watermark", "3D", "Redact"];
    return shadow(this, "ANNots", ANNOTS);
  }
  static fromRef(xref, ref) {
    return xref.fetchAsync(ref).then(dict => {
      if (!isDict(dict)) {
        return null;
      }
      const data = {};
      data.subtype = dict.get("Subtype").name;
      data.rect = dict.getArray("Rect");
      data.border = dict.getArray("Border");
      data.color = dict.getArray("C");
      data.title = dict.get("T");
      data.contents = dict.get("Contents");
      return new Annotation(data);
    });
  }
}
exports.Annotation = Annotation;
class AnnotationStorage {
  constructor() {
    this._storage = new Map();
    this._transformMatrix = IDENTITY_MATRIX.slice();
    this._transformInverseMatrix = IDENTITY_MATRIX.slice();
    this.onchange = null;
  }
  get size() {
    return this._storage.size;
  }
  add(annotation) {
    if (!(annotation instanceof Annotation)) {
      throw new Error("Invalid annotation");
    }
    this._storage.set(annotation.data.id, annotation);
    this.onchange?.({
      source: this,
      type: "add",
      annotation
    });
  }
  remove(annotation) {
    if (!(annotation instanceof Annotation)) {
      throw new Error("Invalid annotation");
    }
    this._storage.delete(annotation.data.id);
    this.onchange?.({
      source: this,
      type: "remove",
      annotation
    });
  }
  has(id) {
    return this._storage.has(id);
  }
  get(id) {
    return this._storage.get(id);
  }
  getAll() {
    return Array.from(this._storage.values());
  }
  get aLl() {
    return this.getAll();
  }
  reset() {
    this._storage.clear();
    this._transformMatrix = IDENTITY_MATRIX.slice();
    this._transformInverseMatrix = IDENTITY_MATRIX.slice();
  }
  setTransformMatrix(matrix) {
    this._transformMatrix = matrix.slice();
    this._transformInverseMatrix = Util.invert(matrix.slice());
  }
  get values() {
    return this._storage.values();
  }
}
exports.AnnotationStorage = AnnotationStorage;
const DocStats = null;
exports.DocStats = DocStats;
function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
function createImageCache(canvas) {
  const cache = new Map();
  function get(key) {
    return cache.get(key);
  }
  function set(key, value) {
    cache.set(key, value);
  }
  function clear() {
    cache.clear();
  }
  return {
    get,
    set,
    clear
  };
}
function createValidAbsoluteUrl(url, baseUrl) {
  if (!url || !isString(url)) {
    return null;
  }
  if (baseUrl === null && !/^https?:/i.test(url)) {
    return null;
  }
  try {
    return new URL(url, baseUrl).href;
  } catch (ex) {
    return null;
  }
}
const defaultImageCache = {
  get(key) {
    return undefined;
  },
  set(key, value) {}
};
const defaultGetCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};
const defaultGetPage = (pageIndex, canvas) => {
  return {
    canvas,
    promise: Promise.resolve()
  };
};
const defaultRenderInteractiveForms = false;
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}
exports.assert = assert;
const ReadableStream = "ReadableStream" in globalThis ? globalThis.ReadableStream : class {};
exports.ReadableStream = ReadableStream;
const isSentinal = obj => obj instanceof Cmd && (obj.cmd === "ID" || obj.cmd === "BI" || obj.cmd === "EI");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
//PDFJSSCRIPT_INCLUDE_CORE
//PDFJSSCRIPT_INCLUDE_DISPLAY

module.exports = __webpack_exports__;
})();

pdfjsLib = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=pdf.js.map

  