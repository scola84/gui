import Bar from './bar';

export default class Header extends Bar {
  constructor(options) {
    super(options);

    this.setClassed({
      bar: true
    });
  }
}
