import Action from '../action';

export default class Obj extends Action {
  resolve(box, data) {
    const values = [];
    let value = null;

    for (let i = 0; i < this._list.length; i += 1) {
      value = this._resolve(box, data, this._list[i]);
      values[values.length] = value;
    }

    this.pass(box, values, true);
  }
}
