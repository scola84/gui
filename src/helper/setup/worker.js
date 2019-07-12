import {
  Worker
} from '@scola/worker';

import {
  Axis,
  Plot,
  ViewBuilder
} from '../../worker';

import { snippet } from '../../worker';
import { locale } from '../../locale';

export function worker() {
  Worker.setLog(Worker.log);

  ViewBuilder.setup();
  Axis.setup();
  Plot.setup();

  snippet.Format.addStrings(locale);
}
