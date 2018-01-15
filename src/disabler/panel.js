import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class PanelDisabler extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._disable = [];
    this._hide = [];
  }

  act(route, data, callback) {
    const panel = select(route.node);

    this._disableElements(route, data, panel);
    this._hideElements(route, data, panel);
    this._removeHiddenElements(panel);

    this.pass(route, data, callback);
  }

  disable(value) {
    value.permission = Array.isArray(value.permission) ?
      value.permission : [value.permission || (() => false)];

    this._disable.push(value);
    return this;
  }

  filter(box, data, context) {
    if (this._filter) {
      return this._filter(box, data, context);
    }

    return false;
  }

  hide(value) {
    value.permission = Array.isArray(value.perimssion) ?
      value.permission : [value.permission || (() => false)];

    this._hide.push(value);
    return this;
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
            .classed('disabled', true)
            .attr('tabindex', (datum, index, nodes) => {
              return select(nodes[index]).attr('tabindex') === '0' ?
                -1 : null;
            });
        }
      });
    });
  }

  _hideElements(route, data, node) {
    this._hide.forEach(({ permission, selector }) => {
      permission.forEach((item) => {
        const visible = typeof item === 'function' ?
          item(route, data, node) :
          this.filter(route, data, item);

        if (visible === false) {
          node
            .selectAll(selector)
            .classed('hidden', true);
        }
      });
    });
  }

  _removeEmptyLists(node) {
    node
      .selectAll('ul')
      .filter((d, index, nodes) => {
        return select(nodes[index]).selectAll('li').size() === 0;
      })
      .remove();
  }

  _removeHiddenElements(node) {
    node
      .selectAll('.hidden')
      .remove();
  }
}
