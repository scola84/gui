import camel from 'lodash-es/camelCase';
import { ViewBuilder } from '../worker';
import * as snippet from '../snippet';
import * as token from '../token';

export default function attach() {
  Object.keys(snippet).forEach((group) => {
    Object.keys(snippet[group]).forEach((name) => {
      ViewBuilder.attachFactory('action', name, snippet[group][name], {
        classed: {
          [camel(name)]: true
        }
      });
    });
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
