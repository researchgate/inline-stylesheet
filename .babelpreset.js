'use strict';

const env = process.env.BABEL_ENV || process.env.NODE_ENV || "development";

const presets = [
  ['env', {
    loose: true,
    modules: env !== 'production_es' ? 'commonjs' : false,
  }]
];

const plugins = [
  'transform-class-properties',
  'transform-object-rest-spread',
];

module.exports = {
  presets: presets,
  plugins: plugins,
};
