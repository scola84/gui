import Node from '../node';

export default class Progress extends Node {
  resolveAfter(box, data) {
    if (data.lengthComputable !== true) {
      return this._node;
    }

    const fraction = data.loaded / data.total;

    this._node
      .transition()
      .style('width', (fraction * 100) + '%')
      .on('end', () => {
        if (fraction === 1) {
          this._node.style('width', 0);
        }
      });

    return this._node;
  }
}
