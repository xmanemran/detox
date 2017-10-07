const t = require("babel-types");
const generator = require("./generator");
const {
  isNumber,
  isString,
  isBoolean,
  isPoint,
  isOneOf,
  isGreyMatcher
} = require('./type-checks');

const typeCheckInterfaces = {
  NSInteger: isNumber,
  CGFloat: isNumber,
  CGPoint: isPoint,
  CFTimeInterval: isNumber,
  double: isNumber,
  float: isNumber,
  NSString: isString,
  BOOL: isBoolean,
  "NSDate *": isNumber,
  GREYDirection: isOneOf(["left", "right", "up", "down"]),
  GREYContentEdge: isOneOf(["left", "right", "top", "bottom"]),
  GREYPinchDirection: isOneOf(["outward", "inward"]),
  "id<GREYMatcher>": isGreyMatcher,
};

module.exports = generator({
  typeCheckInterfaces,
  supportedTypes: [
    "CGFloat",
    "CGPoint",
    "GREYContentEdge",
    "GREYDirection",
    "NSInteger",
    "NSString *",
    "NSString",
    "NSUInteger",
    "id<GREYMatcher>"
  ],
  renameTypesMap: {
    NSUInteger: "NSInteger",
    "NSString *": "NSString"
  }
});