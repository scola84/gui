import bar from './graph/bar';
import line from './graph/line';
import scatter from './graph/scatter';

const render = {
  bar,
  line,
  scatter
};

export default function renderGraph(graph, values, keys, structure, format) {
  let plot = null;

  for (let i = 0; i < structure.plot.length; i += 1) {
    plot = structure.plot[i];
    render[plot.type](graph, values, keys, structure, plot, format);
  }
}
