import "./HeroPanel.css";
import { useRef, useState, useMemo, useEffect } from "react";
import {
  getMonthImageCandidates,
  PLACEHOLDER_IMAGE,
  PLACEHOLDER_IMAGE_CANDIDATES,
} from "../../lib/calendarUtils";

export default function HeroPanel({ month, uploadedUrl, onImageChange }) {
  const inputRef = useRef(null);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const fallbackList = useMemo(
    () => [...getMonthImageCandidates(month), ...PLACEHOLDER_IMAGE_CANDIDATES],
    [month],
  );

  useEffect(() => {
    setCandidateIndex(0);
  }, [month, uploadedUrl]);

  const autoSrc = fallbackList[candidateIndex] || PLACEHOLDER_IMAGE;
  const displaySrc = uploadedUrl || autoSrc;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImageChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="hero-panel">
      <img
        src={displaySrc}
        alt="Month hero"
        onError={() => {
          if (uploadedUrl) return;
          setCandidateIndex((prev) => prev + 1);
        }}
        className="hero-panel-image"
      />
      <div className="hero-panel-overlay" />
      <button
        aria-label="Upload hero image"
        onClick={() => inputRef.current?.click()}
        className="hero-panel-upload-btn"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Change image
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hero-panel-file-input"
        onChange={handleFile}
      />
    </div>
  );
}
