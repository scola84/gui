import Event from '../event';

export default class Submit extends Event {
  resolve(box, data) {
    return this.bind(box, data, 'submit', (snippet) => {
      this.submit(box, data, snippet);
    });
  }

  removeBefore() {
    this.unbind('submit');
    this.removeOuter();
  }

  submit(box, data, snippet) {
    if (snippet.isLocked() === true) {
      return;
    }

    snippet.lock();

    data = {};

    const formData = new FormData(snippet.node().node());
    const keys = Array.from(formData.keys());

    let key = null;
    let value = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      value = formData.getAll(key);
      data[key] = value.length === 1 ? value[0] : value;
    }

    this.pass(box, data);
  }
}
