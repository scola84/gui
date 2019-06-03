import Node from '../node';

export default class Button extends Node {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        type: 'button'
      })
      .setName('button');
  }

  click() {
    return this.setClassed({
      click: true
    });
  }

  icon(value) {
    return this.setClassed({
      icon: true,
      [value]: true
    });
  }
}
