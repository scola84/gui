import { select } from 'd3';
import PanelDisabler from './panel';

export default class FormDisabler extends PanelDisabler {
  act(route, data, callback) {
    let node = select(route.node);

    if (this._target) {
      node = node.select('#' + this._target);
    }

    this._disableElements(route, data, node);
    this._hideElements(route, data, node);

    this._removeHiddenElements(node);
    this._removeEmptyLists(node);

    this.pass(route, data, callback);
  }

  _disableElements(route, data, node) {
    for (let i = 0; i < this._disable.length; i += 1) {
      const { permission, selector } = this._disable[i];

      for (let j = 0; j < permission.length; j += 1) {
        const enabled = typeof permission[j] === 'function' ?
          permission[j](route, data, node) :
          this.filter(route, data, permission[j]);

        if (enabled === false) {
          node
            .selectAll(selector)
            .attr('disabled', 'disabled')
            .attr('tabindex', -1);
        }
      }
    }
  }
}
