export default class SubmitInput {
  create(item, field, data) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'submit')
      .attr('value', data[field.name]);
  }
}
