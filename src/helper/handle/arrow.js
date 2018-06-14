import { DateTime } from 'luxon';

export default function handleArrow(route, structure, direction) {
  const meta = route.control[structure.name].meta;

  let begin = DateTime.fromMillis(meta.date.begin);
  let end = DateTime.fromMillis(meta.date.end);

  const [amount, level] = diff(begin, end);

  begin = direction === 'next' ? begin.plus({
    [level]: amount
  }) : begin.minus({
    [level]: amount
  });

  end = begin
    .plus({
      [level]: amount
    })
    .minus({
      day: 1
    })
    .endOf('day');

  meta.date.begin = begin.valueOf();
  meta.date.end = end.valueOf();

  route.control[structure.name].reload();
}

function diff(begin, end) {
  const diffEnd = end
    .startOf('day')
    .plus({ day: 1 });

  const diffYear = diffEnd
    .diff(begin, 'year')
    .toObject();

  const diffMonth = diffEnd
    .diff(begin, 'month')
    .toObject();

  const diffDay = diffEnd
    .diff(begin, 'day')
    .toObject();

  let amount = 0;
  let level = null;

  if (diffYear.years % 1 === 0) {
    amount = diffYear.years;
    level = 'year';
  } else if (diffMonth.months % 1 === 0) {
    amount = diffMonth.months;
    level = 'month';
  } else {
    amount = diffDay.days;
    level = 'day';
  }

  return [amount, level];
}
