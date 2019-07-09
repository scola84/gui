import camel from 'lodash-es/camelCase';

export * from './scale';
import * as scale from './scale';

const map = Object.keys(scale).reduce((object, name) => {
  return Object.assign(object, {
    [camel(name)]: {
      object: scale[name]
    }
  });
}, {});

export {
  map
};
