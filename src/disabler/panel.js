import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

const presets = {
  body: '.panel > .body',
  footer: '.panel > .footer',
  header: '.panel > .header'
};

export default class PanelDisabler extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._disabled = null;
    this._form = null;

    this.setDisabled(options.disabled);
    this.setForm(options.form);
  }

  setDisabled(value = 'all') {
    if (value === 'all') {
      value = Object.values(presets).join(',');
    }

    this._disabled = presets[value] ? presets[value] : value;
    return this;
  }

  setForm(value = true) {
    this._form = value;
    return this;
  }

  act(route, data, callback) {
    this._disable(route);
    this.pass(route, data, callback);
  }

  decide(route, data) {
    if (this._decide) {
      return this._decide(route, data);
    }

    return false;
  }

  err(route, data, callback) {
    this._disable(route);
    this.fail(route, data, callback);
  }

  _disable(route) {
    if (this._disabled) {
      select(route.node && route.node.parentNode)
        .selectAll(this._disabled)
        .classed('disabled', true);
    }

    select(route.node)
      .selectAll('form')
      .attr('disabled', this._form ? 'disabled' : null)
      .attr('action', null);
  }
}
