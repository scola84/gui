import Node from './node';

export default class Input extends Node {
  validate(box, data) {
    this._validate(box, data);
  }

  _validate() {}
}
