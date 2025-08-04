export function DdayCounter(due_time: string) {
  const today = new Date();
  const diffTime = new Date(due_time).getTime() - today.getTime();
  const time = Math.max(diffTime, 0);
  const MS_IN_SECOND = 1000;
  const MS_IN_MINUTE = MS_IN_SECOND * 60;
  const MS_IN_HOUR = MS_IN_MINUTE * 60;
  const MS_IN_DAY = MS_IN_HOUR * 24;
  const d = Math.ceil(time / MS_IN_DAY);
  const h = Math.ceil((time % MS_IN_DAY) / MS_IN_HOUR);
  const m = Math.ceil((time % MS_IN_HOUR) / MS_IN_MINUTE);

  const toDigit = (n: number) => n.toString().padStart(2, "0");

  const timeDigit = [...toDigit(d), ...toDigit(h), ...toDigit(m)];

  return timeDigit;
}
