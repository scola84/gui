import {
  bind,
  shim,
  worker
} from './setup/';

export function setup() {
  bind();
  shim();
  worker();
}
