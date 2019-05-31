import Bar from './bar';

export default class Footer extends Bar {
  constructor(options) {
    super(options);

    this.setClassed({
      bar: true
    });
  }
}
