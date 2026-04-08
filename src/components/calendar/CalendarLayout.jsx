import "./CalendarLayout.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { THEMES } from "../../lib/calendarUtils";
import HeroPanel from "./HeroPanel";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import CalendarCover from "./CalendarCover";

export default function CalendarLayout() {
  const today = new Date();

  const [calendarRevealed, setCalendarRevealed] = useState(false);

  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverRangeEnd, setHoverRangeEnd] = useState(null);
  const selecting = useRef(false);

  const [notes, setNotes] = useLocalStorage("walcal_notes_v2", []);

  const [theme, setTheme] = useState(THEMES[0]);
  const setThemeVars = useCallback((hexColor) => {
    const cleanHex = hexColor.replace("#", "");
    const value = cleanHex.length === 3
      ? cleanHex.split("").map((char) => `${char}${char}`).join("")
      : cleanHex;
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);

    document.documentElement.style.setProperty("--cal-accent", hexColor);
    document.documentElement.style.setProperty("--cal-accent-rgb", `${r}, ${g}, ${b}`);
  }, []);

  useEffect(() => {
    setThemeVars(theme.color);
  }, [theme.color, setThemeVars]);


  const [uploadedImagesByMonth, setUploadedImagesByMonth] = useState({});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const stop = () => {
      selecting.current = false;
      setHoverRangeEnd(null);
    };
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  const [animClass, setAnimClass] = useState("");
  const animTimer = useRef(null);
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const touchStart = useRef({ x: 0, y: 0, active: false, swipeIntent: false });

  const triggerAnim = (dir) => {
    clearTimeout(animTimer.current);
    setAnimClass(dir === 1 ? "calendar-flip-next" : "calendar-flip-prev");
    animTimer.current = setTimeout(() => setAnimClass(""), 360);
  };

  const changeMonth = useCallback((dir) => {
    triggerAnim(dir);
    setCurMonth((m) => {
      const next = m + dir;
      if (next > 11) {
        setCurYear((y) => y + 1);
        return 0;
      }
      if (next < 0) {
        setCurYear((y) => y - 1);
        return 11;
      }
      return next;
    });
  }, []);

  const goToday = useCallback(() => {
    setCurYear(today.getFullYear());
    setCurMonth(today.getMonth());
  }, []);

  const handleDayMouseDown = (date) => {
    setRangeStart(date);
    setRangeEnd(date);
    setHoverRangeEnd(null);
    selecting.current = true;
  };
  const handleDayMouseEnter = (date) => {
    if (selecting.current) setHoverRangeEnd(date);
  };
  const handleDayMouseUp = (date) => {
    setRangeEnd(date);
    setHoverRangeEnd(null);
    selecting.current = false;
  };

  const handleGridTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      active: true,
      swipeIntent: false,
    };
  };

  const handleGridTouchMove = (event) => {
    const state = touchStart.current;
    if (!state.active) return;

    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - state.x;
    const deltaY = touch.clientY - state.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!state.swipeIntent && absX > 12 && absX > absY + 6) {
      state.swipeIntent = true;
      touchStart.current = state;
    }

    if (state.swipeIntent) {
      if (event.cancelable) event.preventDefault();
      const limitedOffset = Math.max(-48, Math.min(48, deltaX * 0.4));
      setSwipeOffsetX(limitedOffset);
    }
  };

  const handleGridTouchEnd = () => {
    const state = touchStart.current;
    if (!state.active) return;

    const threshold = 28;
    if (state.swipeIntent) {
      if (swipeOffsetX <= -threshold) changeMonth(1);
      if (swipeOffsetX >= threshold) changeMonth(-1);
    }

    touchStart.current = { x: 0, y: 0, active: false, swipeIntent: false };
    setSwipeOffsetX(0);
  };

  const handleSaveNote = (note) => setNotes((prev) => [note, ...prev]);
  const handleDeleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const handleClear = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoverRangeEnd(null);
  };

  const handleThemeChange = (t) => {
    setTheme(t);
    setThemeVars(t.color);
  };

  const handleMonthImageChange = useCallback((imageUrl) => {
    setUploadedImagesByMonth((prev) => ({
      ...prev,
      [curMonth]: imageUrl,
    }));
  }, [curMonth]);

  const splitLayoutClass = isMobile ? "calendar-split mobile" : "calendar-split desktop";

  if (!calendarRevealed) {
    return <CalendarCover onOpen={() => setCalendarRevealed(true)} />;
  }

  return (
    <div className="calendar-shell">
      <div className="calendar-card">
        <div className={splitLayoutClass}>
          <HeroPanel
            month={curMonth}
            uploadedUrl={uploadedImagesByMonth[curMonth] || null}
            onImageChange={handleMonthImageChange}
          />
          {!isMobile && (
            <CalendarHeader
              year={curYear}
              month={curMonth}
              theme={theme}
              isMobile={false}
              onThemeChange={handleThemeChange}
              onPrev={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
              onToday={goToday}
            />
          )}
        </div>

        {isMobile && (
          <CalendarHeader
            year={curYear}
            month={curMonth}
            theme={theme}
            isMobile
            onThemeChange={handleThemeChange}
            onPrev={() => changeMonth(-1)}
            onNext={() => changeMonth(1)}
            onToday={goToday}
          />
        )}

        <div className="calendar-divider" />

        <div className={splitLayoutClass}>
          <CalendarGrid
            year={curYear}
            month={curMonth}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hoverRangeEnd={hoverRangeEnd}
            isSelecting={selecting.current}
            notes={notes}
            animClass={animClass}
            swipeOffsetX={swipeOffsetX}
            onGridTouchStart={handleGridTouchStart}
            onGridTouchMove={handleGridTouchMove}
            onGridTouchEnd={handleGridTouchEnd}
            onDayMouseDown={handleDayMouseDown}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseUp={handleDayMouseUp}
          />
          <NotesPanel
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            notes={notes}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
}
