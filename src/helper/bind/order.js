import { event, select } from 'd3';

export default function bindOrder(route) {
  const content = select(route.node)
    .select('.content');

  let drag = null;

  content.on('mousedown', () => {
    drag = event.target;
  });

  content.on('dragstart', () => {
    if (select(drag).classed('handle') === false) {
      event.preventDefault();
    } else {
      event.dataTransfer.setData('text', '');
    }
  });

  content.on('dragover', () => {
    event.preventDefault();
  });

  content.on('drop', () => {
    const from = drag.closest('li');
    const to = event.target.closest('li');

    if (to === null) {
      _export(from);
    } else if (to.parentNode !== from.parentNode) {
      _import(from, to);
    } else {
      _move(from, to);
    }
  });

  function _clone(from, to) {
    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');

    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('ul'));

    if (toList.classed('no-duplicate')) {
      if (_hasDuplicate(fromDatum, toList)) {
        return;
      }
    }

    if (!toDrag) {
      to.appendChild(fromDrag.cloneNode(true));
      _reset(toList, to, fromDatum);
    }
  }

  function _export(from) {
    const container = select(from.closest('ul').parentNode);
    const ungrouped = content.select('.ungrouped');

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    if (fromList.classed('export') === false) {
      return;
    }

    from.removeChild(fromDrag);
    _removeFrom(fromList, from);
    _reset(fromList, from, { name: fromDatum.name, empty: true });

    if (fromList.classed('to-ungrouped') === false) {
      return;
    }

    const to = from.cloneNode(true);
    to.appendChild(fromDrag);

    const toList = ungrouped.size() > 0 ? ungrouped : container
      .append('ul')
      .classed('block list', true);

    toList
      .node()
      .appendChild(to);

    _reset(toList, to, fromDatum);
  }

  function _import(from, to) {
    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('ul'));

    if (toList.classed('import') === false) {
      return;
    }

    if (toList.classed('no-duplicate')) {
      if (_hasDuplicate(fromDatum, toList)) {
        return;
      }
    }

    if (fromList.classed('clone')) {
      _clone(from, to);
      return;
    }

    if (!toDrag) {
      to.appendChild(fromDrag);
      _removeFrom(fromList, from);
      _reset(fromList, from, toDatum);
      _reset(toList, to, fromDatum);
    } else if (toList.classed('static')) {
      to.appendChild(fromDrag);
      from.appendChild(toDrag);
      _reset(fromList, from, toDatum);
      _reset(toList, to, fromDatum);
    } else {
      toList
        .node()
        .insertBefore(from, to);
    }
  }

  function _move(from, to) {
    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('ul'));

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('ul'));

    if (toDrag === null) {
      to.appendChild(fromDrag);
      _reset(fromList, from, toDatum);
      _reset(toList, to, fromDatum);
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
  }

  function _hasDuplicate(fromDatum, toList) {
    let found = false;

    toList.selectAll('li').each((datum) => {
      found = found ||
        typeof datum[datum.name] !== 'undefined' &&
        datum[datum.name] === fromDatum[datum.name];
    });

    return found;
  }

  function _removeFrom(fromList, from) {
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

  function _reset(list, node, datum) {
    list
      .selectAll('span.number:not(:empty)')
      .text((d, i) => i + 1);

    select(node)
      .datum(datum);
  }
}
