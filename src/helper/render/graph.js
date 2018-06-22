import { select } from 'd3';

import bar from './graph/bar';
import line from './graph/line';
import scatter from './graph/scatter';
import tip from './graph/tip';

const render = {
  bar,
  line,
  scatter,
  tip
};

export default function renderGraph(graph, values, keys, structure, format) {
  let plot = null;

  for (let i = 0; i < structure.plot.length; i += 1) {
    plot = structure.plot[i];
    render[plot.type](graph, values, keys, structure, plot, format);
  }

  select('body').on('click.scola-gui-graph', () => {
    render.tip(null, null);
  });
}
