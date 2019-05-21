import Node from './node';

export default class Panel extends Node {
  constructor(options = {}) {
    options.name = 'div';
    options.classed = { 'panel deluxe': true };

    super(options);
  }

  render(box, data) {
    box.base.select('.panel').remove();
    return super.render(box, data);
  }
}
