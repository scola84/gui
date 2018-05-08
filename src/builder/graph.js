/* eslint prefer-reflect: 0 */

import {
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
  event,
  select,
  zoom
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

  _clearMessage(route) {
    route.graph.node
      .select('.message')
      .remove();
  }

  _clearPlot(route) {
    if (route.graph.root) {
      route.graph.root
        .selectAll('.plot')
        .dispatch('remove');
    }
  }

  _clearZoom(route) {
    route.graph.svg
      .on('.zoom', null);
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

  _finishAxisRight(route, structure) {
    if (!route.graph.axis.right.node) {
      route.graph.axis.right.node = route.graph.root
        .append('g')
        .classed('axis right', true);
    }

    const axis = route.graph.axis.right.axis;
    const node = route.graph.axis.right.node;

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
    this._styleAxisRight(route, axis, node);
  }

  _finishAxisTop(route, structure) {
    if (!route.graph.axis.top.node) {
      route.graph.axis.top.node = route.graph.root
        .append('g')
        .classed('axis top', true);
    }

    const axis = route.graph.axis.top.axis;
    const node = route.graph.axis.top.node;

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
  }

  _finishGraph(route, data) {
    const [
      values = [],
      keys = null
    ] = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, values, keys) : this._structure;

    if (route.graph.structure !== structure) {
      this._clearAxis(route);
    }

    route.graph.structure = structure;

    this._resize(route, data);
    this._clearMessage(route);
    this._clearPlot(route);
    this._clearZoom(route);

    if (data.length === 0) {
      this._clearAxis(route);
      this._renderMessage(route);
      return;
    }

    this._renderAxis(route, values, keys, structure);
    this._setPosition(route, route.graph.margin);

    if (structure.zoom) {
      this._prepareZoom(route, values, keys, structure, this._format);
    }

    this._render(route, values, keys, structure, this._format);
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

  _handleZoom(route, values, keys, structure) {
    if (structure.axis.bottom) {
      if (structure.axis.bottom.zoom === true) {
        this._handleZoomBottom(route);
      }
    }

    if (structure.axis.left) {
      if (structure.axis.left.zoom === true) {
        this._handleZoomLeft(route);
      }
    }

    if (structure.axis.right) {
      if (structure.axis.right.zoom === true) {
        this._handleZoomRight(route);
      }
    }

    if (structure.axis.top) {
      if (structure.axis.top.zoom === true) {
        this._handleZoomTop(route);
      }
    }

    this._clearPlot(route);
    this._render(route, values, keys, structure, this._format);
  }

  _handleZoomBottom(route) {
    const axis = route.graph.axis.bottom.axis;
    const node = route.graph.axis.bottom.node;
    const scale = route.graph.axis.bottom.scale;

    if (scale.bandwidth) {
      scale.range([
        event.transform.applyX(0),
        event.transform.applyX(route.graph.size.width)
      ]);
    } else {
      axis.scale(event.transform.rescaleX(scale));
    }

    node.call(axis);

    this._styleAxisHorizontal(route, axis, node);
    this._styleAxisBottom(route, axis, node);
  }

  _handleZoomLeft(route) {
    const axis = route.graph.axis.left.axis;
    const node = route.graph.axis.left.node;

    const scale = event.transform
      .rescaleY(route.graph.axis.left.scale);

    axis.scale(scale);
    node.call(axis);

    this._styleAxisVertical(route, axis, node);
    this._styleAxisLeft(route, axis, node);
  }

  _handleZoomRight(route) {
    const axis = route.graph.axis.right.axis;
    const node = route.graph.axis.right.node;

    const scale = event.transform
      .rescaleY(route.graph.axis.right.scale);

    axis.scale(scale);
    node.call(axis);

    this._styleAxisVertical(route, axis, node);
    this._styleAxisRight(route, axis, node);
  }

  _handleZoomTop(route) {
    const axis = route.graph.axis.top.axis;
    const node = route.graph.axis.top.node;
    const scale = route.graph.axis.top.scale;

    if (scale.bandwidth) {
      scale.range([
        event.transform.applyX(0),
        event.transform.applyX(route.graph.size.width)
      ]);
    } else {
      axis.scale(event.transform.rescaleX(scale));
    }

    node.call(axis);

    this._styleAxisHorizontal(route, axis, node);
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

    route.graph.axis.bottom.scale = scale;
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

    route.graph.axis.left.scale = scale;
    route.graph.margin.left += this._getAxisSize(route, axis, 'width');
    route.graph.size.width -= route.graph.margin.left;
  }

  _prepareAxisRight(route, values, keys, structure) {
    if (!route.graph.axis.right.axis) {
      route.graph.axis.right.axis = axisRight()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(route, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = route.graph.axis.right.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.axis.right.scale = scale;
    route.graph.margin.right += this._getAxisSize(route, axis, 'width');
    route.graph.size.width -= route.graph.margin.right;
  }

  _prepareAxisTop(route, values, keys, structure) {
    if (!route.graph.axis.top.axis) {
      route.graph.axis.top.axis = axisTop()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(route, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = route.graph.axis.top.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    route.graph.axis.top.scale = scale;
    route.graph.margin.top += this._getAxisSize(route, axis, 'height');
    route.graph.size.height -= route.graph.margin.top;
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

    route.graph = route.graph || {};

    this._renderNodes(route);
    this._resize(route);
  }

  _prepareZoom(route, values, keys, structure) {
    const height = route.graph.size.height;
    const width = route.graph.size.width;

    route.graph.zoom = zoom()
      .scaleExtent(structure.zoom)
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('zoom', () => {
        if (event.transform.k === 1 && route.graph.zoomed === false) {
          return;
        }

        if (event.transform.k !== 1) {
          route.graph.zoomed = true;
        }

        this._handleZoom(route, values, keys, structure);

        if (event.transform.k === 1) {
          route.graph.zoomed = false;
        }
      });

    route.graph.svg
      .call(route.graph.zoom)
      .on('wheel', () => {
        event.preventDefault();
      });
  }

  _renderAxis(route, values, keys, structure) {
    if (structure.axis.bottom) {
      this._prepareAxisBottom(route, values, keys, structure.axis.bottom);
    }

    if (structure.axis.left) {
      this._prepareAxisLeft(route, values, keys, structure.axis.left);
    }

    if (structure.axis.right) {
      this._prepareAxisRight(route, values, keys, structure.axis.right);
    }

    if (structure.axis.top) {
      this._prepareAxisTop(route, values, keys, structure.axis.top);
    }

    if (route.graph.axis.bottom.axis) {
      this._finishAxisBottom(route, structure.axis.bottom);
    }

    if (route.graph.axis.left.axis) {
      this._finishAxisLeft(route, structure.axis.left);
    }

    if (route.graph.axis.right.axis) {
      this._finishAxisRight(route, structure.axis.right);
    }

    if (route.graph.axis.top.axis) {
      this._finishAxisTop(route, structure.axis.top);
    }
  }

  _renderMessage(route) {
    route.graph.node
      .select('.body .inner')
      .selectAll('.message')
      .data([0])
      .enter()
      .append('div')
      .classed('message', true)
      .text(this.format('empty'));
  }

  _renderNodes(route) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.graph')
      .size() - 1;

    route.graph.node = panel
      .select('#' + this._createTarget('graph', number));

    const body = route.graph.node
      .append('div')
      .classed('body', true);

    const inner = body
      .append('div')
      .classed('inner', true);

    route.graph.svg = inner
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    route.graph.root = route.graph.svg
      .append('g');
  }

  _resize(route, data) {
    this._resizeGraph(route);

    route.graph.size = route.graph.maximize === true ?
      this._resizeMax(route) :
      this._resizeEqual(route);

    route.graph.margin = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };

    if (typeof data === 'undefined') {
      return;
    }

    select(route.node).on('resize.graph', () => {
      const resize =
        typeof route.node.size.graph === 'undefined' ||
        event.detail === true;

      if (resize) {
        route.node.size.graph = true;
        this.act(route, data);
      }
    });
  }

  _resizeGraph(route) {
    route.graph.node
      .classed('maximized', route.graph.maximize === true);

    const transform = route.graph.node.style('transform');
    const height = select('body').style('height');
    const width = select('body').style('width');

    if (transform === 'none') {
      route.graph.node
        .style('height', null)
        .style('margin-top', null)
        .style('width', null);
    } else {
      route.graph.node
        .style('height', width)
        .style('margin-top', height)
        .style('width', height);
    }
  }

  _resizeMax(route) {
    route.graph.svg.style('height', null);

    const rect = route.graph.node
      .select('.body')
      .node()
      .getBoundingClientRect();

    const transform = route.graph.node.style('transform');
    const height = rect.height;
    const width = rect.width;

    route.graph.svg.style('height', height + 'px');

    return transform === 'none' ? {
      height,
      width
    } : {
      height: width,
      width: height
    };
  }

  _resizeEqual(route) {
    const width = this._getComputedStyle(route.graph.svg, 'width');
    const height = width * this._ratio;

    route.graph.svg
      .style('height', height + 'px')
      .style('position', null);

    return {
      height,
      width
    };
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
