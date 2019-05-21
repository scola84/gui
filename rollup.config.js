import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  external: [
    'async',
    'd3',
    'node-schedule'
  ],
  output: {
    file: 'dist/gui.js',
    name: 'scola',
    format: 'umd',
    globals: {
      async: 'async',
      d3: 'd3'
    }
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    buble()
  ]
};
