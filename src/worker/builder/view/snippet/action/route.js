import { ViewRouter } from '../../../../router';
import { Action } from '../action';

export class Route extends Action {
  resolveAfter(box, data) {
    let route = null;

    for (let i = 0; i < this._args.length; i += 1) {
      route = this.resolveValue(box, data, this._args[i]);
      ViewRouter.handle(box, data, route);
    }
  }
}
