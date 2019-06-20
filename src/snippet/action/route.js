import { StateRouter } from '../../worker';
import { Action } from '../action';

export class Route extends Action {
  resolveAfter(box, data) {
    let string = null;

    for (let i = 0; i < this._list.length; i += 1) {
      string = this.resolveValue(box, data, this._list[i]);
      StateRouter.handleRoute(box, data, string);
    }
  }
}
