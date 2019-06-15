import Node from '../node';

export default class Button extends Node {
  constructor(options) {
    super(options);

    this
      .setAttributes({
        type: 'button'
      })
      .setName('button');
  }
}
