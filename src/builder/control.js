import { event, select } from 'd3';
import flatpickr from 'flatpickr';
import { DateTime } from 'luxon';
import Builder from './builder';

import {
  handleArrow,
  handleLevel,
  handlePicker,
  renderTab
} from '../helper';

export default class ControlBuilder extends Builder {
  act(route, data, callback) {
    if (this._prepare) {
      this._prepareControl(route, data, callback);
    }

    if (this._finish) {
      this._finishControl(route, data);
    }

    this.pass(route, data, callback);
  }

  _createControl(route, data, structure) {
    const panel = select(route.node);

    const number = panel
      .selectAll('div.control')
      .size() - 1;

    const control = panel
      .select('#' + this._createTarget('control', number))
      .classed('connect', structure.connect)
      .append('div')
      .datum(structure)
      .attr('class', (datum) => datum.name)
      .classed('block', true);

    control
      .append('div')
      .classed('title', true)
      .text((d, i, n) => {
        return this.format(d, i, n, { data, name: 'title', route });
      });

    const body = control
      .append('div')
      .classed('body', true);

    const level = body
      .append('div')
      .classed('level', true);

    const levels = structure.levels;

    const tab = renderTab(level, levels, {
      format: (datum, index, nodes, value) => {
        return this.format(datum, index, nodes, { name: 'level', value });
      }
    });

    tab.on('change', () => {
      const meta = route.control[structure.name].meta;
      meta.level = event.detail;
      handleLevel(route, structure);
    });

    const date = body
      .append('div')
      .classed('date', true);

    date
      .append('button')
      .classed('icon prev ion-ios-arrow-back', true)
      .attr('tabindex', 0)
      .on('click', () => {
        handleArrow(route, structure, 'prev');
      });

    const title = date
      .append('div')
      .classed('title', true);

    date
      .append('button')
      .classed('icon next ion-ios-arrow-forward', true)
      .attr('tabindex', 0)
      .on('click', () => {
        handleArrow(route, structure, 'next');
      });

    this._createTitle(route, panel, structure, title);

    return control;
  }

  _createTitle(route, panel, structure, title) {
    const begin = title
      .append('div')
      .classed('begin', true);

    const beginInput = begin
      .append('input')
      .attr('type', 'text');

    const beginLabel = begin
      .append('label')
      .attr('for', 'date-begin-' + this.getId());

    title
      .append('span')
      .classed('icon flip ion-ios-arrow-round-forward', true);

    const end = title
      .append('div')
      .classed('end', true);

    const endInput = end
      .append('input')
      .attr('type', 'text');

    const endLabel = end
      .append('label')
      .attr('for', 'date-end-' + this.getId());

    const beginPicker = flatpickr(beginInput.node(), {
      clickOpens: false,
      position: 'below center',
      positionElement: begin.node(),
      formatDate: () => {
        return beginInput.property('value');
      },
      onChange: ([date]) => {
        if (date) {
          handlePicker(route, structure, date, 'begin');
        }
      },
      onValueUpdate: ([date]) => {
        if (date) {
          handlePicker(route, structure, date, 'begin');
        }
      }
    });

    const endPicker = flatpickr(endInput.node(), {
      clickOpens: false,
      position: 'below center',
      positionElement: end.node(),
      formatDate: () => {
        return endInput.property('value');
      },
      onChange: ([date]) => {
        if (date) {
          handlePicker(route, structure, date, 'end');
        }
      },
      onValueUpdate: ([date]) => {
        if (date) {
          handlePicker(route, structure, date, 'end');
        }
      }
    });

    select(beginLabel.node().previousSibling)
      .attr('id', 'date-begin-' + this.getId());

    select(endLabel.node().previousSibling)
      .attr('id', 'date-end-' + this.getId());

    beginLabel
      .on('mousedown', () => {
        event.stopPropagation();
      });

    beginInput
      .on('mousedown', () => {
        event.stopPropagation();
      })
      .on('click', () => {
        const meta = route.control[structure.name].meta;

        let date = DateTime
          .fromMillis(meta.date.begin);

        date = date.valueOf() - (date.offset * 60 * 1000);

        beginPicker.setDate(date);
        beginPicker.toggle();

        endPicker.close();
      });

    endLabel
      .on('mousedown', () => {
        event.stopPropagation();
      });

    endInput
      .on('mousedown', () => {
        event.stopPropagation();
      })
      .on('click', () => {
        const meta = route.control[structure.name].meta;

        let date = DateTime
          .fromMillis(meta.date.end);

        date = date.valueOf() - (date.offset * 60 * 1000);

        endPicker.setDate(date);
        endPicker.toggle();

        beginPicker.close();
      });

    panel.on('remove.scola-gui-control-' + this.getId(), () => {
      panel.on('remove.scola-gui-control-' + this.getId(), null);
      beginPicker.destroy();
      endPicker.destroy();
    });
  }

  _finishControl(route, data) {
    data = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) :
      this._structure;

    const panel = select(route.node);

    this._formatLevel(route, panel, structure);
    this._formatDate(route, panel, structure);
  }

  _formatDate(route, panel, structure) {
    const control = route.control[structure.name];

    const beginLabel = panel.select('.date .begin label');
    const endLabel = panel.select('.date .end label');

    const beginNode = beginLabel.node();
    const endNode = endLabel.node();

    if (beginNode && beginNode.previousSibling.type === 'date') {
      beginLabel.node().previousSibling.valueAsNumber =
        control.meta.date.begin;
    }

    if (endNode && endNode.previousSibling.type === 'date') {
      endLabel.node().previousSibling.valueAsNumber =
        control.meta.date.end;
    }

    beginLabel.text(this.format(null, null, null, {
      name: 'picker.begin'
    }, control.meta.date.begin, 'UTC'));

    endLabel.text(this.format(null, null, null, {
      name: 'picker.end'
    }, control.meta.date.end, 'UTC'));
  }

  _formatLevel(route, panel, structure) {
    const control = route.control[structure.name];

    const has = control.structure.levels
      .map((level) => 'has-' + level)
      .join(' ');

    const unset = control.structure.levels
      .join(' ');

    const set = control.meta.level;

    control.node
      .classed(unset, false)
      .classed(has, true)
      .classed(set, true);

    panel
      .selectAll('.tab li')
      .classed('selected', false);

    panel
      .select('.tab .' + control.meta.level)
      .classed('selected', true);
  }

  _prepareControl(route, data, callback) {
    data = this.filter(route, data);

    const structure = typeof this._structure === 'function' ?
      this._structure(route, data) :
      this._structure;

    const panel = select(route.node);

    const target = panel
      .select('#' + this._target);

    if (target.size() > 0) {
      return;
    }

    const number = panel
      .selectAll('div.control')
      .size();

    const node = panel
      .select('.body .content ' + this._wrap)
      .append('div')
      .attr('id', this._createTarget('control', number))
      .classed('control', true);

    route.control = route.control || {};
    route.control[structure.name] = { meta: {} };

    route.control[structure.name].node = node;
    route.control[structure.name].structure = structure;

    handleLevel(route, structure);

    route.control[structure.name].reload = () => {
      this.pass(route, data, callback);
    };

    this._createControl(route, data, structure);
  }
}
