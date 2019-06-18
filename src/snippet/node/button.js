import { Node } from '../node';

export class Button extends Node {
  constructor(options) {
    super(options);

    this
      .name('button')
      .attributes({
        type: 'button'
      });
  }
}
