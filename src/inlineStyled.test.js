/* global describe, test, expect */
import inlineStyled from './inlineStyled';

describe('inlineStyled tagged template literal', () => {
  test('returns a function', () => {
    expect(typeof inlineStyled``).toBe('function');
  });

  test('creates empty object without styles', () => {
    expect(inlineStyled``()).toEqual({});
  });

  test('supports static styles usage', () => {
    const stylesheet = inlineStyled`background-color: blue;`;
    expect(stylesheet()).toEqual({
      backgroundColor: 'blue',
    });
  });

  test('supports dynamicaly computed values', () => {
    const stylesheet = inlineStyled`
      color: ${props => (props.inverted ? 'white' : 'black')};
      background-color: ${props => (props.inverted ? 'black' : 'white')};
      padding: 10px;
    `;

    expect(stylesheet({ inverted: true })).toEqual({
      color: 'white',
      backgroundColor: 'black',
      padding: '10px',
    });
  });

  test('supports number values', () => {
    const stylesheet = inlineStyled`
      position: absolute;
      top: ${props => props.top}px;
      left: ${props => props.left}%;
    `;

    expect(stylesheet({ top: 42, left: 42.42 })).toEqual({
      position: 'absolute',
      top: '42px',
      left: '42.42%',
    });
  });

  test('converts objects to string', () => {
    class SomeCrazyStuff {
      constructor() {
        this.supportsFlexbox = true;
      }

      toString() {
        return this.supportsFlexbox ? 'flex' : 'block';
      }
    }

    const stylesheet = inlineStyled`
      display: ${new SomeCrazyStuff()};
    `;

    expect(stylesheet()).toEqual({
      display: 'flex',
    });
  });
});
