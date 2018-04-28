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
      route.graph = this._finishGraph(route, data);
    }

    this.pass(route, data, callback);
  }

  _equalizeSize(route, changed = true) {
    const width = this._getComputedStyle(route.graph.svg, 'width');
    const oldHeight = this._getComputedStyle(route.graph.svg, 'height');
    const newHeight = width * this._ratio;

    const set =
      changed === true &&
      oldHeight !== newHeight;

    if (set === true) {
      route.graph.svg
        .style('height', newHeight + 'px')
        .style('position', null);
    }

    route.graph.size.height = newHeight;
    route.graph.size.width = width;
  }

  _finishAxisBottom(route, axis) {
    if (this._structure.axis.bottom.grid) {
      axis.tickSizeInner(-route.graph.size.height);
    }

    axis
      .scale()
      .range([0, route.graph.size.width]);

    const node = route.graph.g
      .append('g')
      .classed('axis bottom', true)
      .call(axis);

    this._styleAxisHorizontal(route, axis, node);
    this._styleAxisBottom(route, axis, node);
  }

  _finishAxisLeft(route, axis) {
    if (this._structure.axis.left.grid) {
      axis.tickSizeInner(-route.graph.size.width);
    }

    axis
      .scale()
      .range([route.graph.size.height, 0]);

    const node = route.graph.g
      .append('g')
      .classed('axis left', true)
      .call(axis);

    this._styleAxisVertical(route, axis, node);
    this._styleAxisLeft(route, axis, node);
  }

  _finishGraph(route, data = {}) {
    const [
      values = [],
      keys = null
    ] = this.filter(route, data);

    const panel = select(route.node);

    route.graph = {
      margin: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      },
      size: {
        height: 0,
        width: 0
      },
      timezone: 'Europe/Amsterdam'
    };

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

    route.graph.g = route.graph.svg
      .append('g');

    this._equalizeSize(route);

    let left = null;
    let bottom = null;

    if (this._structure.axis.left) {
      left = this._prepareAxisLeft(route, values, keys);
    }

    if (this._structure.axis.bottom) {
      bottom = this._prepareAxisBottom(route, values, keys);
    }

    if (left) {
      this._finishAxisLeft(route, left);
    }

    if (bottom) {
      this._finishAxisBottom(route, bottom);
    }

    route.graph.left = left;
    route.graph.bottom = bottom;

    this._setPosition(route, route.graph.margin);
    this._render(route, values, keys, this._structure);

    return graph;
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

  _prepareAxisBottom(route, values, keys) {
    const axis = axisBottom()
      .tickFormat((date) => {
        return this._structure.axis.bottom.tick(route.level, date,
          route.graph.timezone);
      })
      .tickPadding(10)
      .tickSize(0);

    const scale = this._structure.axis.bottom.scale()
      .domain(this._structure.axis.bottom.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.margin.bottom += this._getAxisSize(route, axis, 'height');
    route.graph.size.height -= route.graph.margin.bottom;

    return axis;
  }

  _prepareAxisLeft(route, values, keys) {
    const axis = axisLeft()
      .tickFormat(this._structure.axis.left.tick)
      .tickPadding(10)
      .tickSize(0);

    const scale = this._structure.axis.left.scale()
      .domain(this._structure.axis.left.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.margin.left += this._getAxisSize(route, axis, 'width');
    route.graph.size.width -= route.graph.margin.left;

    return axis;
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
    route.graph.g
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
