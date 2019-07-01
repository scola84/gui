import { Scale } from './scale';

export class Linear extends Scale {
  calculateTicks(step, count = 1) {
    step = step || this._domain.max / (count - 1);

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

  prepareStep() {
    const name = this.mapRangeName();
    const base = this._range[name];

    this._step = base / (this._domain.max - this._domain.min);

    return this;
  }
}
