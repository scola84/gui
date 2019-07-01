import { Data } from './data';

export class Default extends Data {
  prepareValue(result, x, y) {
    if (typeof result.data[x] === 'undefined') {
      result.data[x] = [];
      result.keys[result.keys.length] = x;
    }

    const set = result.data[x];
    const index = set.length;

    set[index] = [0, y];

    return [index, 'default'];
  }
}
