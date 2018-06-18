export default class SelectInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const select = wrap
      .append('select');

    for (let i = 0; i < datum.values.length; i += 1) {
      select
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

    return select;
  }
}
