import { select } from 'd3';
import PanelDisabler from './panel';

export default class ErrorDisabler extends PanelDisabler {
  decide() {
    return false;
  }

  disable(value) {
    value.filter = value.filter || [() => false];
    return super.disable(value);
  }

  hide(value) {
    value.filter = value.filter || [() => false];
    return super.hide(value);
  }

  err(route, error, callback) {
    const node = select(route.node);

    this._disableElements(route, {}, node);
    this._hideElements(route, {}, node);
    this._removeHiddenElements(node);

    this.fail(route, error, callback);
  }
}
