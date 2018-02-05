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
    value.permission = Array.isArray(value.permission) ?
      value.permission : [value.permission || (() => false)];

    this._hide.push(value);
    return this;
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
            .classed('disabled permission', true)
            .attr('tabindex', (datum, index, nodes) => {
              return select(nodes[index]).attr('tabindex') === '0' ?
                -1 : null;
            });
        }
      }
    }
  }

  _hideElements(route, data, node) {
    for (let i = 0; i < this._hide.length; i += 1) {
      const { permission, selector } = this._hide[i];

      for (let j = 0; j < permission.length; j += 1) {
        const visible = typeof permission[j] === 'function' ?
          permission[j](route, data, node) :
          this.filter(route, data, permission[j]);

        if (visible === false) {
          node
            .selectAll(selector)
            .classed('hidden permission', true);
        }
      }
    }
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
      .selectAll('.hidden.permission')
      .remove();
  }
}
