import { Data } from './data';

export class Sum extends Data {
  prepareValue(result, x, y) {
    if (typeof result.data[x] === 'undefined') {
      result.data[x] = [];
      result.keys[result.keys.length] = x;
    }

    const set = result.data[x];
    const index = set.length;

    const previous = index > 0 ?
      set[index - 1] : [0, 0];

    set[0] = [
      0,
      previous[1] + y
    ];

    return [0, 'sum'];
  }
}
