import { writeFileSync } from 'fs';
import buble from 'rollup-plugin-buble';
import ignore from 'rollup-plugin-ignore';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const cssOptions = {
  include: [new RegExp('.css')],
  output: (styles) => {
    styles = styles.replace(
      /..\/fonts\/ionicons/g,
      'https://unpkg.com/ionicons@4.5.6/dist/fonts/ionicons'
    );

    writeFileSync('dist/dom.css', styles);
  }
};

const bubleOptions = {
  transforms: {
    dangerousForOf: true
  }
};

export default [{
  input: './index.js',
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
  plugins: [
    resolve(),
    commonjs(),
    builtins(),
    css(cssOptions),
    json(),
    buble(bubleOptions)
  ]
}, {
  input: './index.js',
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
    resolve(),
    commonjs(),
    builtins(),
    css(cssOptions),
    json(),
    buble(bubleOptions)
  ]
}];
