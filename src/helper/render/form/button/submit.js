export default class SubmitButton {
  render(datum, index, node) {
    node
      .select('.input')
      .append('button')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button ion-ios-arrow-thin-right', true);
  }
}
