[![npm (scoped)](https://img.shields.io/npm/v/@researchgate/inline-stylesheet.svg)](https://www.npmjs.com/package/@researchgate/inline-stylesheet)
[![Travis](https://img.shields.io/travis/researchgate/inline-stylesheet.svg)](https://travis-ci.org/researchgate/inline-stylesheet)
[![Codecov](https://img.shields.io/codecov/c/github/researchgate/inline-stylesheet.svg)](https://codecov.io/gh/researchgate/inline-stylesheet)

# Inline Stylesheet

A simple Javascript solution to create, maintain and resolve styles for inline usage in your components.

[Motivation](#motivation) <br/>
[Installation](#installation) <br/>
[Usage](#usage) <br/>
[API](#api) <br/>
[Advanced Usage](#advanced-usage)

## Motivation
While working on rendering emails using React we're looking for a solution to easily create and resolve inline styles for our components. With tons of CSS in Javascript solutions out there none of them actually met our expectations or simply did not support inlining styles. Inspired by the concept of modifiers in BEM and React Native's Stylesheet, we've created small library that allows us to writes styles using actual CSS syntax but apply them as inline styles.

## Installation

```npm install --save @researchgate/inline-stylesheet ```

## Usage

### Quickstart

```js
import InlineStylesheet from '@researchgate/inline-stylesheet';

const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
  background-color: red;
  margin: 10px 20px;
`);

const Button = ({ href, size, color }) => (
    <A style={stylesheet.styles()}></A>
);

```

### Define and resolve styles based on modifiers

```js
import InlineStylesheet from '@researchgate/inline-stylesheet';

const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
  background-color: red;
  margin: 10px 20px;
`, {
  size: {
    s: `
      font-size: 10px;
      margin: 5px 10px;
    `,
    m: `
      font-size: 12px;
      margin: 10px 20px;
    `,
  },
  color: {
    red: `
      background-color: red;
    `,
    green: `
      background-color: green;
    `,
  }
});

const Button = ({ href, size, color }) => (
    <A style={stylesheet.styles({ size, color })}></A>
);

```

## API

#### `InlineStylesheet.create(base, modifier)`

Creates your InlineStylesheet instance by defining base styles and styles for each of your modifiers.


| Argument | Type | Description | Default |
| --- | --- | --- | --- |
| `base` | `string` | The base styles of your component that will be returned regardless of if you call `styles` with or without modifiers. Theses base styles will be overwritten by modifier styles if needed. The string is expected to hold a valid CSS declaration. | `''` |
| `modifier` | `object` | An object holding the styles for your modifiers. The object expects to hold CSS declarations as a `string` for modifier values for each of the modifier keys. For more complex modifiers with dependencies, the modifier style object can be nested.| `null` |

```js
const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
`, {
  color: {
    red: `
      background-color: red;
    `,
    green: `
      background-color: green;
    `,
  }
});
```

#### `InlineStylesheet.style(modifier)`

Call this function to resolve styles based on modifiers. It will return and `object` holding base styles overwritten by modified styles if necessary. Also it will persist the order of styles as per definition. The order of modifiers passed in as an argument does not affect the order of how modifier styles are assigned on the base styles.

| Argument | Type | Description | Default |
| --- | --- | --- | --- |
| `modifier` | `object` | An object that holds key value pairs to resolve the modifications to your styles. e.g. `{ size: 's', color: 'green'}`. If empty, the function returns base styles. If set, base styles will be merged with the requested modified styles. | `null` |

```js
const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
  background-color: red;
  margin: 10px 20px;
`, {
  size: {
    s: `
      font-size: 10px;
      margin: 5px 10px;
    `,
    m: `
      font-size: 12px;
      margin: 10px 20px;
    `,
  },
  color: {
    red: `
      background-color: red;
    `,
    green: `
      background-color: green;
    `,
  }
});

/*
 Returns base styles
 {
   fontSize: '12px',
   backgroundColor: 'red',
   margin: '10px 20px',
 }
 */
stylesheet.style();

/*
 Returns base styles
 {
   fontSize: '10px',
   backgroundColor: 'red',
   margin: '5px 10px',
 }
 */
stylesheet.style({ size: 's', color: 'red'});
```

#### `InlineStylesheet.concat(modifier)`

Returns a new InlineStylesheet instance with concatenated style definitions.

| Argument | Type | Description | Default |
| --- | --- | --- | --- |
| `modifier` | `object` | An object holding additional modifier style declarations that you want to concat your existing styles with | `null` |

```js
let stylesheet = InlineStylesheet.create(`
  font-size: 12px;
`);

stylesheet.concat({
  color: {
    red: `
      background-color: red;
    `,
    green: `
      background-color: green;
    `,
  }
  ...
})
```

## Advanced usage

### Modifiers with dependencies
Sometimes modifiers depend on each other. Image a button that needs to apply colors differently depending on the given theme. Therefore you can use the feature of nested modifier style declaration.

```js
const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
  border: 1px solid;
`, {
  theme: {
    solid: {
      color: {
        red: `
          background-color: red;
        `,
        green: `
          background-color: green;
        `,
      }
    }
    ghost: {
      color: {
        red: `
          border-color: red;
        `,
        green: `
          border-color: green;
        `,
      }
    }
  },
});

/*
  {
    fontSize: '12px';
    border: '1px solid';
    borderColor: '';
}
 */
stylesheet.styles({ theme: 'ghost', color: 'green' });
```

### Boolean modifiers
In some cases you'd like to define modifiers as a simple boolean value. `InlineStylesheet` also covers that:

```js
const stylesheet = InlineStylesheet.create(`
  font-size: 12px;
  border: 1px solid;
`, {
  disabled:`
    background: grey;
    border-color: grey;
  `,
});

/*
  {
    fontSize: '12px';
    border: '1px solid';
    background: 'grey';
    border-color: 'grey';
}
 */
stylesheet.styles({ disabled: true });
```

### Define styles using string templates

```js
const stylesheet = InlineStylesheet.create(`
  font-size: ${baseFontSize};
`, {
  color: {
    red: `
      background-color: ${colors.red};
    `,
    green: `
      background-color: ${colors.green};
    `,
  }
});
```
