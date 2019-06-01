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
    'd3',
    'node-schedule'
  ],
  output: {
    extend: true,
    file: 'dist/doc.umd.js',
    format: 'umd',
    name: 'scola.doc',
    globals: {
      '@scola/codec': 'scola.codec',
      '@scola/http': 'scola.http'
    }
  },
  plugins: [
    resolve(),
    css({
      include: [new RegExp('.css')],
      output: 'dist/doc.css'
    }),
    commonjs(),
    json(),
    buble({
      transforms: {
        dangerousForOf: true
      }
    })
  ]
};
