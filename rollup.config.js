import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './index.js',
  external: [
    '@scola/codec',
    '@scola/http',
    'async',
    'd3',
    'node-schedule'
  ],
  output: {
    extend: true,
    file: 'dist/gui.js',
    format: 'umd',
    name: 'scola',
    globals: {
      '@scola/codec': 'scola',
      '@scola/http': 'scola'
    }
  },
  plugins: [
    resolve(),
    css(),
    commonjs(),
    json(),
    buble({
      transforms: {
        dangerousForOf: true
      }
    })
  ]
};
