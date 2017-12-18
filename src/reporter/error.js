import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

const presets = {
  all: '.panel > .body, .panel > .footer, .panel > .header',
  body: '.panel > .body',
  footer: '.panel > .footer',
  header: '.panel > .header'
};

export default class ErrorReporter extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._disabled = null;
    this.setDisabled(options.disabled);
  }

  setDisabled(value = '') {
    this._disabled = presets[value] ? presets[value] : value;
    return this;
  }

  err(route, error) {
    if (this._disabled) {
      select(route.node && route.node.parentNode)
        .selectAll(this._disabled)
        .classed('disabled', true);
    }

    select(route.node)
      .select('form')
      .attr('action', null);

    select(route.node)
      .select('.message')
      .remove();

    select(route.node)
      .select('.body')
      .insert('div', ':first-child')
      .classed('message', true)
      .append('span')
      .text(this.format(error));
  }
}
