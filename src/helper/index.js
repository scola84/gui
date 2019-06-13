import attach from './attach';
import bind from './bind';
import shim from './shim';

export {
  attach,
  bind,
  shim
};

export function setup() {
  shim();
  bind();
  attach();
}
