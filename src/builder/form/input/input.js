export default class Input {
  _value(field, data) {
    return typeof data[field.name] === 'undefined' ?
      field.value : data[field.name];
  }
}
