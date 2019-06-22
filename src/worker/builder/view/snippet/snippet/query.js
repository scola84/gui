import { Snippet } from '../snippet';

export class Query extends Snippet {
  resolveAfter(box, data) {
    const query = this._list[0];

    if (typeof query === 'function') {
      return this.resolveFunction(box, data, query);
    }

    return this.resolveString(box, data, query);
  }

  resolveFunction(box, data, query) {
    const result = [];

    const snippets = this._builder
      .getView()
      .find(query);

    for (let i = 0; i < snippets.length; i += 1) {
      result[result.length] = box ?
        snippets[i].resolve(box, data) :
        snippets[i];
    }

    return result;
  }

  resolveString(box, data, query) {
    const result = [];

    this._builder
      .getView()
      .node()
      .selectAll(query)
      .each((datum, index, nodes) => {
        result[result.length] = box ?
          nodes[index].snippet.resolve(box, data) :
          nodes[index].snippet;
      });

    return result;
  }
}
