import { event, select } from 'd3';
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

  removeBefore() {
    this._node.on('click.scola-button', null);
    this.removeOuter();
  }

  resolveAfter(box, data) {
    const form = this._node.attr('form');

    if (typeof form !== 'undefined') {
      return this.resolveForm(box, data, form);
    }

    return this._node;
  }

  resolveForm(box, data, form) {
    this._node.on('click.scola-button', () => {
      event.preventDefault();
      select('#' + form).dispatch('submit');
    });

    return this._node;
  }
}
