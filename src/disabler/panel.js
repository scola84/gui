import { select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class PanelDisabler extends GraphicWorker {
  constructor(options = {}) {
    super(options);

    this._disable = [];
    this._hide = [];
    this._id = null;

    this.setId(options.id);
  }

  setId(value = null) {
    this._id = value;
    return this;
  }

  act(route, data, callback) {
    const node = select(route.node);

    this._disableElements(route, data, node);
    this._hideElements(route, data, node);
    this._removeHiddenElements(node);

    this.pass(route, data, callback);
  }

  disable(value) {
    value.filter = Array.isArray(value.filter) ?
      value.filter : [value.filter];

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
    value.filter = Array.isArray(value.filter) ?
      value.filter : [value.filter];

    this._hide.push(value);
    return this;
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
    this._hide.forEach(({ filter, selector }) => {
      filter.forEach((name) => {
        const visible = typeof name === 'function' ?
          name(route, data, node) :
          this.filter(route, data, name);

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
