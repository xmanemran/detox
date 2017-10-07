const t = require("babel-types");
const generator = require("./generator");

const {
  isNumber
} = require('./type-checks');

const typeCheckInterfaces = {
  int: isNumber,
  double: isNumber
};

module.exports = generator({
  typeCheckInterfaces,
  supportedTypes: [
    'int',
    'double'
  ],
  renameTypesMap: {
  }
});