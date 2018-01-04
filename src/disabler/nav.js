import { select } from 'd3';
import PanelDisabler from './panel';

export default class NavDisabler extends PanelDisabler {
  act(route, data, callback) {
    let node = select(route.node);
    node = this._id ? node.select('#nav-' + this._id) : node;

    this._disableElements(route, data, node);
    this._hideElements(route, data, node);

    this._removeHiddenElements(node);
    this._removeEmptyLists(node);

    this.pass(route, data, callback);
  }
}
