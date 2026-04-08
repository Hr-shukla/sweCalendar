import "./CalendarCover.css";
import { useState, useMemo } from "react";
import { PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE_CANDIDATES } from "../../lib/calendarUtils";

export default function CalendarCover({ onOpen }) {
  const [candidateIndex, setCandidateIndex] = useState(0);

  const srcList = useMemo(() => PLACEHOLDER_IMAGE_CANDIDATES, []);
  const src = srcList[candidateIndex] || PLACEHOLDER_IMAGE;

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      className="calendar-cover"
      role="button"
      tabIndex={0}
      aria-label="Open calendar"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="calendar-cover-card">
        <div className="calendar-cover-image-wrap">
          <img
            className="calendar-cover-image"
            src={src}
            alt=""
            draggable={false}
            onError={() => setCandidateIndex((i) => i + 1)}
          />
          <div className="calendar-cover-overlay" />
        </div>
        <div className="calendar-cover-footer">
          <span className="calendar-cover-title">Wall Calendar</span>
          <span className="calendar-cover-hint">Click or tap to open</span>
        </div>
      </div>
    </div>
  );
}
