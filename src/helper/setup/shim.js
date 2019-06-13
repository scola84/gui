import 'dom-shims';
import 'es5-shim';
import 'es6-shim';
import 'es6-symbol/implement';

import es7 from 'es7-shim';

export default function shim() {
  es7.shim();
}
