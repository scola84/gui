import {
  Worker
} from '@scola/worker';

import {
  Axis,
  Plot,
  ViewBuilder
} from '../../worker';

export function worker() {
  Worker.setLog(Worker.log);

  ViewBuilder.setup();

  Axis.setup();
  Plot.setup();
}
