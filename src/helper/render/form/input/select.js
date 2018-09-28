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
          this._toggle(datum, input);
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
        .datum(text)
        .attr('value', value)
        .attr('selected', selected)
        .text(text);
    }

    wrap
      .append('span');

    if (datum.link) {
      this._toggle(datum, input);
    }

    if (datum.sort) {
      input
        .selectAll('option')
        .sort((a, b) => a > b);
    }

    selected = input
      .select('option[selected]');

    if (selected.size() === 0) {
      input
        .select('option')
        .attr('selected', 'selected');
    }

    return input;
  }

  _toggle(datum, input) {
    const link = Array.isArray(datum.link) ?
      datum.link : [input.attr('name')];

    let value = [];

    select(input.node().closest('form'))
      .selectAll(link.map((name) => `[name=${name}]`).join(','))
      .each((d, i, n) => {
        value[value.length] = select(n[i]).property('value');
      });

    value = value.join('_');

    select(input.node().closest('form'))
      .selectAll('.block')
      .each((d, i, n) => {
        if (d.name) {
          const elements = select(n[i])
            .style('display', d.name === value ? null : 'none')
            .selectAll('input, select, textarea')
            .attr('disabled', d.name === value ? null : 'disabled');

          setTimeout(() => {
            elements.dispatch('input');
          });
        }
      });
  }
}
