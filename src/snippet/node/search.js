import Node from '../node';

export default class Search extends Node {
  constructor(options) {
    super(options);
    this.setName('form');
  }

  resolveAfter(box, data) {
    const placeholder = this._builder
      .format('search')
      .resolve(box, data);

    this._node
      .append('div')
      .classed('ion-ios-search', true)
      .append('input')
      .attr('autocomplete', 'on')
      .attr('name', 'search')
      .attr('placeholder', placeholder)
      .attr('type', 'search');

    return this._node;
  }
}
