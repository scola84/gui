import { Worker } from '@scola/worker';
import { select } from 'd3';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const route = response.request.box;

    select(route.node)
      .select('form')
      .attr('action', null);

    if (response.status >= 300) {
      this.fail(route, new Error(String(response.status)), callback);
      return;
    }

    this.pass(route, data, callback);
  }
}
