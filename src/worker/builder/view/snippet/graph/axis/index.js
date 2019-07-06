export * from './scale';
import * as scale from './scale';

const token = Object.keys(scale).reduce((object, name) => {
  return Object.assign(object, {
    [name]: {
      object: scale[name]
    }
  });
}, {});

export {
  token
};
