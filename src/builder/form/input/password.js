export default class PasswordInput {
  create(item, field, data, format) {
    item
      .append('input')
      .attr('id', field.name)
      .attr('name', field.name)
      .attr('placeholder', format)
      .attr('tabindex', 0)
      .attr('type', 'password');
  }
}
