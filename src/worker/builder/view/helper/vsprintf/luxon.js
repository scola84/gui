import { DateTime } from 'luxon';

export function luxon(value, options = '', locale = 'nl_NL') {
  locale = locale.replace('_', '-');
  options = options ? options.split(';') : [];

  const [
    format = 'D'
  ] = options;

  return DateTime
    .fromISO(value)
    .toFormat(format, { locale });
}
