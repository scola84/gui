import camel from 'lodash-es/camelCase';
import { ViewBuilder } from '../../worker';
import * as snippet from '../../snippet';
import * as token from '../../token';

export function attach() {
  Object.keys(snippet).forEach((group) => {
    Object.keys(snippet[group]).forEach((name) => {
      ViewBuilder.attachFactory('', name, snippet[group][name], {
        class: camel(name)
      });
    });
  });

  token.cls.forEach((name) => {
    ViewBuilder.attachFactory('cls', name, snippet.Node, {
      class: camel(name)
    });
  });

  token.dom.forEach((name) => {
    ViewBuilder.attachFactory('dom', name, snippet.Node, {
      name
    });
  });
}
