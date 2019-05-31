import camel from 'lodash-es/camelCase';
import * as snippet from '../snippet';
import * as token from '../token';

export default function attach(ViewBuilder) {
  function attachFactory(prefix, name, object, options = {}) {
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

  Object.keys(snippet).forEach((group) => {
    Object.keys(snippet[group]).forEach((name) => {
      attachFactory('action', name, snippet[group][name], {
        classed: {
          [camel(name)]: true
        }
      });
    });
  });

  token.cls.forEach((name) => {
    attachFactory('cls', name, snippet.Node, {
      classed: {
        [name]: true
      }
    });
  });

  token.dom.forEach((name) => {
    attachFactory('dom', name, snippet.Node, {
      name
    });
  });
}
