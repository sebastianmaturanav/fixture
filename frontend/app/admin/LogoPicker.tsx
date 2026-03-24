"use client";

import { useState, useRef, useEffect } from "react";
import { LOGOS } from "./logos";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function LogoPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = LOGOS.find((l) => l.path === value);

  const filtered = search.trim()
    ? LOGOS.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.country.toLowerCase().includes(search.toLowerCase())
      )
    : LOGOS;

  const countries = [...new Set(filtered.map((l) => l.country))];

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #9ca3af",
          borderRadius: 8,
          padding: "0 12px",
          fontSize: 14,
          background: "white",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {selected ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.path}
              alt={selected.name}
              style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }}
            />
            <span style={{ flex: 1, color: "#111827", fontWeight: 500 }}>{selected.name}</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{selected.country}</span>
          </>
        ) : (
          <span style={{ flex: 1, color: "#9ca3af" }}>Seleccionar escudo…</span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar equipo o país…"
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 14,
                color: "#111827",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Logo grid */}
          <div style={{ overflowY: "auto", maxHeight: 220, padding: 8 }}>
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, padding: "16px 0" }}>
                Sin resultados
              </p>
            )}
            {countries.map((country) => {
              const logos = filtered.filter((l) => l.country === country);
              return (
                <div key={country} style={{ marginBottom: 8 }}>
                  {!search.trim() && (
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0 4px 4px" }}>
                      {country}
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2 }}>
                    {logos.map((logo) => (
                      <button
                        key={logo.path}
                        type="button"
                        onClick={() => { onChange(logo.path); setOpen(false); }}
                        title={logo.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 6,
                          borderRadius: 6,
                          border: value === logo.path ? "2px solid #60a5fa" : "2px solid transparent",
                          background: value === logo.path ? "#eff6ff" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.path}
                          alt={logo.name}
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear */}
          {value && (
            <div style={{ borderTop: "1px solid #f3f4f6", padding: "6px 8px" }}>
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                style={{ width: "100%", fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
