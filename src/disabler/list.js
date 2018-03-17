import { select } from 'd3';
import PanelDisabler from './panel';

export default class ListDisabler extends PanelDisabler {
  act(route, data, callback) {
    let node = select(route.node);

    if (this._target) {
      node = node.select('#' + this._target);
    }

    this._disableElements(route, data, node);
    this._hideElements(route, data, node);
    this._removeHiddenElements(node);
    this._removeEmptyBlocks(node);

    this.pass(route, data, callback);
  }
}
