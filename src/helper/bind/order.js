import { event, select } from 'd3';

export default function bindOrder(route) {
  const content = select(route.node)
    .select('.content');

  const form = content
    .select('form');

  let drag = null;

  content.on('mousedown', () => {
    drag = event.target;
  });

  content.on('dragstart', () => {
    form.classed('dragging', true);

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
    form.classed('dragging', false);

    const from = drag.closest('li');
    const to = event.target.closest('li');

    if (to === null) {
      moveFrom(from);
    } else if (to.parentNode !== from.parentNode) {
      moveFromTo(from, to);
    } else {
      move(from, to);
    }
  });

  function clone(from, to) {
    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');

    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('.block.order'));

    if (toList.classed('no-duplicate')) {
      if (hasDuplicate(fromDatum, toList)) {
        return;
      }
    }

    if (!toDrag) {
      to.appendChild(fromDrag.cloneNode(true));
      reset(toList, to, fromDatum);
    }
  }

  function moveFrom(from) {
    const container = select(from.closest('ul').parentNode);
    const ungrouped = content.select('.ungrouped');

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('.block.order'));

    if (fromList.classed('export') === false) {
      return;
    }

    from.removeChild(fromDrag);
    removeFrom(fromList, from);
    reset(fromList, from, { name: fromDatum.name, empty: true });

    if (fromList.classed('to-ungrouped') === false) {
      return;
    }

    const to = from.cloneNode(true);
    to.appendChild(fromDrag);

    let toList = ungrouped.size() > 0 ? ungrouped : null;

    if (toList === null) {
      toList = container
        .append('div')
        .classed('block order ungrouped', true);

      toList.append('ul');
    }

    toList
      .select('ul')
      .node()
      .appendChild(to);

    reset(toList, to, fromDatum);
  }

  function moveFromTo(from, to) {
    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('.block.order'));

    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('.block.order'));

    if (toList.classed('import') === false) {
      return;
    }

    if (toList.classed('no-duplicate')) {
      if (hasDuplicate(fromDatum, toList)) {
        return;
      }

      if (hasDuplicate(toDatum, fromList)) {
        return;
      }
    }

    if (fromList.classed('clone')) {
      clone(from, to);
      return;
    }

    if (!toDrag) {
      to.appendChild(fromDrag);
      removeFrom(fromList, from);
      reset(fromList, from, toDatum);
      reset(toList, to, fromDatum);
    } else if (toList.classed('static')) {
      to.appendChild(fromDrag);
      from.appendChild(toDrag);
      reset(fromList, from, toDatum);
      reset(toList, to, fromDatum);
    } else {
      toList
        .select('ul')
        .node()
        .insertBefore(from, to);
    }
  }

  function move(from, to) {
    const toDatum = select(to).datum();
    const toDrag = to.querySelector('[draggable]');
    const toList = select(to.closest('.block.order'));

    const fromDatum = select(from).datum();
    const fromDrag = from.querySelector('[draggable]');
    const fromList = select(from.closest('.block.order'));

    if (toDrag === null) {
      to.appendChild(fromDrag);
      reset(fromList, from, toDatum);
      reset(toList, to, fromDatum);
    } else {
      const children = Array.from(from.parentNode.childNodes);
      const fromIndex = children.indexOf(from);
      const toIndex = children.indexOf(to);
      const node = toList.select('ul').node();

      if (fromIndex > toIndex) {
        node.insertBefore(from, to);
      } else if (to.nextSibling) {
        node.insertBefore(from, to.nextSibling);
      } else {
        node.appendChild(from);
      }

      reset(fromList);
    }
  }

  function hasDuplicate(fromDatum, toList) {
    let found = false;

    toList.selectAll('li').each((datum) => {
      found = found ||
        typeof datum[datum.name] !== 'undefined' &&
        datum[datum.name] === fromDatum[datum.name];
    });

    return found;
  }

  function removeFrom(fromList, from) {
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

  function reset(list, node = null, datum = null) {
    list
      .selectAll('span.number:not(:empty)')
      .text((d, i) => i + 1);

    if (node && datum) {
      select(node).datum(datum);
    }
  }
}
