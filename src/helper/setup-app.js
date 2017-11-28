import { select } from 'd3';

export default function app() {
  select('.app').classed('win', () => {
    const win = localStorage.getItem('app.win');
    return win === null || Number(win) === 1;
  });
}