import { Worker } from '@scola/worker';
import { event, select } from 'd3';
import serializeForm from 'form-serialize';

export default class FormReader extends Worker {
  act(route) {
    const form = select(route.node)
      .select('form')
      .on('submit', () => {
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

    this.pass(route, serializeForm(form, {
      empty: true,
      hash: true
    }));
  }
}
