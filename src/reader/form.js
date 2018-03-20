import { event, select } from 'd3';
import GraphicWorker from '../worker/graphic';

import {
  fixSubmit,
  readDate,
  readFile,
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

    fixSubmit(panel, form);

    form.on('submit', () => {
      event.preventDefault();

      if (form.attr('action') === '/') {
        return;
      }

      data = {};
      data = readForm(route, data, form, this._serialize);
      data = readDate(route, data, form);
      data = readOrder(route, data, form);
      data = readFile(route, data, form);
      data = this.merge(route, data, form);

      if (callback) {
        callback(data);
      }

      form.attr('action', '/');
      this.pass(route, data);
    });
  }
}
