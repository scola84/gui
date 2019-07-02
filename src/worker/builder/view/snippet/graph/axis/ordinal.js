import { Scale } from './scale';

export class Ordinal extends Scale {
  setName(value = 'ordinal') {
    return super.setName(value);
  }

  calculateDistance(value) {
    value = this._domain.keys.indexOf(value);

    let distance = (value - this._domain.min) * this._ppu;

    if (this._domain.type === 'group') {
      distance = distance * this._domain.size;
    }

    return distance;
  }

  calculateTicks() {
    const ticks = [];

    let distance = null;
    let key = null;

    for (let i = this._domain.keys.length - 1; i >= 0; i -= 1) {
      key = this._domain.keys[i];
      distance = this.calculateDistance(key);

      ticks[ticks.length] = [
        key,
        distance
      ];
    }

    return ticks;
  }

  normalizeDistance(distance, force) {
    let center = this._ppu / 2;

    if (this._domain.type === 'group') {
      center = center * this._domain.size;
    }

    distance += center;

    return super.normalizeDistance(distance, force);
  }

  prepareDomainExogenous() {
    this.prepareDomainMax([this._domain.keys.length]);
    this.prepareDomainMin([0]);
  }

  preparePpu() {
    const name = this.mapRange();

    this._ppu = this._range[name] /
      (this._domain.max - this._domain.min);

    if (this._domain.type === 'group') {
      this._ppu = this._ppu / this._domain.size;
    }

    return this;
  }
}
