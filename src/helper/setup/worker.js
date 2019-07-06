import {
  Axis,
  Plot,
  ViewBuilder
} from '../../worker';

export function worker() {
  ViewBuilder.setup();
  Axis.setup();
  Plot.setup();
}
