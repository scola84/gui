import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    const route = response.request.box;

    if (response.status >= 300) {
      this.fail(route, new Error(String(response.status)), callback);
      return;
    }

    this.merge(route, data, response);
    this.pass(route, data, callback);
  }
}
