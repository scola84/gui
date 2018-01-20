import { event, select } from 'd3';
import GraphicWorker from '../worker/graphic';

export default class OrderPreparer extends GraphicWorker {
  constructor(options) {
    super(options);
    this._content = null;
  }

  act(route, data, callback) {
    this._bindContent(route);
    this.pass(route, data, callback);
  }

  _bindContent(route) {
    this._content = select(route.node)
      .select('.content');

    let drag = null;

    this._content.on('mousedown', () => {
      drag = event.target;
    });

    this._content.on('dragstart', () => {
      if (select(drag).classed('ion-ios-drag') === false) {
        event.preventDefault();
      }
    });

    this._content.on('dragover', () => {
      event.preventDefault();
    });

    this._content.on('drop', () => {
      const from = drag.closest('li');
      const to = event.target.closest('li');

      if (to === null) {
        this._export(from);
      } else if (to.parentNode !== from.parentNode) {
        this._import(from, to);
      } else {
        this._move(from, to);
      }
    });
  }

  _export(from) {
    const container = select(from.closest('ul').parentNode);
    const ungrouped = this._content.select('.ungrouped');

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    if (fromList.classed('export') === false) {
      return;
    }

    this._removeFrom(fromList, from);
    from.removeChild(fromDrag);

    const to = from.cloneNode(true);
    to.appendChild(fromDrag);

    const toList = ungrouped.size() > 0 ? ungrouped : container
      .append('ul')
      .classed('block list', true);

    toList
      .node()
      .appendChild(to);

    this._reset(fromList, from, { empty: true });
    this._reset(toList, to, fromDatum);
  }

  _import(from, to) {
    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('ul'));

    if (toList.classed('import') === false) {
      return;
    }

    if (!toDrag) {
      to.appendChild(fromDrag);
      this._removeFrom(fromList, from);
    } else if (toList.classed('static')) {
      to.appendChild(fromDrag);
      from.appendChild(toDrag);
    } else {
      toList
        .node()
        .insertBefore(from, to);
    }

    this._reset(fromList, from, toDatum);
    this._reset(toList, to, fromDatum);
  }

  _move(from, to) {
    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('ul'));

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    if (toDrag === null) {
      to.appendChild(fromDrag);
    } else {
      const children = Array.from(from.parentNode.childNodes);
      const fromIndex = children.indexOf(from);
      const toIndex = children.indexOf(to);

      if (fromIndex > toIndex) {
        toList
          .node()
          .insertBefore(from, to);
      } else if (to.nextSibling) {
        toList
          .node()
          .insertBefore(from, to.nextSibling);
      } else {
        toList
          .node()
          .appendChild(from);
      }
    }

    this._reset(fromList, from, toDatum);
    this._reset(toList, to, fromDatum);
  }

  _removeFrom(fromList, from) {
    if (fromList.classed('static') === false) {
      from.parentNode.removeChild(from);
    }

    if (fromList.classed('ungrouped')) {
      return;
    }

    if (fromList.node().childNodes.length === 0) {
      fromList.remove();
    }
  }

  _reset(list, node, datum) {
    list
      .selectAll('.number:not(:empty)')
      .text((d, i) => i + 1);

    select(node)
      .datum(datum);
  }
}
