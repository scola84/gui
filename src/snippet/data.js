import { map } from 'async';
import Action from './action';

export default class Data extends Action {
  render(box, data) {
    map(this._list, (item, callback) => {
      item.render(box, data, callback);
    }, (error, values) => {
      this.handle(box, values);
    });
  }
}
