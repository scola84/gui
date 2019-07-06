import 'dom-shims';
import 'es5-shim';
import 'es6-shim';
import 'es6-symbol/implement';
import es7 from 'es7-shim';

export function shim() {
  if (typeof window === 'undefined') {
    return;
  }

  es7.shim();
}
