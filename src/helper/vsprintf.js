import sprintf from 'sprintf-js';

import {
  luxon,
  marked,
  number
} from './vsprintf/';

const formatters = { l: luxon, m: marked, n: number };
const regexpBase = '%((\\((\\w+)\\))?((\\d+)\\$)?)([b-gijostTuvxXlmn])(\\[(.+)\\])?';
const regexpGlobal = new RegExp(regexpBase, 'g');
const regexpSingle = new RegExp(regexpBase);
const reductor = (name) => (a, v) => typeof v[name] === 'undefined' ? a : v[name];

export function vsprintf(format, args, locale) {
  const matches = format.match(regexpGlobal) || [];

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

    if (formatters[type]) {
      format = format.replace(
        match,
        formatters[type](value, options, locale)
      );
    }
  }

  return sprintf.vsprintf(format, args);
}

Object.assign(vsprintf, formatters);
