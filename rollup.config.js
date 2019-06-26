import { writeFileSync } from 'fs';
import buble from 'rollup-plugin-buble';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import ignore from 'rollup-plugin-ignore';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const input = './index.js';

const plugins = [
  resolve(),
  commonjs(),
  builtins(),
  css({
    output: (styles) => {
      writeFileSync('dist/dom.css', styles.replace(
        /\.\.\//g, 'https://unpkg.com/ionicons@4.5.6/dist/'
      ));
    }
  }),
  json(),
  buble({
    transforms: {
      dangerousForOf: true
    }
  })
];

export default [{
  input,
  external: [
    '@scola/http',
    'process'
  ],
  output: {
    extend: true,
    file: 'dist/dom.umd.js',
    format: 'umd',
    name: 'scola.dom',
    globals: {
      '@scola/http': 'scola.http'
    }
  },
  plugins
}, {
  input,
  external: [
    '@scola/http',
    'postal-codes-js'
  ],
  output: {
    file: 'dist/dom.cjs.js',
    format: 'cjs'
  },
  plugins: [
    ignore([
      'fastclick',
      'dom-shims',
      'es5-shim',
      'es6-shim',
      'es6-symbol/implement'
    ]),
    ...plugins
  ]
}];
