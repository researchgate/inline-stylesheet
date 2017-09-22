/* global describe, test, expect */
import InlineStylesheet from './InlineStylesheet';

describe('supports instantiation', () => {
  test('without base styles', () => {
    const styles = InlineStylesheet.create();
    expect(styles.build()).toEqual({});
  });

  test('without base template literal styles', () => {
    const styles = InlineStylesheet.create``;
    expect(styles.build()).toEqual({});
  });

  test('with base styles', () => {
    const styles = InlineStylesheet.create(`
      font-size: 12px;
      background: red;
    `);
    const expected = {
      fontSize: '12px',
      background: 'red',
    };
    const actual = styles.build();
    expect(actual).toEqual(expected);
  });

  test('with template literal syntax base styles', () => {
    const styles = InlineStylesheet.create`
      font-size: 12px;
      background: red;
    `;

    expect(styles.build()).toEqual({
      fontSize: '12px',
      background: 'red',
    });
  });

  test('with base styles and modifiers', () => {
    const styles = InlineStylesheet.create(
      `
        font-size: 12px;
        background: red;
      `,
      {
        size: {
          s: 'font-size: 10px;',
          m: 'font-size: 12px;',
          l: 'font-size: 14px;',
        },
      },
    );

    const actual = styles.build({ size: 'l' });
    const expected = {
      fontSize: '14px',
      background: 'red',
    };
    expect(actual).toEqual(expected);
  });

  test('with template literal syntax and dynamic values', () => {
    const styles = InlineStylesheet.create`
      font-size: ${props => (props.big ? 30 : 15)}px;
      color: blue;
    `;

    expect(styles.build({ big: true })).toEqual({
      fontSize: '30px',
      color: 'blue',
    });
  });
});

test('support concatination after creation', () => {
  const styles = InlineStylesheet.create(
    `
      font-size: 12px;
      background: red;
    `,
  ).concat({
    size: {
      s: 'font-size: 10px;',
      m: 'font-size: 12px;',
      l: 'font-size: 14px;',
    },
  });

  const actual = styles.build({ size: 'l' });
  const expected = {
    fontSize: '14px',
    background: 'red',
  };
  expect(actual).toEqual(expected);
});

describe('resolves styles', () => {
  const styles = InlineStylesheet.create(
    `
      font-size: 12px;
      background: red;
    `,
    {
      size: {
        s: 'font-size: 10px;',
        m: 'font-size: 12px;',
        l: 'font-size: 14px;',
      },
      theme: {
        bare: {
          color: {
            red: 'color: red;',
            blue: 'color: blue;',
          },
        },
        ghost: {
          color: {
            red: 'border: 1px solid red; color: red;',
            blue: 'border: 1px solid blue; color: blue;',
          },
        },
        solid: {
          color: {
            red: 'background: red; color: white;',
            blue: 'background: blue; color: white;',
          },
        },
      },
      status: {
        disabled: 'color: white; background: grey;',
      },
      disabled: `
        background: grey;
      `,
    },
  );

  test('when no modifiers are given', () => {
    const expected = {
      fontSize: '12px',
      background: 'red',
    };
    const actual = styles.build();
    expect(actual).toEqual(expected);
  });

  test('when modifiers are given', () => {
    const expected = {
      fontSize: '14px',
      background: 'red',
    };
    const actual = styles.build({ size: 'l' });
    expect(actual).toEqual(expected);
  });

  test('when boolean modifiers are given', () => {
    const expected = {
      fontSize: '12px',
      background: 'grey',
    };
    const actual = styles.build({ disabled: true });
    expect(actual).toEqual(expected);
  });

  test('when modifier styles are nested', () => {
    const expected = {
      fontSize: '12px',
      background: 'blue',
      color: 'white',
    };
    const actual = styles.build({ theme: 'solid', color: 'blue' });
    expect(actual).toEqual(expected);
  });

  test('persisting the order of style declarations', () => {
    const expected = {
      fontSize: '12px',
      background: 'grey',
      color: 'white',
    };
    const actual = styles.build({
      status: 'disabled',
      theme: 'solid',
      color: 'blue',
    });
    expect(actual).toEqual(expected);
  });
});

describe('throws errors', () => {
  test('when base styles are not of type string', () => {
    expect(() => {
      InlineStylesheet.create({});
    }).toThrow();
    expect(() => {
      InlineStylesheet.create([]);
    }).toThrow();
    expect(() => {
      InlineStylesheet.create(true);
    }).toThrow();
  });

  test('when modifier styles are not of type object', () => {
    const styles = InlineStylesheet.create();
    expect(() => {
      InlineStylesheet.create(null, '');
    }).toThrow();
    expect(() => {
      InlineStylesheet.create(null, []);
    }).toThrow();
    expect(() => {
      InlineStylesheet.create(null, true);
    }).toThrow();
    expect(() => {
      styles.concat();
    }).toThrow();
    expect(() => {
      styles.concat('');
    }).toThrow();
    expect(() => {
      styles.concat([]);
    }).toThrow();
    expect(() => {
      styles.concat(true);
    }).toThrow();
  });

  test('when properties for resolving nested styles are missing', () => {
    const styles = InlineStylesheet.create('', {
      theme: {
        bare: {
          color: {
            red: 'color: red;',
            blue: 'color: blue;',
          },
        },
        ghost: {
          color: {
            red: 'border: 1px solid red; color: red;',
            blue: 'border: 1px solid blue; color: blue;',
          },
        },
        solid: {
          color: {
            red: 'background: red; color: white;',
            blue: 'background: blue; color: white;',
          },
        },
      },
    });

    expect(() => {
      styles.build({ theme: 'solid' });
    }).toThrow();
  });
});
