import { Worker } from '@scola/worker';
import camel from 'lodash-es/camelCase';
import * as snippet from '../../snippet';
import * as token from '../../token';

export default class ViewBuilder extends Worker {
  static attach() {
    Object.keys(snippet.action).forEach((name) => {
      ViewBuilder.attachFactory('action', name, snippet.action[name]);
    });

    Object.keys(snippet.input).forEach((name) => {
      ViewBuilder.attachFactory('input', name, snippet.input[name]);
    });

    Object.keys(snippet.node).forEach((name) => {
      ViewBuilder.attachFactory('node', name, snippet.node[name]);
    });

    token.cls.forEach((name) => {
      ViewBuilder.attachFactory('cls', name, snippet.Node, {
        classed: {
          [name]: true
        }
      });
    });

    token.dom.forEach((name) => {
      ViewBuilder.attachFactory('dom', name, snippet.Node, {
        name
      });
    });
  }

  static attachFactory(prefix, name, object, options = {}) {
    ViewBuilder.prototype[
      camel(ViewBuilder.prototype[name] ?
        `${prefix}-${name}` : name)
    ] = function create(...list) {
      return new object(Object.assign(options, {
        builder: this,
        list
      }));
    };
  }

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

  query(query) {
    return this._view.query(query);
  }

  queryAll(query) {
    return this._view.queryAll(query);
  }

  render(view) {
    return this.setView(view);
  }
}
