import {
  attach,
  bind,
  shim
} from './setup/';

export function setup() {
  attach();

  if (typeof window === 'undefined') {
    return;
  }

  shim();
  bind();
}

Object.assign(setup, {
  shim,
  bind,
  attach
});
