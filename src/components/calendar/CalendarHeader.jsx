import "./CalendarHeader.css";
import { MONTHS } from "../../lib/dateHelpers";
import { THEMES } from "../../lib/calendarUtils";

export default function CalendarHeader({
  year, month, theme, isMobile,
  onThemeChange, onPrev, onNext, onToday,
}) {
  const panelClass = isMobile ? "calendar-header-panel mobile" : "calendar-header-panel";

  return (
    <div className={panelClass}>
      <div className="calendar-title-group">
        <div className="calendar-month-name">{MONTHS[month].toUpperCase()}</div>
        <div className="calendar-year">{year}</div>
        <div className="calendar-theme-row">
          {THEMES.map((t) => (
            <button
              key={t.color}
              aria-label={`Theme: ${t.name}`}
              onClick={() => onThemeChange(t)}
              className={`calendar-theme-dot theme-${t.name.toLowerCase()}${t.color === theme.color ? " active" : ""}`}
            />
          ))}
        </div>
      </div>
      <div className="calendar-nav-row">
        <button aria-label="Previous month" onClick={onPrev} className="calendar-nav-btn">
          &#8249;
        </button>
        <button
          aria-label="Today"
          onClick={onToday}
          className="calendar-nav-btn calendar-nav-today"
        >
          Today
        </button>
        <button aria-label="Next month" onClick={onNext} className="calendar-nav-btn">
          &#8250;
        </button>
      </div>
    </div>
  );
}
