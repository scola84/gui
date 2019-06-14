import {
  attach,
  bind,
  shim
} from './setup/';

export default function setup() {
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
