import { event, select, selectAll } from 'd3';
import { Click } from './click';

export class Tab extends Click {
  resolveAfter(box, data) {
    box.tab = 0;

    const result = super.resolveAfter(box, data);

    for (let i = 0; i < result.length; i += 1) {
      this.changeTab(box, data, result[i]);
    }

    return result;
  }

  changeTab(box, data, node) {
    const children = Array.from(node.node().children);
    node.classed('selected', true);

    selectAll(children).classed('selected', false);
    select(children[box.tab]).classed('selected', true);
  }

  handle(box, data, snippet) {
    const node = snippet.node();
    const children = Array.from(node.node().children);
    const tab = children.indexOf(event.target);

    if (tab === box.tab || tab < 0) {
      return false;
    }

    box.tab = tab;

    this.changeTab(box, data, node);
    this.pass(box, data);

    return false;
  }
}
