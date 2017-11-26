export default class SubmitInput {
  create(item, field) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('type', 'submit');
  }
}
