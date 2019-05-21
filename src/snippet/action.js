import Snippet from './snippet';

export default class Action extends Snippet {
  then(...list) {
    this._then = list;
    return this;
  }

  handle(box, data) {
    this._then.forEach((item) => {
      this._resolve(item, box, data);
    });
  }
}
