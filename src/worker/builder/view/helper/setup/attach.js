import { ViewBuilder } from '../../../view';
import { Axis, Plot } from '../../../view/snippet';

export function attach() {
  ViewBuilder.attach();
  Axis.attach();
  Plot.attach();
}
