export default class SelectInput {
  render(datum, index, node, format) {
    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    const select = wrap
      .append('select');

    for (let i = 0; i < datum.value.length; i += 1) {
      select
        .append('option')
        .attr('value', datum.value[i])
        .attr('selected', () => {
          return format({
            name: 'selected',
            value: datum.value[i]
          }) ? 'selected' : null;
        })
        .text(format({
          name: 'text',
          value: datum.value[i]
        }));
    }

    return select;
  }
}
