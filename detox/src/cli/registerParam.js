const _ = require('lodash');

const wrap = (prefix, suffix) => (str) => prefix + str + suffix;
const wrap_angle = wrap('<', '>');
const wrap_square = wrap('[', ']');

function registerCliParam(program, param) {
  const alias = param.alias ? `-${param.alias}` : '';
  const wrapHint = param.required ? wrap_angle : wrap_square;
  const hint = param.hint ? ' ' + wrapHint(param.hint) : '';
  const fullName = param.name ? `--${param.name}` : '';

  const option = [alias, fullName].filter(Boolean).join(', ').trim() + hint;
  const description = param.description || '';

  const hasDefaultValue = 'defaultValue' in param;
  const hasTransformFunction = _.isFunction(param.transform);

  if (hasDefaultValue && hasTransformFunction) {
    program.option(option, description, param.defaultValue, param.transform);
  } else if (hasDefaultValue) {
    program.option(option, description, param.defaultValue);
  } else if (hasTransformFunction) {
    program.option(option, description, param.transform);
  } else {
    program.option(option, description);
  }
}

module.exports = registerCliParam;
