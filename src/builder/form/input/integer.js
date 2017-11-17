export default class IntegerInput {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'number')
      .attr('value', data[field.name]);
  }
}
