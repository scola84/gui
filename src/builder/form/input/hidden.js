export default class HiddenInput {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'hidden')
      .attr('value', data[field.name]);
  }
}
