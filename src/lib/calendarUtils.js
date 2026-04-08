import { dateKey } from "./dateHelpers";

export const THEMES = [
  { color: "#3d5a73", name: "Ocean" },
  { color: "#5a4d6a", name: "Violet" },
  { color: "#3d6b5c", name: "Forest" },
  { color: "#a84848", name: "Rose" },
  { color: "#b8923a", name: "Amber" },
];

export const HOLIDAYS = {
  "2025-01-01": "New Year",
  "2025-01-26": "Republic Day",
  "2025-03-25": "Holi",
  "2025-04-14": "Ambedkar Jayanti",
  "2025-08-15": "Independence Day",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-20": "Diwali",
  "2025-12-25": "Christmas",
  "2026-01-01": "New Year",
  "2026-01-26": "Republic Day",
  "2026-03-14": "Holi",
  "2026-04-14": "Ambedkar Jayanti",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-11-08": "Diwali",
  "2026-12-25": "Christmas",
};

const MONTH_SLUGS = [
  "jan","feb","mar","apr","may","jun",
  "jul","aug","sep","oct","nov","dec",
];

export const getMonthImagePath = (monthIndex, extension = "png") =>
  `/images/${MONTH_SLUGS[monthIndex]}.${extension}`;

export const getMonthImageCandidates = (monthIndex) => [
  getMonthImagePath(monthIndex, "png"),
  getMonthImagePath(monthIndex, "jpg"),
  getMonthImagePath(monthIndex, "jpeg"),
];

export const PLACEHOLDER_IMAGE = "/images/placeholder.png";
export const PLACEHOLDER_IMAGE_CANDIDATES = [
  "/images/placeholder.png",
  "/images/placeholder.jpg",
  "/images/placeholder.jpeg",
];

export function buildCells(year, month) {
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const cells = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    cells.push({
      day,
      month: prevMonth,
      year: prevYear,
      other: true,
      key: dateKey(prevYear, prevMonth, day),
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, month, year, other: false, key: dateKey(year, month, day) });
  }
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    cells.push({
      day,
      month: nextMonth,
      year: nextYear,
      other: true,
      key: dateKey(nextYear, nextMonth, day),
    });
  }

  return cells;
}

export function getRangeMeta(cellDate, rangeStart, rangeEnd) {
  if (!rangeStart) return { inRange: false, isStart: false, isEnd: false };

  const effectiveEnd = rangeEnd || rangeStart;
  const start = rangeStart <= effectiveEnd ? rangeStart : effectiveEnd;
  const end = rangeStart <= effectiveEnd ? effectiveEnd : rangeStart;

  const t = cellDate.getTime();
  const inRange = t >= start.getTime() && t <= end.getTime();
  const isStart = t === start.getTime();
  const isEnd = t === end.getTime();

  return { inRange, isStart, isEnd };
}
