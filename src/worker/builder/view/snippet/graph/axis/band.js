import { LinearCalculator } from './linear';

export class BandCalculator extends LinearCalculator {
  calculateTicks() {
    return [];
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
