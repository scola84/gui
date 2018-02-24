import { select } from 'd3';
import GraphicWorker from '../worker/graphic';
import { bindOrder } from '../helper';

export default class FormPreparer extends GraphicWorker {
  act(route, data, callback) {
    const node = select(route.node);

    if (node.selectAll('.order').size() > 0) {
      bindOrder(route, data);
    }

    this.pass(route, data, callback);
  }
}
