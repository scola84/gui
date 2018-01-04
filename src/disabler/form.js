import { select } from 'd3';
import PanelDisabler from './panel';

export default class FormDisabler extends PanelDisabler {
  act(route, data, callback) {
    let node = select(route.node);
    node = this._id ? node.select('#form-' + this._id) : node;

    this._disableElements(route, data, node);
    this._hideElements(route, data, node);

    this._removeHiddenElements(node);
    this._removeEmptyLists(node);

    this.pass(route, data, callback);
  }

  _disableElements(route, data, node) {
    this._disable.forEach(({ filter, selector }) => {
      filter.forEach((name) => {
        const enabled = typeof name === 'function' ?
          name(route, data, node) :
          this.filter(route, data, name);

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
