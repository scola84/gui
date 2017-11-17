import { Worker } from '@scola/worker';
import { select } from 'd3';
import serializeForm from 'form-serialize';

export default class FormReader extends Worker {
  act(route) {
    select(route.node)
      .select('form')
      .on('submit', (d, i, node) => {
        event.preventDefault();
        this._submit(route, node[0]);
      });
  }

  _submit(route, form) {
    this.pass(route, serializeForm(form, {
      empty: true,
      hash: true
    }));
  }
}
