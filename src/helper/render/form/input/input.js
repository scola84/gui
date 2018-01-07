export default class Input {
  _value(datum, data) {
    return typeof data[datum.name] === 'undefined' ?
      datum.value : data[datum.name];
  }
}
