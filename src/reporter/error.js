import { Worker } from '@scola/worker';
import { select } from 'd3';

const presets = {
  all: '.panel > .body, .panel > .footer, .panel > .header',
  body: '.panel > .body',
  footer: '.panel > .footer',
  header: '.panel > .header'
};

export default class ErrorReporter extends Worker {
  constructor(methods) {
    super(methods);

    this._format = (error) => error.message;
    this._disabled = '';
  }

  setDisabled(value) {
    this._disabled = presets[value] ? presets[value] : value;
    return this;
  }

  setFormat(value) {
    this._format = value;
    return this;
  }

  err(route, error) {
    if (this._disabled) {
      select(route.node && route.node.parentNode)
        .selectAll(this._disabled)
        .classed('disabled', true);
    }

    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .append('span')
      .text(this._format(error));
  }
}
