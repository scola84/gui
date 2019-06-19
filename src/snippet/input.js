import set from 'lodash-es/set';
import { Node } from './node';

export class Input extends Node {
  constructor(options = {}) {
    super(options);

    this._default = null;
    this.setDefault(options.default);

    this.name('input');
  }

  getOptions() {
    return Object.assign(super.getOptions(), {
      default: this._default
    });
  }

  getDefault() {
    return this._default;
  }

  setDefault(value = null) {
    this._default = value;
    return this;
  }

  default (value) {
    return this.setDefault(value);
  }

  clean(box, data) {
    const name = this.resolveAttribute(box, data, 'name');
    const value = data[name];

    if (Array.isArray(value) === false) {
      this.cleanBefore(box, data, name, value);
      return;
    }

    for (let i = 0; i < value.length; i += 1) {
      this.cleanBefore(box, data, `${name}.${i}`, value[i]);
    }
  }

  cleanAfter() {}

  cleanBefore(box, data, name, value) {
    this.cleanInput(box, data, name, value);
  }

  cleanInput(box, data, name, value) {
    if (this.isEmpty(value) === true) {
      if (this._default !== null) {
        value = this.resolveValue(box, data, this._default);
        this.setValue(data, name, value);
      }
    }

    this.cleanAfter(box, data, name, value);
  }

  isAboveMin(value, min) {
    if (typeof min === 'undefined') {
      return true;
    }

    return value >= min;
  }

  isBelowMax(value, max) {
    if (typeof max === 'undefined') {
      return true;
    }

    return value <= max;
  }

  isDefined(value, required) {
    if (typeof required === 'undefined') {
      return true;
    }

    return this.isEmpty(value) === false;
  }

  isEmpty(value) {
    return typeof value === 'undefined' ||
      value === null ||
      value === '';
  }

  isPattern(value, pattern) {
    if (typeof pattern === 'undefined') {
      return true;
    }

    return new RegExp(pattern).test(String(value));
  }

  setValue(object, key, value) {
    set(object, key, value);
  }

  setError(error, name, value, reason, options = {}) {
    value = Object.assign({}, options, {
      reason,
      type: this.constructor.name.toLowerCase(),
      value
    });

    this.setValue(error, name, value);
  }

  validate(box, data, error) {
    const name = this.resolveAttribute(box, data, 'name');
    const value = data[name];

    if (Array.isArray(value) === false) {
      return this.validateBefore(box, data, error, name, value);
    }

    for (let i = 0; i < value.length; i += 1) {
      this.validateBefore(box, data, error, `${name}.${i}`, value[i]);
    }

    return null;
  }

  validateAfter() {}

  validateBefore(box, data, error, name, value) {
    return this.validateInput(box, data, error, name, value);
  }

  validateInput(box, data, error, name, value) {
    const required = this.resolveAttribute(box, data, 'required');

    if (this.isDefined(value, required) === false) {
      return this.setError(error, name, value, 'required');
    }

    if (this.isEmpty(value) === true) {
      return null;
    }

    const pattern = this.resolveAttribute(box, data, 'pattern');

    if (this.isPattern(value, pattern) === false) {
      return this.setError(error, name, value, 'pattern', { pattern });
    }

    const maxlength = this.resolveAttribute(box, data, 'maxlength');

    if (this.isBelowMax(String(value).length, maxlength) === false) {
      return this.setError(error, name, value, 'maxlength', { maxlength });
    }

    const max = this.resolveAttribute(box, data, 'max');

    if (this.isBelowMax(value, max) === false) {
      return this.setError(error, name, value, 'max', { max });
    }

    const min = this.resolveAttribute(box, data, 'min');

    if (this.isAboveMin(value, min) === false) {
      return this.setError(error, name, value, 'min', { min });
    }

    return this.validateAfter(box, data, error, name, value);
  }
}
