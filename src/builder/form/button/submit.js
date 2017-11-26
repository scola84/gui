export default class SubmitButton {
  create(item) {
    item
      .append('button')
      .attr('tabindex', 0)
      .attr('type', 'submit')
      .classed('button ion-ios-arrow-thin-right', true);
  }
}
