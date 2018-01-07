export default class SubmitButton {
  create(datum, index, node) {
    node
      .append('button')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button ion-ios-arrow-thin-right', true);
  }
}
