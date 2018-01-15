export default class RadioInput {
  render(datum, index, node, format) {
    const input = node
      .append('input')
      .attr('type', 'radio')
      .attr('value', format('value'))
      .property('checked', format('checked'));

    node
      .append('label');

    node.on('click', () => {
      input.property('checked', 'checked');
    });

    return input;
  }
}
