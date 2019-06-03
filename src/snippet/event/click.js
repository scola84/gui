import Event from '../event';

export default class Click extends Event {
  resolve(box, data) {
    return this._bind(box, data, 'click', (snippet) => {
      if (snippet.node().classed('click') === true) {
        this.pass(box, data);
      }
    });
  }

  remove() {
    this._unbind('click');
    super.remove();
  }
}
