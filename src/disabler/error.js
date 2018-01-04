import { select } from 'd3';
import PanelDisabler from './panel';

export default class ErrorDisabler extends PanelDisabler {
  decide() {
    return false;
  }

  disable(selector, ...names) {
    names = names.length === 0 ? [() => false] : null;
    super.disable(selector, ...names);
  }

  hide(selector, ...names) {
    names = names.length === 0 ? [() => false] : null;
    super.hide(selector, ...names);
  }

  err(route, error, callback) {
    const node = select(route.node);

    this._disableElements(route, {}, node);
    this._hideElements(route, {}, node);
    this._removeHiddenElements(node);

    this.fail(route, error, callback);
  }
}
