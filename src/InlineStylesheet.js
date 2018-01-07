import StaticStylesheet from './sheets/StaticStylesheet';
import TaggedStylesheet from './sheets/TaggedStylesheet';

class InlineStylesheet {
    /**
     * @param {Array<StaticStylesheet|TaggedStylesheet>} sheets
     */
    constructor(sheets) {
        if (!(this instanceof InlineStylesheet)) {
            return new InlineStylesheet(sheets);
        }

        /** @type Array<StaticStylesheet|TaggedStylesheet> */
        this.sheets = sheets;

        return this;
    }

    /**
     * Creates an InlineStylesheet instance
     * @param  {string} base     The base styles
     * @param  {Object} modifier The style definitions for modifiers
     * @return {InlineStylesheet}  Returns a new instance of InlineStylesheet
     */
    static create(base, ...rest) {
        // Generate tagged template literal stylesheet
        if (Array.isArray(base) && Array.isArray(rest) && base.length === rest.length + 1) {
            return new InlineStylesheet([new TaggedStylesheet(base, rest)]);
        }

        // Generate static stylesheets
        if (base === null || base === undefined || typeof base === 'string') {
            const [modifier] = rest;

            if (modifier != null && (typeof modifier !== 'object' || Array.isArray(modifier))) {
                throw new Error(
                    `InlineStylesheet expects to be created with modifier styles defined as an object.
          You've provide modifier styles of type ${typeof modifier}`,
                );
            }

            return new InlineStylesheet([new StaticStylesheet({ base: base || '', ...modifier })]);
        }

        throw new Error(
            `InlineStylesheet expects to be created with base styles as a string or used as tagged template literal.
      You've provide base styles of type ${typeof base}`,
        );
    }

    /**
     * Concatinates the given modifier style declarations with existing style declarations and returns a new InlineStylesheet instance
     * @param  {Object} modifier The style definitions for modifiers that should be merged
     * @return {InlineStylesheet}  Returns a new instance of InlineStylesheet
     */
    concat(sheetOrModifier) {
        // Concat with another instance of inline stylesheets
        if (sheetOrModifier instanceof StaticStylesheet || sheetOrModifier instanceof TaggedStylesheet) {
            return new InlineStylesheet([...this.sheets, sheetOrModifier]);
        }

        // Convert modifier object to static stylesheet
        if (typeof sheetOrModifier === 'object' && !Array.isArray(sheetOrModifier)) {
            return new InlineStylesheet([...this.sheets, new StaticStylesheet(sheetOrModifier)]);
        }

        throw new Error(
            `InlineStylesheet expects to be concatinated with another InlineStylesheet instance or modifier styles.
      You haven't provided any.`,
        );
    }

    /**
     * Returns an object holding styles for the requested properties
     * @param  {Object} [props={}] Key value pairs to request the corresponding styles for
     * @return {Object}            Returns the requested styles as an object
     */
    build(props = {}) {
        return this.sheets.map((sheet) => sheet.build(props)).reduce((styles, style) => ({ ...styles, ...style }), {});
    }
}

export default InlineStylesheet;
