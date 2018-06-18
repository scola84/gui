import { DateTime } from 'luxon';

const levels = {
  year: 'month',
  month: 'day',
  week: 'day'
};

export default function handleLevel(route, structure, datum) {
  const name = structure.name;
  const control = route.control[name];
  const meta = control.meta;

  let begin = null;
  let end = null;
  let level = null;

  if (typeof meta.level === 'undefined') {
    level = structure.levels[0];
    end = DateTime.utc().setZone('local').endOf('day');
  } else {
    level = meta.level;
    end = DateTime.fromMillis(meta.date.end);

    if (datum) {
      level = levels[meta.level];

      if (control.structure.levels.indexOf(level) === -1) {
        return;
      }

      end = DateTime.fromMillis(datum.timestamp).endOf(levels[meta.level]);
    }
  }

  if (end.valueOf() === end.endOf(level).valueOf()) {
    begin = end.startOf(level);
  } else {
    begin = end
      .minus({
        [level]: 1
      })
      .plus({
        day: 1
      })
      .startOf('day');
  }

  begin = begin.valueOf() + (end.offset * 60 * 1000);
  end = end.valueOf() + (end.offset * 60 * 1000);

  meta.level = level;
  meta.date = Object.assign({}, meta.date, {
    begin,
    end
  });

  if (route.control[name].reload) {
    route.control[name].reload();
  }
}
