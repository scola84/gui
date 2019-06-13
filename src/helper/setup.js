import {
  attach,
  bind,
  shim
} from './setup/';

export default function setup() {
  shim();
  bind();
  attach();
}
