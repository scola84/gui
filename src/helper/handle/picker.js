import { DateTime } from 'luxon';

const ranges = {
  day: { level: 'day', amount: 1 },
  week: { level: 'week', amount: 12 },
  month: { level: 'month', amount: 3 },
  year: { level: 'year', amount: 1 }
};

export default function handlePicker(route, structure, date, type) {
  const meta = route.control[structure.name].meta;

  if (type === 'begin') {
    handleBegin(meta, date);
  } else {
    handleEnd(meta, date);
  }

  route.control[structure.name].reload();
}

function handleBegin(meta, beginDate) {
  beginDate = DateTime
    .fromJSDate(beginDate)
    .setZone('local')
    .startOf('day');

  const range = ranges[meta.level];

  meta.date.begin = beginDate.valueOf() + (beginDate.offset * 60 * 1000);

  const endDate = beginDate
    .plus({
      [range.level]: range.amount
    })
    .minus({
      day: 1
    })
    .endOf('day');

  if (endDate.valueOf() < meta.date.end) {
    meta.date.end = endDate.valueOf() + (endDate.offset * 60 * 1000);
  }
}

function handleEnd(meta, endDate) {
  endDate = DateTime
    .fromJSDate(endDate)
    .setZone('local')
    .endOf('day');

  const range = ranges[meta.level];

  meta.date.end = endDate.valueOf() + (endDate.offset * 60 * 1000);

  const beginDate = endDate
    .minus({
      [range.level]: range.amount
    })
    .plus({
      day: 1
    })
    .startOf('day');

  if (meta.date.begin < beginDate.valueOf()) {
    meta.date.begin = beginDate.valueOf() + (beginDate.offset * 60 * 1000);
  }
}
