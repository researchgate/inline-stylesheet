import camelCase from 'lodash/camelCase';

/**
 * Translates the given css string declaration in to js object syntax
 * @param  {string} css       The css style declaration to be translated
 * @return {Object}           Returns a native Javascript object
 */
export default function cssStringToObject(css) {
  if (typeof css !== 'string') return {};

  const rules = css
    .replace(/\s+/g, ' ')
    .split(/;/);

  rules.pop();

  return rules.reduce((styles, rule) => {
    const [name, value] = rule.split(':');
    return { ...styles, [camelCase(name)]: value.trim() };
  }, {});
}
