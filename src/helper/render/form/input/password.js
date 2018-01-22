export default class PasswordInput {
  render(datum, index, node, format) {
    return node
      .select('.input')
      .append('input')
      .attr('placeholder', format('placeholder'))
      .attr('type', 'password');
  }
}
