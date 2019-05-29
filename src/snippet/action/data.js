import { map } from 'async';
import Action from '../action';

export default class Data extends Action {
  render(box, data) {
    map(this._list, (snippet, callback) => {
      snippet.render(box, data, callback);
    }, (error, values) => {
      if (error) {
        this.fail(box, error);
      } else {
        this.pass(box, values);
      }
    });
  }
}
