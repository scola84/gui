export default class EmailInput {
  create(item, field, data, format) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('tabindex', 0)
      .attr('type', 'email')
      .attr('value', data[field.name]);
  }
}
