import { Worker } from '@scola/worker';

export default class ResponseTransformer extends Worker {
  act(response, data, callback) {
    if (response.status >= 300) {
      const error = new Error(String(response.status));
      this.fail(response.request.box, error, callback);
    } else {
      this.pass(response.request.box, data, callback);
    }
  }
}
