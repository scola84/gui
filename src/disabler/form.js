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
    this._disable.forEach(({ permission, selector }) => {
      permission.forEach((item) => {
        const enabled = typeof item === 'function' ?
          item(route, data, node) :
          this.filter(route, data, item);

        if (enabled === false) {
          node
            .selectAll(selector)
            .attr('disabled', 'disabled')
            .attr('tabindex', -1);
        }
      });
    });
  }
}
