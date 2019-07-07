import camel from 'lodash-es/camelCase';
import { Node } from '../snippet/node';

import clsBase from './cls';
import domBase from './dom';
import snippetBase from './snippet';

const cls = clsBase.reduce((object, name) => {
  return Object.assign(object, {
    [camel(name)]: {
      object: Node,
      options: {
        class: name,
        name: 'div'
      }
    }
  });
}, {});

const dom = domBase.reduce((object, name) => {
  return Object.assign(object, {
    [camel(name)]: {
      object: Node,
      options: {
        name
      }
    }
  });
}, {});

const snippet = Object.keys(snippetBase).reduce((master, group) => {
  return Object.keys(snippetBase[group]).reduce((object, name) => {
    return Object.assign(object, {
      [camel(name)]: {
        object: snippetBase[group][name],
        options: {
          class: name
        }
      }
    });
  }, master);
}, {});

export {
  snippet,
  cls,
  dom
};
