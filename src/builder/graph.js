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

  err(route, error, callback) {
    const structure = typeof this._structure === 'function' ?
      this._structure(route) : this._structure;

    const graph = route.graph && structure ?
      route.graph[structure.name] : null;

    if (graph) {
      this._renderMessage(graph);
    }

    this.fail(route, error, callback);
  }

  _clearAxis(graph) {
    if (graph.root) {
      graph.root
        .selectAll('.axis')
        .remove();

      graph.axis = {
        bottom: {},
        left: {},
        right: {},
        top: {}
      };
    }
  }

  _clearMessage(graph) {
    graph.node
      .select('.message')
      .remove();
  }

  _clearPlot(graph) {
    if (graph.root) {
      graph.root
        .selectAll('.plot')
        .dispatch('remove');
    }
  }

  _clearZoom(graph) {
    graph.svg
      .on('.zoom', null);
  }

  _finishAxisBottom(graph, structure) {
    if (!graph.axis.bottom.node) {
      graph.axis.bottom.node = graph.root
        .append('g')
        .classed('axis bottom', true);
    }

    const axis = graph.axis.bottom.axis;
    const node = graph.axis.bottom.node;

    if (structure.grid) {
      axis.tickSizeInner(-graph.size.height);
    }

    axis
      .scale()
      .range([0, graph.size.width]);

    node
      .transition()
      .call(axis);

    this._styleAxisHorizontal(graph, axis, node);
    this._styleAxisBottom(graph, axis, node);
  }

  _finishAxisLeft(graph, structure) {
    if (!graph.axis.left.node) {
      graph.axis.left.node = graph.root
        .append('g')
        .classed('axis left', true);
    }

    const axis = graph.axis.left.axis;
    const node = graph.axis.left.node;

    if (structure.grid) {
      axis.tickSizeInner(-graph.size.width);
    }

    axis
      .scale()
      .range([graph.size.height, 0]);

    node
      .transition()
      .call(axis);

    this._styleAxisVertical(graph, axis, node);
    this._styleAxisLeft(graph, axis, node);
  }

  _finishAxisRight(graph, structure) {
    if (!graph.axis.right.node) {
      graph.axis.right.node = graph.root
        .append('g')
        .classed('axis right', true);
    }

    const axis = graph.axis.right.axis;
    const node = graph.axis.right.node;

    if (structure.grid) {
      axis.tickSizeInner(-graph.size.width);
    }

    axis
      .scale()
      .range([graph.size.height, 0]);

    node
      .transition()
      .call(axis);

    this._styleAxisVertical(graph, axis, node);
    this._styleAxisRight(graph, axis, node);
  }

  _finishAxisTop(graph, structure) {
    if (!graph.axis.top.node) {
      graph.axis.top.node = graph.root
        .append('g')
        .classed('axis top', true);
    }

    const axis = graph.axis.top.axis;
    const node = graph.axis.top.node;

    if (structure.grid) {
      axis.tickSizeInner(-graph.size.height);
    }

    axis
      .scale()
      .range([0, graph.size.width]);

    node
      .transition()
      .call(axis);

    this._styleAxisHorizontal(graph, axis, node);
  }

  _finishGraph(route, data) {
    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) : this._structure;

    const [
      values = [],
      keys = null
    ] = this.filter(route, data, structure);

    const graph = route.graph[structure.name];

    graph.route = route;
    graph.structure = structure;

    this._resize(route, structure, data);
    this._clearMessage(graph);
    this._clearPlot(graph);
    this._clearZoom(graph);

    if (data.length === 0) {
      this._clearAxis(graph);
      this._renderMessage(graph);
      return;
    }

    this._renderAxis(graph, values, keys, structure);
    this._setPosition(graph, graph.margin);

    if (structure.zoom) {
      this._prepareZoom(graph, values, keys, structure, this._format);
    }

    this._render(graph, values, keys, structure, this._format);
  }

  _getAxisSize(graph, axis, attr) {
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

    const node = graph.svg
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

  _handleZoom(graph, values, keys, structure) {
    if (structure.axis.bottom) {
      if (structure.axis.bottom.zoom === true) {
        this._handleZoomBottom(graph);
      }
    }

    if (structure.axis.left) {
      if (structure.axis.left.zoom === true) {
        this._handleZoomLeft(graph);
      }
    }

    if (structure.axis.right) {
      if (structure.axis.right.zoom === true) {
        this._handleZoomRight(graph);
      }
    }

    if (structure.axis.top) {
      if (structure.axis.top.zoom === true) {
        this._handleZoomTop(graph);
      }
    }

    this._clearPlot(graph);
    this._render(graph, values, keys, structure, this._format);
  }

  _handleZoomBottom(graph) {
    const axis = graph.axis.bottom.axis;
    const node = graph.axis.bottom.node;
    const scale = graph.axis.bottom.scale;

    if (scale.bandwidth) {
      scale.range([
        event.transform.applyX(0),
        event.transform.applyX(graph.size.width)
      ]);
    } else {
      axis.scale(event.transform.rescaleX(scale));
    }

    node.call(axis);

    this._styleAxisHorizontal(graph, axis, node);
    this._styleAxisBottom(graph, axis, node);
  }

  _handleZoomLeft(graph) {
    const axis = graph.axis.left.axis;
    const node = graph.axis.left.node;

    const scale = event.transform
      .rescaleY(graph.axis.left.scale);

    axis.scale(scale);
    node.call(axis);

    this._styleAxisVertical(graph, axis, node);
    this._styleAxisLeft(graph, axis, node);
  }

  _handleZoomRight(graph) {
    const axis = graph.axis.right.axis;
    const node = graph.axis.right.node;

    const scale = event.transform
      .rescaleY(graph.axis.right.scale);

    axis.scale(scale);
    node.call(axis);

    this._styleAxisVertical(graph, axis, node);
    this._styleAxisRight(graph, axis, node);
  }

  _handleZoomTop(graph) {
    const axis = graph.axis.top.axis;
    const node = graph.axis.top.node;
    const scale = graph.axis.top.scale;

    if (scale.bandwidth) {
      scale.range([
        event.transform.applyX(0),
        event.transform.applyX(graph.size.width)
      ]);
    } else {
      axis.scale(event.transform.rescaleX(scale));
    }

    node.call(axis);

    this._styleAxisHorizontal(graph, axis, node);
  }

  _prepareAxisBottom(graph, values, keys, structure) {
    if (!graph.axis.bottom.axis) {
      graph.axis.bottom.axis = axisBottom()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(graph, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = graph.axis.bottom.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    graph.axis.bottom.scale = scale;
    graph.margin.bottom += this._getAxisSize(graph, axis, 'height');
  }

  _prepareAxisLeft(graph, values, keys, structure) {
    if (!graph.axis.left.axis) {
      graph.axis.left.axis = axisLeft()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(graph, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = graph.axis.left.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    graph.axis.left.scale = scale;
    graph.margin.left += this._getAxisSize(graph, axis, 'width');
  }

  _prepareAxisRight(graph, values, keys, structure) {
    if (!graph.axis.right.axis) {
      graph.axis.right.axis = axisRight()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(graph, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = graph.axis.right.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    graph.axis.right.scale = scale;
    graph.margin.right += this._getAxisSize(graph, axis, 'width');
  }

  _prepareAxisTop(graph, values, keys, structure) {
    if (!graph.axis.top.axis) {
      graph.axis.top.axis = axisTop()
        .tickFormat((datum, index, ticks) => {
          return structure.tick(graph, datum, index, ticks);
        })
        .tickPadding(10)
        .tickSize(0);
    }

    const axis = graph.axis.top.axis;

    const scale = structure
      .scale()
      .domain(structure.domain(values, keys, axis));

    axis.scale(scale);

    graph.axis.top.scale = scale;
    graph.margin.top += this._getAxisSize(graph, axis, 'height');
  }

  _prepareGraph(route) {
    const structure = typeof this._structure === 'function' ?
      this._structure(route) : this._structure;

    let graph = route.graph && route.graph[structure.name];

    if (typeof graph !== 'undefined') {
      return;
    }

    const panel = select(route.node);

    const number = panel
      .selectAll('div.graph')
      .size();

    const node = panel
      .select('.body .content ' + this._wrap)
      .append('div')
      .attr('id', this._createTarget('graph', number))
      .classed('graph', true)
      .append('div')
      .classed('block', true);

    graph = { node };

    route.graph = route.graph || {};
    route.graph[structure.name] = graph;

    graph.node
      .append('div')
      .classed('title', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { name: 'title', route });
      });

    const body = graph.node
      .append('div')
      .classed('body', true);

    const wrapper = body
      .append('div')
      .classed('wrapper', true);

    const inner = wrapper
      .append('div')
      .classed('inner', true);

    graph.svg = inner
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    graph.root = graph.svg
      .append('g');

    this._resize(route, structure);
  }

  _prepareZoom(graph, values, keys, structure) {
    const height = graph.size.height;
    const width = graph.size.width;

    graph.zoom = zoom()
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
        if (event.transform.k === 1 && graph.zoomed === false) {
          return;
        }

        if (event.transform.k !== 1) {
          graph.zoomed = true;
        }

        this._handleZoom(graph, values, keys, structure);

        if (event.transform.k === 1) {
          graph.zoomed = false;
        }
      });

    graph.svg
      .call(graph.zoom)
      .on('wheel', () => {
        event.preventDefault();
      });
  }

  _renderAxis(graph, values, keys, structure) {
    if (structure.axis.bottom) {
      this._prepareAxisBottom(graph, values, keys, structure.axis.bottom);
    }

    if (structure.axis.left) {
      this._prepareAxisLeft(graph, values, keys, structure.axis.left);
    }

    if (structure.axis.right) {
      this._prepareAxisRight(graph, values, keys, structure.axis.right);
    }

    if (structure.axis.top) {
      this._prepareAxisTop(graph, values, keys, structure.axis.top);
    }

    graph.size.height -= graph.margin.bottom;
    graph.size.height -= graph.margin.top;
    graph.size.width -= graph.margin.left;
    graph.size.width -= graph.margin.right;

    if (graph.axis.bottom.axis) {
      this._finishAxisBottom(graph, structure.axis.bottom);
    }

    if (graph.axis.left.axis) {
      this._finishAxisLeft(graph, structure.axis.left);
    }

    if (graph.axis.right.axis) {
      this._finishAxisRight(graph, structure.axis.right);
    }

    if (graph.axis.top.axis) {
      this._finishAxisTop(graph, structure.axis.top);
    }
  }

  _renderMessage(graph) {
    graph.node
      .select('.body .inner')
      .selectAll('.message')
      .data([0])
      .enter()
      .append('div')
      .classed('message', true)
      .text((d, i, n) => {
        return this.format(d, i, n, 'empty');
      });
  }

  _renderNodes(route, structure) {

  }

  _resize(route, structure, data) {
    const graph = route.graph[structure.name];

    this._resizeGraph(route, structure);

    graph.size = graph.maximize === true ?
      this._resizeMax(route, structure) :
      this._resizeEqual(route, structure);

    graph.margin = {
      bottom: 16,
      left: 16,
      right: 16,
      top: 16
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

  _resizeEqual(route, structure) {
    const graph = route.graph[structure.name];
    const width = this._getComputedStyle(graph.svg, 'width');
    const height = width * this._ratio;

    graph.svg
      .style('height', height + 'px')
      .style('position', null);

    return {
      height,
      width
    };
  }

  _resizeGraph(route, structure) {
    const graph = route.graph[structure.name];

    select(route.node)
      .classed('maximized', graph.maximize === true);

    graph.node
      .classed('maximized', graph.maximize === true);

    const transform = graph.node.style('transform');
    const height = select('body').style('height');
    const width = select('body').style('width');

    if (transform === 'none') {
      graph.node
        .style('height', null)
        .style('margin-top', null)
        .style('width', null);
    } else {
      graph.node
        .style('height', width)
        .style('margin-top', height)
        .style('width', height);
    }
  }

  _resizeMax(route, structure) {
    const graph = route.graph[structure.name];

    graph.svg.style('height', null);

    const rect = graph.node
      .select('.body')
      .node()
      .getBoundingClientRect();

    const transform = graph.node.style('transform');
    const height = rect.height;
    const width = rect.width;

    graph.svg.style('height', height + 'px');

    return transform === 'none' ? {
      height,
      width
    } : {
      height: width,
      width: height
    };
  }

  _setPosition(graph, position) {
    graph.root
      .attr('transform', `translate(${position.left},${position.top})`);
  }

  _styleAxisBottom(graph, axis, node) {
    node.attr('transform', `translate(0,${graph.size.height})`);
  }

  _styleAxisHorizontal(graph, axis, node) {
    const ticks = node
      .selectAll('.tick');

    ticks
      .filter((datum, index) => {
        return (index % Math.ceil(ticks.size() /
          (graph.size.width / 100))) !== 0;
      })
      .remove();
  }

  _styleAxisLeft(graph, axis, node) {
    const width = this._getAxisSize(graph, axis, 'width');

    node
      .selectAll('line')
      .attr('x1', -width);

    node
      .selectAll('text')
      .attr('text-anchor', 'start')
      .attr('dx', -width + 16);
  }

  _styleAxisRight(graph, axis, node) {
    const width = this._getAxisSize(graph, axis, 'width');

    node
      .attr('transform', `translate(${graph.size.width},0)`);

    node
      .selectAll('line')
      .attr('x1', width);

    node
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('dx', width - 16);
  }

  _styleAxisVertical(graph, axis, node) {
    node
      .selectAll('text')
      .attr('dy', (datum, index) => {
        return index === 0 ? '-0.35em' : '1.15em';
      });
  }
}
