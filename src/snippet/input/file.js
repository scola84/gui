import Input from '../input';

export default class File extends Input {
  constructor(options = {}) {
    super(options);

    this
      .setAttributes({
        type: 'file'
      })
      .setName('input');
  }

  isAcceptable(value, accept) {
    if (typeof accept === 'undefined') {
      return true;
    }

    const list = accept.split(',');
    const [fileType, fileSubType] = value.type.split('/');

    let type = null;
    let subtype = null;

    for (let i = 0; i < list.length; i += 1) {
      [type, subtype] = list[i].split('/');

      if (type !== '*' && fileType !== type) {
        return false;
      }

      if (subtype !== '*' && fileSubType !== subtype) {
        return false;
      }
    }

    return true;
  }

  validateBefore(box, data, error, name, value) {
    this.validateAccept(box, data, error, name, value);
    this.validateMaxsize(box, data, error, name, value);
  }

  validateAccept(box, data, error, name, value) {
    const accept = this.resolveAttribute(box, data, 'accept');

    if (this.isAcceptable(value, accept) === false) {
      this.throwError(value, 'accept', { accept });
    }
  }

  validateMaxsize(box, data, error, name, value) {
    const maxsize = this.resolveAttribute(box, data, 'maxsize');

    if (this.isBelowMax(value.size, maxsize) === false) {
      this.throwError(value, 'maxsize', { maxsize });
    }
  }
}
