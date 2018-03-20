import { DateTime } from 'luxon';

export default function date() {
  const tmp = document.createElement('input');
  tmp.setAttribute('type', 'date');
  tmp.setAttribute('value', '1970-01-01');

  if (Number.isNaN(tmp.valueAsNumber)) {
    Object.defineProperties(Reflect.getPrototypeOf(tmp), {
      valueAsDate: {
        get() {
          return !this.value ? null : DateTime
            .fromFormat(this.value, this.format)
            .toJSDate();
        },
        set(value) {
          this.value = DateTime
            .fromJSDate(value)
            .toFormat(this.format);
        }
      },
      valueAsNumber: {
        get() {
          return !this.value ? NaN : this.valueAsDate.valueOf();
        },
        set(value) {
          this.valueAsDate = new Date(value);
        }
      }
    });
  }
}
