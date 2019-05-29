import Node from './node';

export default class Input extends Node {
  validate(box, data, result) {
    this._validate(box, data, result);
    return result;
  }

  _validate() {}
}
