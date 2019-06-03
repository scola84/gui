import markdown from 'marked';

export default function marked(value, locale, options = '') {
  options = options ? options.split(';') : [];

  const moptions = {
    breaks: true,
    sanitize: true
  };

  let key = null;
  let val = null;

  for (let i = 0; i < options.length; i += 1) {
    [key, val] = options[i].split('=');
    moptions[key] = val === '0' ? false : true;
  }

  return markdown(value, moptions);
}
