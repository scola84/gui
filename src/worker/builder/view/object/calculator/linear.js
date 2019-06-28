import { Calculator } from './calculator';

export class LinearCalculator extends Calculator {
  calculate(value) {
    return (value - this._range.min) * this._ppu;
  }

  calculatePpu() {
    const base = this._orientation === 'x' ?
      this._dimension.width :
      this._dimension.height;

    this._ppu = base / (this._range.max - this._range.min);
  }
}
