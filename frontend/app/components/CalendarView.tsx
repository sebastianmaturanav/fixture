"use client";

import { useState, useMemo, useEffect } from "react";
import { Match } from "../types/match";
import MatchCard from "./MatchCard";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];


const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
  gap: "4px",
};

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Week starts Monday: getDay() 0=Sun..6=Sat → Mon=0..Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function CalendarView({ matches, holidays: holidayList }: { matches: Match[]; holidays: string[] }) {
  const today = new Date();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const [viewDate, setViewDate] = useState(() => {
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstMatch = matches.find(
      (m) => new Date(m.match_date + "T12:00:00") >= currentMonthStart
    );
    if (firstMatch) {
      const d = new Date(firstMatch.match_date + "T12:00:00");
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return currentMonthStart;
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const holidays = useMemo(
    () => new Set(Array.isArray(holidayList) ? holidayList : []),
    [holidayList]
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);

  const monthLabel = viewDate.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const matchesByDate = new Map<string, Match[]>();
  for (const match of matches) {
    if (!matchesByDate.has(match.match_date)) matchesByDate.set(match.match_date, []);
    matchesByDate.get(match.match_date)!.push(match);
  }

  const selectedMatches = selectedKey ? (matchesByDate.get(selectedKey) ?? []) : [];

  function handleDayClick(date: Date) {
    const key = toDateKey(date);
    if (!matchesByDate.has(key)) return;
    setSelectedKey((prev) => (prev === key ? null : key));
  }

  function goToPrev() {
    setSelectedKey(null);
    setViewDate(new Date(year, month - 1, 1));
  }

  function goToNext() {
    setSelectedKey(null);
    setViewDate(new Date(year, month + 1, 1));
  }

  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <button
          onClick={goToPrev}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "transparent", cursor: "pointer", fontSize: 22,
            color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ‹
        </button>
        <h2 style={{ fontWeight: 600, fontSize: isMobile ? 16 : 18, color: "#1e3a8a", textTransform: "capitalize" }}>
          {monthLabel}
        </h2>
        <button
          onClick={goToNext}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "transparent", cursor: "pointer", fontSize: 22,
            color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ ...gridStyle, gap: 0, marginBottom: 4 }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center", fontSize: 12, fontWeight: 500,
              color: "#93c5fd", paddingTop: 4, paddingBottom: 4,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div style={gridStyle}>
        {days.map((date, i) => {
          if (!date) return <div key={i} style={{ minHeight: isMobile ? 44 : 56 }} />;

          const key = toDateKey(date);
          const dayMatches = matchesByDate.get(key) ?? [];
          const hasMatch = dayMatches.length > 0;
          const selected = selectedKey === key;
          const today = isToday(date);
          const holiday = holidays.has(key);

          return (
            <div
              key={i}
              onClick={() => handleDayClick(date)}
              style={{
                minHeight: isMobile ? 44 : 56,
                borderRadius: 8,
                padding: isMobile ? 3 : 6,
                cursor: hasMatch ? "pointer" : "default",
                backgroundColor: selected ? "#1d4ed8" : hasMatch ? "#eff6ff" : "#f9fafb",
                boxSizing: "border-box",
              }}
            >
              {/* Day number */}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: today
                    ? selected ? "#ffffff" : "#1d4ed8"
                    : "transparent",
                  color: today
                    ? selected ? "#1d4ed8" : "#ffffff"
                    : holiday
                    ? (selected ? "#fca5a5" : "#dc2626")
                    : selected
                    ? "#ffffff"
                    : "#6b7280",
                }}
              >
                {date.getDate()}
              </div>

              {/* Match logos */}
              {dayMatches.map((match) => (
                <div key={match.id} style={{ marginBottom: 2 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={match.opponent_logo_url}
                    alt={match.opponent_name}
                    title={match.opponent_name}
                    style={{
                      width: "100%",
                      height: isMobile ? 24 : 32,
                      objectFit: "contain",
                      display: "block",
                      opacity: selected ? 0.9 : 1,
                    }}
                  />
                  {!isMobile && (
                    <div style={{
                      fontSize: 9,
                      fontWeight: 700,
                      textAlign: "center",
                      marginTop: 2,
                      padding: "1px 4px",
                      borderRadius: 3,
                      backgroundColor: match.is_home
                        ? (selected ? "#ffffff" : "#1d4ed8")
                        : (selected ? "#bfdbfe" : "#bfdbfe"),
                      color: match.is_home
                        ? (selected ? "#1d4ed8" : "#ffffff")
                        : "#1e3a8a",
                      letterSpacing: "0.03em",
                    }}>
                      {match.is_home ? "LOCAL" : "VISITA"}
                    </div>
                  )}
                  {!isMobile && (
                    <div style={{
                      fontSize: 8,
                      fontWeight: 500,
                      textAlign: "center",
                      marginTop: 2,
                      padding: "1px 3px",
                      borderRadius: 3,
                      backgroundColor: selected ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)",
                      color: selected ? "#ffffff" : "#6b7280",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      letterSpacing: "0.02em",
                    }}>
                      {match.competition}
                    </div>
                  )}
                  {/* Símbolo de estado */}
                  {!isMobile && (
                    <div style={{
                      fontSize: 8,
                      fontWeight: 700,
                      textAlign: "center",
                      marginTop: 2,
                      padding: "1px 4px",
                      borderRadius: 3,
                      backgroundColor: match.match_time
                        ? (selected ? "rgba(255,255,255,0.25)" : "#dcfce7")
                        : (selected ? "rgba(255,255,255,0.15)" : "#fef9c3"),
                      color: match.match_time
                        ? (selected ? "#bbf7d0" : "#166534")
                        : (selected ? "#fde68a" : "#854d0e"),
                      letterSpacing: "0.02em",
                    }}>
                      {match.match_time
                        ? match.match_time.slice(0, 5)
                        : "◷ Por confirmar"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedMatches.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{
            fontSize: 12, fontWeight: 600, color: "#2563eb",
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12,
          }}>
            {new Date(selectedKey! + "T12:00:00").toLocaleDateString("es-MX", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
