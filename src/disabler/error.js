import { select } from 'd3';
import PanelDisabler from './panel';

export default class ErrorDisabler extends PanelDisabler {
  decide() {
    return false;
  }

  err(route, error, callback) {
    const panel = select(route.node);

    this._disableElements(route, {}, panel);
    this._hideElements(route, {}, panel);
    this._removeHiddenElements(panel);

    this.fail(route, error, callback);
  }
}
