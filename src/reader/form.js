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

    const node = form
      .attr('action', '/')
      .node();

    const data = serializeForm(node, this._serialize);

    form
      .selectAll('input[type=date]')
      .each((datum, index, nodes) => {
        if (nodes[index].value) {
          data[nodes[index].name] = nodes[index].valueAsNumber;
        }
      });

    this.pass(route, data);
  }
}
