import cssStringToObject from '../helpers/cssStringToObject';

export default class TaggedStylesheet {
    /**
     * @param {string[]} strings
     * @param {any[]} values
     */
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }

    /**
     * @param {Object<string, any>?} props
     * @return {Object<string, string>}
     */
    build(props = {}) {
        return cssStringToObject(
            this.strings.reduce((styles, current, index) => {
                const valueOrFunction = this.values[index] || '';
                const computed =
                    typeof valueOrFunction === 'function' ? valueOrFunction(props) : valueOrFunction.toString();

                return `${styles}${current}${computed}`;
            }, ''),
        );
    }
}
