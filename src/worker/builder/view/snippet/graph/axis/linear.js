import { Calculator } from './calculator';

export class LinearCalculator extends Calculator {
  calculateTicks() {
    return [];
  }

  prepareStep() {
    const name = this.mapDimensionName();
    const base = this._range[name];

    this._step = base / (this._domain.max - this._domain.min);

    return this;
  }
}
