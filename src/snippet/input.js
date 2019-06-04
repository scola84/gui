import set from 'lodash-es/set';
import Node from './node';

export default class Input extends Node {
  constructor(options = {}) {
    super(options);

    this._default = null;
    this.setDefault(options.default);
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
      this.cleanValue(box, data, name, value);
      return;
    }

    for (let i = 0; i < value.length; i += 1) {
      this.cleanValue(box, data, `${name}.${i}`, value[i]);
    }
  }

  cleanAfter() {}

  cleanBefore() {}

  cleanInput(box, data, name, value) {
    if (this.isEmpty(value) === true) {
      if (this._default !== null) {
        value = this.resolveValue(box, data, this._default);
        this.set(data, name, value);
      }
    }
  }

  cleanValue(box, data, name, value) {
    this.cleanBefore(box, data, name, value);
    this.cleanInput(box, data, name, value);
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

  set(object, key, value) {
    set(object, key, value);
  }

  throwError(value, reason, options = {}) {
    const error = new Error('Input is invalid');

    error.details = Object.assign(options, {
      reason,
      type: this.constructor.name.toLowerCase(),
      value
    });

    throw error;
  }

  validate(box, data, error) {
    const name = this.resolveAttribute(box, data, 'name');
    const value = data[name];

    if (Array.isArray(value) === false) {
      this.validateValue(box, data, error, name, value);
      return;
    }

    for (let i = 0; i < value.length; i += 1) {
      this.validateValue(box, data, error, `${name}.${i}`, value[i]);
    }
  }

  validateAfter() {}

  validateBefore() {}

  validateInput(box, data, error, name, value) {
    const required = this.resolveAttribute(box, data, 'required');

    if (this.isDefined(value, required) === false) {
      this.throwError(value, 'required');
    }

    const pattern = this.resolveAttribute(box, data, 'pattern');

    if (this.isPattern(value, pattern) === false) {
      this.throwError(value, 'pattern', { pattern });
    }

    const maxlength = this.resolveAttribute(box, data, 'maxlength');

    if (this.isBelowMax(String(value).length, maxlength) === false) {
      this.throwError(value, 'maxlength', { maxlength });
    }

    const max = this.resolveAttribute(box, data, 'max');

    if (this.isBelowMax(value, max) === false) {
      this.throwError(value, 'max', { max });
    }

    const min = this.resolveAttribute(box, data, 'min');

    if (this.isAboveMin(value, min) === false) {
      this.throwError(value, 'min', { min });
    }
  }

  validateValue(box, data, error, name, value) {
    try {
      this.validateBefore(box, data, error, name, value);
      this.validateInput(box, data, error, name, value);
      this.validateAfter(box, data, error, name, value);
    } catch (e) {
      this.set(error, name, e.details);
    }
  }
}
