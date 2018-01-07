/* eslint-disable class-methods-use-this */
import cssStringToObject from '../helpers/cssStringToObject';

export default class StaticStylesheet {
    constructor(styles) {
        if (!(this instanceof StaticStylesheet)) {
            return new StaticStylesheet(styles);
        }

        this.styles = styles;

        return this;
    }

    /**
     * Resolves style definitions in styles by a given key and value from the props
     * @private
     * @param  {Object} styles    The style definitions
     * @param  {string} key       The modifier name to resolve styles for
     * @param  {Object} props     The requested modifiers
     * @return {Object}           Returns a native Javascript object holding the styles
     */
    resolveStyle(styles, key, props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) {
            throw new Error(
                `Missing property ${key}. Please provide a ${key} property with possible values of ${Object.keys(
                    styles[`${key}`],
                ).join(', ')}`,
            );
        }

        const resolvedStyle = typeof styles[key] === 'string' ? styles[key] : styles[key][props[key]];

        if (this.isEntrypoint(resolvedStyle)) {
            return this.resolveStyle(resolvedStyle, Object.keys(resolvedStyle).pop(), props);
        }

        return cssStringToObject(resolvedStyle);
    }

    /**
     * Detects if the given node holds actual style definition or is hosting nested definitions and therefore acting as a entrypoint
     * @private
     * @param  {any} node The node to test on
     * @return {Boolean}  Returns true if the given node is an entrypoint and false if it is a style definition
     */
    isEntrypoint(node) {
        return typeof node !== 'string';
    }

    /**
     * Returns the top level keys of the intersection of given styles and properties.
     * This is useful to resolve styles in the order of definition rather than the order of props.
     * @private
     * @param  {Object} styles  An object holding styles for keys as identifier
     * @param  {Object} props   An object holding values for properties
     * @return {Array}          The intersecting keys of styles and properties in the order of styles
     */
    getEntrypoints(styles, props) {
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
     * @private
     * @param  {Object} [props={}]       Key value pairs to request the corresponding styles for
     * @return {Object<string, string>}  Returns the requested styles as an object
     */
    build(props = {}) {
        const entrypoints = this.getEntrypoints(this.styles, props);
        const styles = entrypoints.reduce((acc, key) => {
            acc.push(this.resolveStyle(this.styles, key, props));
            return acc;
        }, []);

        return styles.reduce((acc, style) => ({ ...acc, ...style }), cssStringToObject(this.styles.base));
    }
}
