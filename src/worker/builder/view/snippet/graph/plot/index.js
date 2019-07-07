import camel from 'lodash-es/camelCase';

export * from './data';
import * as data from './data';

const token = Object.keys(data).reduce((object, name) => {
  return Object.assign(object, {
    [camel(name)]: {
      object: data[name]
    }
  });
}, {});

export {
  token
};
