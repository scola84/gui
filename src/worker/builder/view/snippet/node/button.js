import { event, select } from 'd3';
import { Node } from '../node';

export class Button extends Node {
  constructor(options = {}) {
    super(options);

    this._form = null;
    this._menu = null;

    this.setForm(options.form);
    this.setMenu(options.menu);

    this
      .attributes({
        type: 'button'
      })
      .name('button');
  }

  getForm() {
    return this._form;
  }

  setForm(value = false) {
    this._form = value;
    return this;
  }

  getMenu() {
    return this._menu;
  }

  setMenu(value = false) {
    this._menu = value;
    return this;
  }

  form() {
    return this.setForm(true);
  }

  menu() {
    return this.setMenu(true);
  }

  removeBefore() {
    this._node.on('.scola-button', null);
    this.removeOuter();
  }

  resolveAfter(box, data) {
    if (this._form === true) {
      return this.resolveForm(box, data);
    }

    if (this._menu === true) {
      return this.resolveMenu(box);
    }

    return this._node;
  }

  resolveForm() {
    const form = this._node.attr('form');

    this._node.on('click.scola-button', () => {
      event.preventDefault();
      select('#' + form).dispatch('submit', {
        cancelable: true
      });
    });

    return this._node;
  }

  resolveMenu(box) {
    if (box.options.mem === false && box.options.his === false) {
      this._node
        .attr('class', null)
        .classed('button icon show-menu ion-ios-menu', true)
        .text(null);
    }

    return this._node;
  }
}
