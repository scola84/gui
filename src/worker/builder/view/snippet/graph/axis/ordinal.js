import { LinearCalculator } from './linear';

export class OrdinalCalculator extends LinearCalculator {
  calculateTicks(step, count = 1) {
    step = step || this._domain.max / (count - 1);

    const halfStep = this._step / 2;
    const ticks = [];

    let distance = null;
    let value = this._domain.max - 1;

    for (; value >= this._domain.min; value -= step) {
      distance = this.calculateDistance(value) + halfStep;

      if (this._domain.type !== 'stack') {
        distance = distance * this._domain.size;
      }

      ticks[ticks.length] = [
        this._domain.keys[value],
        distance
      ];
    }

    return ticks;
  }

  prepareDomain() {
    super.prepareDomain();
    this._domain.min -= 1;
    return this.prepareRange();
  }

  prepareStep() {
    super.prepareStep();

    if (this._domain.type !== 'stack') {
      this._step = this._step / this._domain.size;
    }

    return this;
  }
}
