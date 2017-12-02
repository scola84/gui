import { event, select } from 'd3';
import StateRouter from './state';

export default class PopRouter extends StateRouter {
  constructor(methods) {
    super(methods);
    this._base = null;
  }

  setBase(value) {
    this._base = value;
    return this;
  }

  act(route, data, callback) {
    super.act(route, data, callback);

    if (route.name) {
      this._open(route);
    } else {
      this._close(route);
    }
  }

  _open(route) {
    select(route.node).on('click.pop', () => {
      event.stopPropagation();
    });

    select(document).on('keydown.pop', () => {
      if (event.keyCode === 27) {
        this._base.dispatch('click');
      }
    });

    this._base
      .style('display', 'flex')
      .on('click.pop', () => {
        if (route.lock === true) {
          return;
        }

        this.act({
          name: null,
          node: route.node
        });
      })
      .transition()
      .style('opacity', 1);

    this._base
      .select('.dialog')
      .transition()
      .duration(route.move === false ? 0 : 250)
      .style('top', 0);
  }

  _close(route) {
    select(document)
      .on('keydown.pop', null);

    this._base
      .on('click.pop', null)
      .transition()
      .style('opacity', 0)
      .on('end', () => {
        if (route.node) {
          select(route.node).remove();
        }

        this._base.style('display', 'none');
      });

    this._base
      .select('.dialog')
      .transition()
      .duration(route.move === false ? 0 : 250)
      .style('top', '100%');
  }
}
