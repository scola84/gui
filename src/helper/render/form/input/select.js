import { select } from 'd3';

export default class SelectInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const input = wrap
      .append('select')
      .on('change', () => {
        if (datum.link) {
          this._toggle(input);
        }
      });

    for (let i = 0; i < datum.values.length; i += 1) {
      input
        .append('option')
        .attr('value', datum.values[i])
        .attr('selected', () => {
          return datum.values[i] === datum.selected || format({
            name: 'selected',
            value: datum.values[i]
          }) ? 'selected' : null;
        })
        .text(format({
          name: 'text',
          value: datum.values[i]
        }));
    }

    wrap
      .append('span');

    if (datum.link) {
      this._toggle(input);
    }

    return input;
  }

  _toggle(input) {
    const value = input.property('value');

    select(input.node().closest('form'))
      .selectAll('.block')
      .each((datum, index, nodes) => {
        if (datum.name) {
          select(nodes[index])
            .style('display', datum.name !== value ? 'none' : 'initial');
        }
      });
  }
}
