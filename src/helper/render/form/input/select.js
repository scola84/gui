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

    let selected = null;
    let text = null;
    let value = null;

    if (datum.values.length === 0) {
      input
        .append('option')
        .text(format({
          name: 'text',
          value: 'empty'
        }));
    }

    for (let i = 0; i < datum.values.length; i += 1) {
      value = datum.values[i];

      text = datum.labels ? datum.labels[i] : format({
        name: 'text',
        value
      });

      selected = value === datum.selected || format({
        name: 'selected',
        value
      }) ? 'selected' : null;

      input
        .append('option')
        .attr('value', value)
        .attr('selected', selected)
        .text(text);
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
