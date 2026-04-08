import "./CalendarGrid.css";
import { WEEKDAYS } from "../../lib/dateHelpers";
import { buildCells } from "../../lib/calendarUtils";
import DateCell from "./DateCell";

export default function CalendarGrid({
  year, month, rangeStart, rangeEnd, hoverRangeEnd, isSelecting, notes, animClass,
  swipeOffsetX, onGridTouchStart, onGridTouchMove, onGridTouchEnd,
  onDayMouseDown, onDayMouseEnter, onDayMouseUp,
}) {
  const today = new Date();
  const cells = buildCells(year, month);

  const swipeClass =
    swipeOffsetX > 10 ? "swipe-right" : swipeOffsetX < -10 ? "swipe-left" : "swipe-neutral";
  const animClasses = [animClass, swipeClass].filter(Boolean).join(" ");

  return (
    <div className="calendar-grid-wrap">
      <div className="calendar-weekdays-row">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`calendar-weekday${i === 5 ? " saturday" : ""}${i === 6 ? " sunday" : ""}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        className={`calendar-days-grid ${animClasses}`.trim()}
        onTouchStart={onGridTouchStart}
        onTouchMove={onGridTouchMove}
        onTouchEnd={onGridTouchEnd}
        onTouchCancel={onGridTouchEnd}
      >
        {cells.map((cell, idx) => (
          <DateCell
            key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
            cell={cell}
            dow={idx % 7}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hoverRangeEnd={hoverRangeEnd}
            isSelecting={isSelecting}
            notes={notes}
            today={today}
            onMouseDown={onDayMouseDown}
            onMouseEnter={onDayMouseEnter}
            onMouseUp={onDayMouseUp}
          />
        ))}
      </div>
    </div>
  );
}
