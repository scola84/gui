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

  act(route, data, callback) {
    const panel = select(route.node);

    const form = this._target ?
      panel.select('#' + this._target) : route.form;

    form.on('submit', () => {
      event.preventDefault();

      if (form.attr('action') === '/') {
        return;
      }

      data = this._read(form);

      if (callback) {
        callback(data);
      }

      form.attr('action', '/');
      this.pass(route, data);
    });
  }

  _read(form) {
    let data = {};

    data = this._readForm(form, data);
    data = this._readDate(form, data);
    data = this._readOrder(form, data);

    return data;
  }

  _readForm(form) {
    return serializeForm(form.node(), this._serialize);
  }

  _readDate(form, data) {
    form
      .selectAll('input[type=date]')
      .each((datum, index, nodes) => {
        if (nodes[index].value) {
          data[nodes[index].name] = nodes[index].valueAsNumber;
        }
      });

    return data;
  }

  _readOrder(form, data) {
    form
      .selectAll('ul.order')
      .each((d, group, nodes) => {
        select(nodes[group])
          .selectAll('li')
          .each((datum, index) => {
            if (datum.empty !== true) {
              data[datum.name] = data[datum.name] || [];
              data[datum.name].push({
                [datum.name]: datum[datum.name],
                group,
                index
              });
            }
          });
      });

    return data;
  }
}
