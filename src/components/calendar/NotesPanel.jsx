import "./NotesPanel.css";
import { useState } from "react";
import { fmtRange, isSameDay, normaliseRange, fmtDate, dateKey } from "../../lib/dateHelpers";

export default function NotesPanel({
  rangeStart, rangeEnd, notes, onSave, onDelete, onClear,
}) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const rangeLabel = fmtRange(rangeStart, rangeEnd);
  const canSave = text.trim().length > 0 && rangeStart != null;

  const handleSave = () => {
    if (!canSave) return;
    const { start, end } = normaliseRange(rangeStart, rangeEnd);
    const label = isSameDay(start, end)
      ? fmtDate(start)
      : `${fmtDate(start)} — ${fmtDate(end)}`;

    onSave({
      id: Date.now(),
      text: text.trim(),
      label,
      startKey: dateKey(start.getFullYear(), start.getMonth(), start.getDate()),
      endKey: dateKey(end.getFullYear(), end.getMonth(), end.getDate()),
    });
    setText("");
  };

  return (
    <div className="notes-panel">
      <div className="notes-label">NOTES</div>

      <div className="notes-range-label">{rangeLabel}</div>

      <textarea
        className={`notes-textarea${focused ? " focused" : ""}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Add a note…"
      />

      <div className="notes-button-row">
        <button onClick={onClear} className="notes-clear-btn">Clear</button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`notes-save-btn${canSave ? "" : " disabled"}`}
        >
          Save note
        </button>
      </div>

      <div className="notes-label">SAVED NOTES</div>

      <div className="notes-list">
        {notes.length === 0
          ? <div className="notes-empty">No notes yet</div>
          : notes.slice(0, 10).map((n) => (
            <div key={n.id} className="notes-item">
              <div className="notes-item-body">
                <div className="notes-item-date">{n.label}</div>
                <div className="notes-item-text">{n.text}</div>
              </div>
              <button aria-label="Delete note" onClick={() => onDelete(n.id)} className="notes-delete-btn">✕</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
