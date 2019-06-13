import { format, formatPrefix } from 'd3';

export default function number(value, locale, options = '') {
  options = options ? options.split(';') : [];

  const [
    specifier,
    val = '',
    separator = ''
  ] = options;

  const formatter = val === '' ?
    format(specifier) :
    formatPrefix(specifier, val);

  value = formatter(value);
  value = separator === '' ?
    value :
    value.slice(0, -1) + separator + value.slice(-1);

  return value;
}
