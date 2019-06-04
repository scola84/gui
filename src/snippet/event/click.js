import Event from '../event';

export default class Click extends Event {
  resolve(box, data) {
    return this.bind(box, data, 'click', (snippet) => {
      if (snippet.node().classed('click') === true) {
        this.pass(box, data);
      }
    });
  }

  removeBefore() {
    this.unbind('click');
    this.removeOuter();
  }
}
