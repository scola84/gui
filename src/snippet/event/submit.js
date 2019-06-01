import { select } from 'd3';
import serializeForm from 'form-serialize';
import { DateTime } from 'luxon';
import Event from '../event';

export default class Submit extends Event {
  resolve(box, data) {
    return this._bind(box, data, 'submit', (form, event) => {
      event.preventDefault();
      this._submit(box, data, form);
    });
  }

  remove() {
    this._unbind('submit');
    super.remove();
  }

  _submit(box, data, form) {
    data = {};

    const node = form.node();

    if (node.attr('action') === '/') {
      return;
    }

    node.attr('action', '/');

    this._read(box, data, form);
    this.pass(box, data);
  }

  _read(box, data, form) {
    const node = form.node();

    this._readForm(box, data, node);
    this._readDates(box, data, node);
    this._readOrder(box, data, node);
    this._readFiles(box, data, node);
  }

  _readDates(box, data, form) {
    form
      .selectAll('.input .date')
      .each((datum, index, nodes) => {
        this._readDate(box, data, nodes[index]);
      });

    return data;
  }

  _readDate(box, data, node) {
    node = select(node);

    const dateInput = node.select('input[type=date]').node();
    const textInput = node.select('input[name]').node();

    const value = dateInput ?
      dateInput.valueAsNumber : textInput.value;

    if (value) {
      const date = DateTime
        .fromMillis(Number(value))
        .setZone('local');

      data[textInput.name] = dateInput ?
        date.valueOf() - (date.offset * 60 * 1000) :
        date.valueOf();
    }
  }

  _readFiles(box, data, form) {
    form
      .selectAll('input[type=file]')
      .each((datum, index, nodes) => {
        this._readFilesInput(box, data, form, nodes[index]);
      });

    return data;
  }

  _readFilesInput(box, data, form, node) {
    let name = select(node).attr('name');
    const isArray = name.slice(-2) === '[]';
    name = isArray ? name.slice(0, -2) : name;

    for (let i = 0; i < node.files.length; i += 1) {
      this._readFile(box, data, name, node.files[i], isArray);
    }
  }

  _readFile(box, data, name, file, isArray) {
    box.formData = true;

    if (isArray) {
      file = typeof data[name] === 'undefined' ?
        ([file]) : data[name].concat(file);
    }

    data[name] = file;
  }

  _readForm(box, data, form) {
    Object.assign(data, serializeForm(form.node(), {
      empty: true,
      hash: true
    }));
  }

  _readOrder(box, data) {
    return data;
  }
}
