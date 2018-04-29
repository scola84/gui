/* eslint prefer-reflect: 0 */

import {
  select,
  axisLeft,
  axisBottom
} from 'd3';

import Builder from './builder';
import renderGraph from '../helper/render/graph';

export default class GraphBuilder extends Builder {
  constructor(options = {}) {
    super(options);

    this._ratio = null;
    this.setRatio(options.ratio);
  }

  setRatio(value = 0.5) {
    this._ratio = value;
    return this;
  }

  setRender(value = renderGraph) {
    return super.setRender(value);
  }

  act(route, data, callback) {
    if (this._prepare) {
      this._prepareGraph(route, data);
    }

    if (this._finish) {
      this._finishGraph(route, data);
    }

    this.pass(route, data, callback);
  }

  _clearAxis(route) {
    if (route.graph.root) {
      route.graph.root
        .selectAll('.axis')
        .remove();

      route.graph.axis = {
        bottom: {},
        left: {},
        right: {},
        top: {}
      };
    }
  }

  _clearPlot(route) {
    if (route.graph.root) {
      route.graph.root
        .selectAll('.plot')
        .remove();
    }
  }

  _equalizeSize(route, changed = true) {
    const width = this._getComputedStyle(route.graph.svg, 'width');
    const oldHeight = this._getComputedStyle(route.graph.svg, 'height');
    const height = width * this._ratio;

    const set =
      changed === true &&
      oldHeight !== height;

    if (set === true) {
      route.graph.svg
        .style('height', height + 'px')
        .style('position', null);
    }

    route.graph.margin = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };

    route.graph.size = {
      height,
      width
    };
  }

  _finishAxis(route, values, keys, structure) {
    if (structure.axis.left) {
      this._prepareAxisLeft(route, values, keys,
        structure.axis.left);
    }

    if (structure.axis.bottom) {
      this._prepareAxisBottom(route, values, keys,
        structure.axis.bottom);
    }

    if (route.graph.axis.left) {
      this._finishAxisLeft(route, structure.axis.left);
    }

    if (route.graph.axis.bottom) {
      this._finishAxisBottom(route, structure.axis.bottom);
    }
  }

  _finishAxisBottom(route, structure) {
    if (!route.graph.axis.bottom.node) {
      route.graph.axis.bottom.node = route.graph.root
        .append('g')
        .classed('axis bottom', true);
    }

    const axis = route.graph.axis.bottom.axis;
    const node = route.graph.axis.bottom.node;

    if (structure.grid) {
      axis.tickSizeInner(-route.graph.size.height);
    }

    axis
      .scale()
      .range([0, route.graph.size.width]);

    node
      .transition()
      .call(axis);

    this._styleAxisHorizontal(route, axis, node);
    this._styleAxisBottom(route, axis, node);
  }

  _finishAxisLeft(route, structure) {
    if (!route.graph.axis.left.node) {
      route.graph.axis.left.node = route.graph.root
        .append('g')
        .classed('axis left', true);
    }

    const axis = route.graph.axis.left.axis;
    const node = route.graph.axis.left.node;

    if (structure.grid) {
      axis.tickSizeInner(-route.graph.size.width);
    }

    axis
      .scale()
      .range([route.graph.size.height, 0]);

    node
      .transition()
      .call(axis);

    this._styleAxisVertical(route, axis, node);
    this._styleAxisLeft(route, axis, node);
  }

  _finishGraph(route, data = {}) {
    const [
      values = [],
      keys = null
    ] = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, values, keys) : this._structure;

    if (typeof route.graph.svg === 'undefined') {
      this._finishNodes(route, values, keys, structure);
    }

    if (route.graph.structure !== structure) {
      this._clearAxis(route);
    }

    route.graph.structure = structure;

    this._equalizeSize(route);
    this._finishAxis(route, values, keys, structure);
    this._clearPlot(route);
    this._setPosition(route, route.graph.margin);
    this._render(route, values, keys, structure);
  }

  _finishNodes(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.graph')
      .size() - 1;

    const graph = panel
      .select('#' + this._createTarget('graph', number));

    const block = graph
      .append('div')
      .classed('body', true);

    const inner = block
      .append('div')
      .classed('inner', true);

    route.graph.svg = inner
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    route.graph.root = route.graph.svg
      .append('g');
  }

  _getAxisSize(route, axis, attr) {
    const scale = axis.scale();

    const format =
      axis.tickFormat() ||
      scale.tickFormat &&
      scale.tickFormat();

    let longest = '0';

    if (typeof scale.ticks === 'function') {
      longest = scale
        .ticks(...axis.tickArguments())
        .map(format)
        .reduce((max, tick) => {
          return String(tick).length > max.length ?
            String(tick) :
            max;
        }, '');
    }

    const node = route.graph.svg
      .append('text')
      .style('font-size', '0.9em')
      .text(longest);

    let size = axis.tickPadding();

    try {
      size += node
        .node()
        .getBBox()[attr];
    } catch (e) {
      size = 0;
    }

    node.remove();
    return size;
  }

  _getComputedStyle(node, name) {
    const value = window
      .getComputedStyle(node.node(), null)
      .getPropertyValue(name);

    return parseFloat(value);
  }

  _prepareAxisBottom(route, values, keys, structure) {
    if (!route.graph.axis.bottom.axis) {
      route.graph.axis.bottom.axis = axisBottom()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(route, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = route.graph.axis.bottom.axis;
    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.margin.bottom += this._getAxisSize(route, axis, 'height');
    route.graph.size.height -= route.graph.margin.bottom;
  }

  _prepareAxisLeft(route, values, keys, structure) {
    if (!route.graph.axis.left.axis) {
      route.graph.axis.left.axis = axisLeft()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(route, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = route.graph.axis.left.axis;
    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.margin.left += this._getAxisSize(route, axis, 'width');
    route.graph.size.width -= route.graph.margin.left;
  }

  _prepareGraph(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.graph')
      .size();

    panel
      .select('.body .content')
      .append('div')
      .attr('id', this._createTarget('graph', number))
      .classed('graph', true);
  }

  _setPosition(route, position) {
    route.graph.root
      .attr('transform', `translate(${position.left},${position.top})`);
  }

  _styleAxisBottom(route, axis, node) {
    node.attr('transform', `translate(0,${route.graph.size.height})`);
  }

  _styleAxisHorizontal(route, axis, node) {
    const ticks = node
      .selectAll('.tick');

    ticks
      .filter((datum, index) => {
        return (index % Math.ceil(ticks.size() /
          (route.graph.size.width / 100))) !== 0;
      })
      .remove();
  }

  _styleAxisLeft(route, axis, node) {
    const width = this._getAxisSize(route, axis, 'width');

    node
      .selectAll('line')
      .attr('x1', -width);

    node
      .selectAll('text')
      .attr('text-anchor', 'start')
      .attr('dx', -width + 16);
  }

  _styleAxisRight(route, axis, node) {
    const width = this._getAxisSize(route, axis, 'width');

    node
      .attr('transform', `translate(${route.graph.size.width},0)`);

    node
      .selectAll('line')
      .attr('x1', width);

    node
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('dx', width - 16);
  }

  _styleAxisVertical(route, axis, node) {
    node
      .selectAll('text')
      .attr('dy', (datum, index) => {
        return index === 0 ? '-0.35em' : '1.15em';
      });
  }
}
