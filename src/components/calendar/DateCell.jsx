import "./DateCell.css";
import { isSameDay } from "../../lib/dateHelpers";
import { HOLIDAYS, getRangeMeta } from "../../lib/calendarUtils";

export default function DateCell({
  cell, dow, rangeStart, rangeEnd, hoverRangeEnd, isSelecting, notes, today,
  onMouseDown, onMouseEnter, onMouseUp,
}) {
  const cellDate = new Date(cell.year, cell.month, cell.day);
  const { inRange, isStart, isEnd } = getRangeMeta(cellDate, rangeStart, rangeEnd);
  const previewMeta = isSelecting && hoverRangeEnd
    ? getRangeMeta(cellDate, rangeStart, hoverRangeEnd)
    : { inRange: false, isStart: false, isEnd: false };
  const isToday = !cell.other && isSameDay(cellDate, today);
  const isSat = dow === 5;
  const isSun = dow === 6;
  const isSelected = isStart || isEnd;
  const isPreviewSelected = previewMeta.isStart || previewMeta.isEnd;
  const holiday = !cell.other ? HOLIDAYS[cell.key] : null;
  const hasNote = notes.some((n) => n.startKey <= cell.key && cell.key <= n.endKey);

  const toneName = cell.other
    ? "other"
    : isSelected
      ? "selected"
      : isPreviewSelected || isSat
        ? "accent"
        : isSun
          ? "sun"
          : "default";

  const rangeClass = isStart && !isEnd
    ? "range-start"
    : isEnd && !isStart
      ? "range-end"
      : inRange && !isStart && !isEnd
        ? "range-middle"
        : previewMeta.isStart && !previewMeta.isEnd
          ? "range-start"
          : previewMeta.isEnd && !previewMeta.isStart
            ? "range-end"
            : previewMeta.inRange && !previewMeta.isStart && !previewMeta.isEnd
              ? "range-middle"
              : "range-single";

  const cellStateClasses = [
    "calendar-date-cell",
    rangeClass,
    isSelected ? "is-selected" : "",
    inRange ? "is-in-range" : "",
    previewMeta.inRange && !inRange && !isSelected ? "is-preview-range" : "",
    `tone-${toneName}`,
  ].filter(Boolean).join(" ");

  const handlers = cell.other ? {} : {
    onMouseDown: () => onMouseDown(cellDate),
    onMouseEnter: () => onMouseEnter(cellDate),
    onMouseUp: () => onMouseUp(cellDate),
    onTouchStart: () => onMouseDown(cellDate),
    onTouchEnd: () => onMouseUp(cellDate),
  };

  return (
    <div
      {...handlers}
      className={cellStateClasses}
    >
      <div className={`calendar-day-number${isToday && !isSelected ? " is-today" : ""}`}>
        {cell.day}
      </div>

      {hasNote && (
        <div className={`calendar-note-dot${isSelected ? " selected" : ""}`} />
      )}

      {holiday && (
        <div className={`calendar-holiday-label${isSelected ? " selected" : ""}`}>
          {holiday}
        </div>
      )}
    </div>
  );
}
