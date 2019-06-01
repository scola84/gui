import Node from './node';

export default class Input extends Node {
  validate(box, data, error) {
    this._validate(box, data, error);
  }

  _validate() {}
}
