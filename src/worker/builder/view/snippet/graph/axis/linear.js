import { Scale } from './scale';

export class Linear extends Scale {
  setName(value = 'linear') {
    return super.setName(value);
  }

  calculateDistance(value) {
    return (value - this._domain.min) * this._ppu;
  }

  calculateTicks() {
    const step = this._step === null ?
      this._domain.max / (this._count - 1) :
      this._step;

    const ticks = [];

    let distance = null;
    let value = this._domain.max;

    for (; value >= this._domain.min; value -= step) {
      distance = this.calculateDistance(value);

      ticks[ticks.length] = [
        value,
        distance
      ];
    }

    return ticks;
  }

  prepareDomainExogenous() {
    this.prepareDomainMax(this._domain.keys);
    this.prepareDomainMin(this._domain.keys);
  }

  preparePpu() {
    const name = this.mapRange();

    this._ppu = this._range[name] /
      (this._domain.max - this._domain.min);

    return this;
  }
}
