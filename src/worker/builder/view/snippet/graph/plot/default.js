import { Preparer } from './preparer';

export class DefaultPreparer extends Preparer {
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
