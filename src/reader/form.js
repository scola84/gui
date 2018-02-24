import { event, select } from 'd3';
import GraphicWorker from '../worker/graphic';

import {
  readDate,
  readForm,
  readOrder
} from '../helper';

export default class FormReader extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._serialize = null;
    this.setSerialize(options.serialize);
  }

  setSerialize(value = { empty: true, hash: true }) {
    this._serialize = value;
    return this;
  }

  act(route, data, callback) {
    const panel = select(route.node);

    const form = this._target ?
      panel.select('#' + this._target) : route.form;

    form.on('submit', () => {
      event.preventDefault();

      if (form.attr('action') === '/') {
        return;
      }

      data = readForm(form, data, this._serialize);
      data = readDate(form, data);
      data = readOrder(form, data);

      if (callback) {
        callback(data);
      }

      form.attr('action', '/');
      this.pass(route, data);
    });
  }
}
