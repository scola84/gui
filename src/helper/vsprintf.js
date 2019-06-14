import sprintf from 'sprintf-js';

import {
  luxon,
  marked,
  number
} from './vsprintf/';

const format = { l: luxon, m: marked, n: number };
const regexpBase = '%((\\((\\w+)\\))?((\\d+)\\$)?)([b-gijostTuvxXlmn])(\\[(.+)\\])?';
const regexpGlobal = new RegExp(regexpBase, 'g');
const regexpSingle = new RegExp(regexpBase);
const reductor = (name) => (a, v) => v[name] || a;

export default function vsprintf(string, args, locale) {
  const matches = string.match(regexpGlobal) || [];

  let match = null;
  let name = null;
  let position = null;
  let options = null;
  let type = null;
  let value = null;

  for (let i = 0; i < matches.length; i += 1) {
    [
      match, , , name, , position, type, , options
    ] = matches[i].match(regexpSingle);

    value = position ?
      args[position - 1] :
      (name ?
        args.reduce(reductor(name), '') :
        args[i]);

    if (format[type]) {
      string = string.replace(
        match,
        format[type](value, options, locale)
      );
    }
  }

  return sprintf.vsprintf(string, args);
}

Object.assign(vsprintf, format);
