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

  // Group by country (only when not searching)
  const countries = [...new Set(filtered.map((l) => l.country))];

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // Close on outside click
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
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 border border-gray-400 rounded-lg px-3 py-2 text-sm text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {selected ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.path} alt={selected.name} className="w-7 h-7 object-contain flex-shrink-0" />
            <span className="flex-1 text-gray-900 font-medium">{selected.name}</span>
            <span className="text-xs text-gray-400">{selected.country}</span>
          </>
        ) : (
          <span className="text-gray-400 flex-1">Seleccionar escudo…</span>
        )}
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar equipo o país…"
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo grid */}
          <div className="overflow-y-auto max-h-64 p-2 space-y-3">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin resultados</p>
            )}
            {countries.map((country) => {
              const logos = filtered.filter((l) => l.country === country);
              return (
                <div key={country}>
                  {!search.trim() && (
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">
                      {country}
                    </p>
                  )}
                  <div className="grid grid-cols-4 gap-1">
                    {logos.map((logo) => (
                      <button
                        key={logo.path}
                        type="button"
                        onClick={() => {
                          onChange(logo.path);
                          setOpen(false);
                        }}
                        title={logo.name}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                          value === logo.path ? "bg-blue-100 ring-2 ring-blue-400" : ""
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.path}
                          alt={logo.name}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-xs text-gray-600 text-center leading-tight line-clamp-2">
                          {logo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear option */}
          {value && (
            <div className="border-t border-gray-100 p-2">
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="w-full text-xs text-gray-400 hover:text-red-500 text-center py-1"
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
