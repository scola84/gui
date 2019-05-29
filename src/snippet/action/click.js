import Action from '../action';

export default class Click extends Action {
  render(box, data) {
    return this._bind(box, data, 'click', () => {
      this.pass(box, data);
    });
  }

  remove() {
    this._unbind('click');
    super.remove();
  }
}
