import Node from '../node';

export default class Button extends Node {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        tabindex: 0,
        type: 'button'
      })
      .setName('button');
  }

  icon(value) {
    return this.setClassed({
      icon: true,
      [value]: true
    });
  }
}
