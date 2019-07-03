import { Scale } from './scale';

export class Linear extends Scale {
  setName(value = 'linear') {
    return super.setName(value);
  }

  calculateDistance(value) {
    let distance = (value - this._domain.min) * this._ppu;

    if (this.mapOrientation() === 'y') {
      distance = this._range.height - distance;
    }

    return distance;
  }

  calculateTicks() {
    const { max, min } = this._domain;

    const step = this._step === null ?
      this._domain.max / (this._count - 1) :
      this._step;

    const ticks = [];

    let distance = null;

    for (let value = max; value >= min; value -= step) {
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
}
