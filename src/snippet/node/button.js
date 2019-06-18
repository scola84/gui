import { Node } from '../node';

export class Button extends Node {
  constructor(options) {
    super(options);

    this
      .attributes({
        type: 'button'
      })
      .name('button');
  }
}
