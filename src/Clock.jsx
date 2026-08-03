// src/Clock.jsx
import React, { useEffect, useRef } from "react";

function formatTime(date) {
  // Формат: 15:42:30
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Clock() {
  const ref = useRef();

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      ref.current.title = `Время: ${formatTime(now)}`;
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 12,
        right: 24,
        zIndex: 1100,
        background: "rgba(30,30,40,0.9)",
        color: "#e0e0f0",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        whiteSpace: "nowrap",
        userSelect: "none"
      }}
    >
      Время:
    </div>
  );
}
