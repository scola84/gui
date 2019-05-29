import Node from '../node';

export default class Button extends Node {
  constructor(options = {}) {
    super(options);

    this
      .setClassed({
        search: true
      })
      .setName('form');
  }

  _renderAfter(box, data) {
    const placeholder = this._builder
      .format('search')
      .render(box, data);

    this._node
      .append('div')
      .classed('ion-ios-search-outline', true)
      .append('input')
      .attr('autocomplete', 'on')
      .attr('name', 'search')
      .attr('placeholder', placeholder)
      .attr('type', 'search');
  }
}
