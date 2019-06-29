import { LinearCalculator } from './linear';

export class BandCalculator extends LinearCalculator {
  calculateTicks() {
    return [];
  }

  prepareStep() {
    this._domain.min -= 1;

    super.prepareStep();

    if (this._domain.stack === false) {
      this._step = this._step / this._domain.size;
    }

    return this;
  }
}
