import { event, select } from 'd3';
import serializeForm from 'form-serialize';
import GraphicWorker from '../worker/graphic';

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

  act(route) {
    const panel = select(route.node);

    const form = this._target ?
      panel.select('#' + this._target) : route.form;

    form.on('submit', () => {
      event.preventDefault();
      this._submit(route, form);
    });
  }

  _submit(route, form) {
    if (form.attr('action') === '/') {
      return;
    }

    form = form
      .attr('action', '/')
      .node();

    this.pass(route, serializeForm(form, this._serialize));
  }
}
