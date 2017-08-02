/* eslint-disable class-methods-use-this */

import camelCase from 'lodash/camelCase';

class InlineStylesheet {
  constructor(styles) {
    if (!(this instanceof InlineStylesheet)) return new InlineStylesheet(styles);

    this._styles = styles;

    return this;
  }

  /**
   * Creates an InlineStylesheet instance
   * @param  {[type]} base     [description]
   * @param  {[type]} modifier [description]
   * @return [type]            [description]
   */
  static create(base, modifier) {
    if (base && typeof base !== 'string') {
      throw new Error(
        `InlineStylesheet expects be created with base styles as a string.
        You've provide base styles of type ${typeof base}`,
      );
    }
    if ((modifier !== null && modifier !== undefined) && (typeof modifier !== 'object' || Array.isArray(modifier))) {
      throw new Error(
        `InlineStylesheet expects be created with modifier styles defined as an object.
        You've provide modifier styles of type ${typeof modifier}`,
      );
    }

    return new InlineStylesheet({ _base: base || '', ...modifier });
  }

  /**
   * Concatinates the given modifier style declarations with existing style declarations and returns a new InlineStylesheet instance
   */
  concat(modifier) {
    if (!modifier === null || modifier === undefined) {
      throw new Error(
        'InlineStylesheet expects be concatinated with modifier styles.
        You haven\'t provided modifier styles.',
      );
    }

    if (typeof modifier !== 'object' || Array.isArray(modifier)) {
      throw new Error(
        `InlineStylesheet expects be concatinated with modifier styles defined as an object.
        You've provide modifier styles of type ${typeof modifier}`,
      );
    }

    return new InlineStylesheet({
      ...this._styles,
      ...modifier,
    });
  }

  /**
   * Translates the given css string declaration in to js object syntax
   */
  _cssToObject(css) {
    const rules = css
      .replace(/ /g, '')
      .replace(/\n/g, '')
      .split(/;|\n/);

    rules.pop();

    const o = rules.reduce((acc, rule) => {
      const pair = rule.split(':');
      acc[camelCase(pair[0])] = pair[1];
      return acc;
    }, {});

    return o;
  }

  /**
   * Resolves style definitions in styles by a given key and value from the props
   */
  _resolveStyle(styles, key, props) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) {
      throw new Error(
        `Missing property ${key}. Please provide a ${key} property with possible values of ${Object.keys(styles[`${key}`]).join(', ')}`,
      );
    }

    const resolvedStyle = styles[key][props[key]];

    if (this._isEntrypoint(resolvedStyle)) {
      return this._resolveStyle(
        resolvedStyle,
        Object.keys(resolvedStyle).pop(),
        props,
      );
    }

    return this._cssToObject(resolvedStyle);
  }

  /**
   * Detects if the given node holds actual style definition or is hosting nested definitions and therfore acting as a entrypoint
   * @param  {any} node The node to test on
   * @return Boolean       Returns true if the given node is an entrypoint and false if it is a style definition
   */
  _isEntrypoint(node) {
    return typeof node !== 'string';
  }

  /**
   * Returns the top level keys of the intersection of given styles and properties.
   * This is useful to resolve styles in the order of definition rather than the order of props.
   * @param  {Object} styles  An object holding styles for keys as identifier
   * @param  {Object} props   An object holding values for properties
   * @return {Array}          The intersecting keys of styles and properties in the order of styles
   */
  _getEntrypoints(styles, props) {
    const entrypoints = Object.keys(styles).reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        acc.push(key);
      }
      return acc;
    }, []);
    return entrypoints;
  }

  /**
   * Returns an object holding styles for the requested properties
   * @param  {Object} [props={}] Key value pairs to request the corresponding styles for
   * @return {Object}            Returns the requested styles as an object
   */
  styles(props = {}) {
    const entrypoints = this._getEntrypoints(this._styles, props);
    const styles = entrypoints.reduce((acc, key) => {
      acc.push(this._resolveStyle(this._styles, key, props));
      return acc;
    }, []);

    return styles.reduce((acc, style) => (
      Object.assign({}, acc, style)
    ), this._cssToObject(this._styles._base));
  }
}

export default InlineStylesheet;
