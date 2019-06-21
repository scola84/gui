import { event, select } from 'd3';
import { ViewRouter } from './view';

export class PopRouter extends ViewRouter {
  act(box, data, callback) {
    if (box.path !== false) {
      this.open(box);
    }

    super.act(box, data, callback);
  }

  close(box) {
    const base = select(this._base);
    const parent = select(this._base.parentNode);

    select(document).on('keydown.scola-pop', null);

    parent
      .classed('in', false)
      .on('click.scola-pop', null)
      .on('transitionend.scola-pop', () => {
        parent
          .classed('transition', false)
          .on('transitionend.scola-pop', null);

        box.path = false;
        this.act(box);
      });

    base
      .on('click.scola-pop', null)
      .classed('in', false);
  }

  open(box) {
    const base = select(this._base);
    const parent = select(this._base.parentNode);

    select(document).on('keydown.scola-pop', () => {
      if (event.keyCode === 27) {
        parent.dispatch('click');
      }
    });

    parent.classed('transition', true);
    parent.style('left');

    parent
      .classed('in', true)
      .on('click.scola-pop', () => {
        if (box.lock !== true) {
          this.close(box);
        }
      });

    base
      .classed('transition', box.move !== false)
      .classed('in', true)
      .on('click.scola-pop', () => {
        event.stopPropagation();
      });
  }
}
