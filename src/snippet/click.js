import Action from './action';

export default class Click extends Action {
  render(box, data) {
    return this._list.map((item) => {
      return this._resolve(item, box, data).on('click', () => {
        this.handle(box, data);
      });
    });
  }

  remove() {
    this._list.forEach((item) => {
      if (typeof item.node === 'function') {
        item.node().on('click', null);
      }
    });
  }
}
