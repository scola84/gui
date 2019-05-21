import Snippet from './snippet';

export default class Obj extends Snippet {
  render(box, data, callback) {
    callback(null, ...this._list.map((item) => {
      return this._resolve(item, box, data);
    }));
  }
}
