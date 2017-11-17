export default class TextInput {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'text')
      .attr('value', data[field.name]);
  }
}
