import { DateTime } from 'luxon';

export default function luxon(value, locale = 'nl_NL', options = '') {
  options = options ? options.split(';') : [];

  const [
    format = 'D'
  ] = options;

  locale = locale.replace('_', '-');

  return DateTime
    .fromISO(value)
    .toFormat(format, { locale });
}
