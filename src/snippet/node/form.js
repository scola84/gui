import Node from '../node';

export default class Form extends Node {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        novalidate: 'novalidate'
      })
      .setName('form');
  }
}
