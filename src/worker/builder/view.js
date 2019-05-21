import { Worker } from '@scola/worker';
import * as snippet from '../../snippet';

export default class ViewBuilder extends Worker {
  constructor(options = {}) {
    super(options);

    this._view = null;
    this.setView(options.view);
  }

  getView() {
    return this._view;
  }

  setView(value = null) {
    this._view = value;
    return this;
  }

  act(box, data, callback) {
    box.base.insert(() => {
      return this._view.render(box, data).node();
    });

    this.pass(box, data, callback);
  }

  render(view) {
    return this.setView(view);
  }

  click(...list) {
    return new snippet.Click({
      list
    });
  }

  data(...list) {
    return new snippet.Data({
      list
    });
  }

  node(name, ...list) {
    return new snippet.Node({
      list,
      name
    });
  }

  panel(...list) {
    return new snippet.Panel({
      list
    });
  }

  route(...list) {
    return new snippet.Route({
      list
    });
  }

  object(...list) {
    return new snippet.Obj({
      list
    });
  }
}
