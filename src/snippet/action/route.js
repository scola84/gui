import { StateRouter } from '../../worker';
import { Action } from '../action';

export class Route extends Action {
  resolveAfter(box, data) {
    let route = null;

    for (let i = 0; i < this._list.length; i += 1) {
      route = this.resolveValue(box, data, this._list[i]);
      StateRouter.handle(box, data, route);
    }
  }
}
