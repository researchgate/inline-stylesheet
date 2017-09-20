import cssStringToObject from '../helpers/cssStringToObject';

export default class TaggedStylesheet {
  /**
   * @param {string[]} strings
   * @param {any[]} values
   */
  constructor(strings, values) {
    this._strings = strings;
    this._values = values;
  }

  /**
   * @param {Object<string, any>?} props
   * @return {Object<string, string>}
   */
  build(props = {}) {
    return cssStringToObject(
      this._strings.reduce((styles, current, index) => {
        const valueOrFunction = this._values[index] || '';
        const computed =
          typeof valueOrFunction === 'function'
            ? valueOrFunction(props)
            : valueOrFunction.toString();

        return `${styles}${current}${computed}`;
      }, ''),
    );
  }
}
