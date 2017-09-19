import InlineStylesheet from './InlineStylesheet';

/**
 * Tagged template literal helper for inline styles with dynamic props support.
 *
 * @param {string[]} strings
 * @param {any[]} values
 * @return {Function<Object>}
 * @example
 *  inlineStyled`
 *    font-size: 10px;
 *    color: ${props => props.inverted ? 'black' : 'white'};
 *  `;
 */
export default function inlineStyled(strings, ...values) {
  return props =>
    InlineStylesheet.create(
      strings.reduce((styles, current, index) => {
        const value = values[index] || '';
        const computed = typeof value === 'function' ? value(props) : value.toString();
        return `${styles}${current}${computed}`;
      }, ''),
    ).styles();
}
