export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const WEEKDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export const pad = (n) => String(n).padStart(2, "0");

export const dateKey = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

export const fmtDate = (date) =>
  date
    ? `${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`
    : "";

export const isSameDay = (a, b) =>
  a != null &&
  b != null &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

export const normaliseRange = (a, b) => {
  if (!a) return { start: null, end: null };
  if (!b) return { start: a, end: a };
  return a <= b ? { start: a, end: b } : { start: b, end: a };
};

export const fmtRange = (rangeStart, rangeEnd) => {
  if (!rangeStart) return "Select a date range";
  if (!rangeEnd || isSameDay(rangeStart, rangeEnd)) return fmtDate(rangeStart);
  const { start, end } = normaliseRange(rangeStart, rangeEnd);
  return `${fmtDate(start)} — ${fmtDate(end)}`;
};
