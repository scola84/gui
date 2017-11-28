export default class IntegerInput {
  create(item, field, data, format) {
    return item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('tabindex', 0)
      .attr('type', 'number')
      .attr('value', data[field.name]);
  }
}
