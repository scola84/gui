import { Calculator } from './calculator';

export class LinearCalculator extends Calculator {
  calculateTicks(step, count = 1) {
    step = step || this._domain.max / (count - 1);

    const ticks = [];
    let value = this._domain.max;

    for (; value >= this._domain.min; value -= step) {
      ticks[ticks.length] = [
        value,
        this.calculateDistance(value),
      ];
    }

    return ticks;
  }

  prepareStep() {
    const name = this.mapRangeName();
    const base = this._range[name];

    this._step = base / (this._domain.max - this._domain.min);

    return this;
  }
}
