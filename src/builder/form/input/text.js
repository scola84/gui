export default class TextInput {
  create(item, field, data, format) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('placeholder', (d, i, n) => format(d, i, n, 'placeholder'))
      .attr('tabindex', 0)
      .attr('type', 'text')
      .attr('value', data[field.name]);
  }
}
