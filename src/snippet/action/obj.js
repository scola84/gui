import Action from '../action';

export default class Obj extends Action {
  render(box, data, callback) {
    const values = [];

    for (let i = 0; i < this._list.length; i += 1) {
      values[values.length] = this._resolve(this._list[i], box, data);
    }

    callback(null, ...values);
  }
}
