import { DateTime } from 'luxon';

const levels = {
  year: 'month',
  month: 'day',
  week: 'day',
  day: 'day'
};

export default function handleLevel(route, structure, datum) {
  const name = structure.name;
  const control = route.control[name];
  const meta = control.meta;

  loadMeta(meta, structure.global);

  const level = determineLevel(control, structure, meta, datum);

  if (level === null) {
    return;
  }

  let end = determineEnd(control, structure, meta, datum);
  let begin = determineBegin(level, end);

  begin = begin.valueOf() + (end.offset * 60 * 1000);
  end = end.valueOf() + (end.offset * 60 * 1000);

  meta.level = level;
  meta.date = Object.assign({}, meta.date, {
    begin,
    end
  });

  saveMeta(control.meta, structure.global);

  if (route.control[name].reload) {
    route.control[name].reload();
  }
}

function determineBegin(level, end) {
  if (end.valueOf() === end.endOf(level).valueOf()) {
    return end.startOf(level);
  }

  return end
    .minus({
      [level]: 1
    })
    .plus({
      millisecond: 1
    });
}

function determineEnd(control, structure, meta, datum = null) {
  if (typeof meta.level === 'undefined') {
    return DateTime
      .utc()
      .endOf('day');
  }

  if (datum === null) {
    return DateTime
      .fromMillis(meta.date.end, {
        zone: 'UTC'
      })
      .endOf(levels[meta.level]);
  }

  return DateTime
    .fromMillis(datum.timestamp, {
      zone: 'UTC'
    })
    .endOf(levels[meta.level]);
}

function determineLevel(control, structure, meta, datum = null) {
  const level = meta.level;

  if (typeof level === 'undefined') {
    return determineLevelDefault(structure);
  }

  if (datum === null) {
    return determineLevelCurrent(control, structure, level);
  }

  return determineLevelNext(control, structure, level);
}

function determineLevelCurrent(control, structure, level) {
  if (control.structure.levels.indexOf(level) === -1) {
    return determineLevelDefault(structure);
  }

  return level;
}

function determineLevelDefault(structure) {
  const index = structure.levels.indexOf(structure.level);
  return structure.levels[index] || structure.level;
}

function determineLevelNext(control, structure, level) {
  level = levels[level];

  if (control.structure.levels.indexOf(level) === -1) {
    return null;
  }

  return level;
}

function loadMeta(meta, globl = null) {
  if (globl === null) {
    return;
  }

  if (typeof meta.date !== 'undefined') {
    return;
  }

  let local = localStorage.getItem(globl);
  local = JSON.parse(local);

  Object.assign(meta, local);
}

function saveMeta(meta, globl = null) {
  if (globl === null) {
    return;
  }

  meta = JSON.stringify(meta);
  localStorage.setItem(globl, meta);
}
