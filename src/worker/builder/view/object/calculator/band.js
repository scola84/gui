import { Calculator } from './calculator';

export class BandCalculator extends Calculator {
  calculate(i, j, size, stack, padding) {
    let base = null;
    let width = null;
    let x = null;

    base = stack ? this._ppu : this._ppu / size;
    base = base - (base * padding);

    x = (i * this._ppu);
    x = stack ? x : x + (j * base);
    x = stack ? x : x + (base * padding);
    x = x + (base * padding);

    width = base - (base * padding);

    return [x, width];
  }

  calculatePpu() {
    const base = this._orientation === 'x' ?
      this._dimension.width :
      this._dimension.height;

    this._ppu = base / (this._range.max - this._range.min + 1);
  }
}
