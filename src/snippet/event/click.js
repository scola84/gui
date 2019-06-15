import Event from '../event';

export default class Click extends Event {
  setName(value = 'click') {
    return super.setName(value);
  }

  handle(box, data, snippet) {
    if (snippet.node().classed('click') === true) {
      this.pass(box, data);
    }
  }
}
