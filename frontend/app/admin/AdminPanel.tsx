"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Match } from "../types/match";
import { createMatch, updateMatch, deleteMatch, logout, MatchFormData } from "./actions";
import LogoPicker from "./LogoPicker";

const COMPETITIONS = ["Liga Chilena", "Copa Libertadores", "Copa Chile", "Supercopa de Chile", "Amistoso"];

type FormState = {
  opponent_name: string;
  opponent_logo_url: string;
  competition: string;
  match_date: string;
  match_time: string;
  is_home: boolean;
  location: string;
};

const emptyForm: FormState = {
  opponent_name: "",
  opponent_logo_url: "",
  competition: "",
  match_date: "",
  match_time: "",
  is_home: true,
  location: "",
};

function matchToForm(m: Match): FormState {
  return {
    opponent_name: m.opponent_name,
    opponent_logo_url: m.opponent_logo_url,
    competition: m.competition,
    match_date: m.match_date,
    match_time: m.match_time?.slice(0, 5) ?? "",
    is_home: m.is_home,
    location: m.location ?? "",
  };
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export default function AdminPanel({ initialMatches }: { initialMatches: Match[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"list" | "new" | "edit">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setMode("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(match: Match) {
    setForm(matchToForm(match));
    setEditingId(match.id);
    setError(null);
    setMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setMode("list");
    setEditingId(null);
    setError(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const data: MatchFormData = {
      opponent_name: form.opponent_name,
      opponent_logo_url: form.opponent_logo_url,
      competition: form.competition,
      match_date: form.match_date,
      match_time: form.match_time || null,
      is_home: form.is_home,
      location: form.location || null,
    };
    if (!data.opponent_logo_url) {
      setError("Selecciona un escudo.");
      return;
    }
    startTransition(async () => {
      try {
        if (mode === "new") {
          await createMatch(data);
        } else if (mode === "edit" && editingId !== null) {
          await updateMatch(editingId, data);
        }
        setMode("list");
        router.refresh();
      } catch {
        setError("Ocurrió un error. Revisa los datos e intenta de nuevo.");
      }
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este partido?")) return;
    startTransition(async () => {
      try {
        await deleteMatch(id);
        router.refresh();
      } catch {
        setError("Error al eliminar.");
      }
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = initialMatches.filter((m) => m.match_date >= today);
  const past = initialMatches.filter((m) => m.match_date < today).reverse();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-blue-900 text-base">Admin — Fixture UC</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openNew}
              disabled={isPending}
              className="bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              + Nuevo partido
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1.5"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Form */}
        {mode !== "list" && (
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
            <h2 className="font-semibold text-blue-900 mb-4">
              {mode === "new" ? "Nuevo partido" : "Editar partido"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Rival *</label>
                  <input
                    name="opponent_name"
                    value={form.opponent_name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Colo-Colo"
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Competencia *</label>
                  <input
                    name="competition"
                    value={form.competition}
                    onChange={handleChange}
                    required
                    list="competitions-list"
                    placeholder="Ej: Liga Chilena"
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="competitions-list">
                    {COMPETITIONS.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Fecha *</label>
                  <input
                    name="match_date"
                    type="date"
                    value={form.match_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Hora (opcional)</label>
                  <input
                    name="match_time"
                    type="text"
                    inputMode="numeric"
                    pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
                    placeholder="HH:MM (ej: 20:30)"
                    value={form.match_time}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1">Estadio (opcional)</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej: Estadio San Carlos"
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      name="is_home"
                      type="checkbox"
                      checked={form.is_home}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    {form.is_home ? "Local" : "Visitante"}
                  </span>
                </div>
              </div>

              {/* Logo picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">Escudo *</label>
                <LogoPicker
                  value={form.opponent_logo_url}
                  onChange={(url) => setForm((prev) => ({ ...prev, opponent_logo_url: url }))}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Guardando…" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Upcoming matches */}
        <MatchSection
          title="Próximos partidos"
          matches={upcoming}
          editingId={editingId}
          isPending={isPending}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

        {/* Past matches */}
        {past.length > 0 && (
          <MatchSection
            title="Partidos pasados"
            matches={past}
            editingId={editingId}
            isPending={isPending}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}

function MatchSection({
  title,
  matches,
  editingId,
  isPending,
  onEdit,
  onDelete,
}: {
  title: string;
  matches: Match[];
  editingId: number | null;
  isPending: boolean;
  onEdit: (m: Match) => void;
  onDelete: (id: number) => void;
}) {
  if (matches.length === 0) return null;
  return (
    <div>
      <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">{title}</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
        {matches.map((match) => (
          <div
            key={match.id}
            className={`flex items-center gap-3 px-4 py-3 ${editingId === match.id ? "bg-blue-50" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.opponent_logo_url}
              alt={match.opponent_name}
              className="w-8 h-8 object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 truncate">{match.opponent_name}</div>
              <div className="text-xs text-gray-500">
                {formatDate(match.match_date)}
                {" · "}
                {match.match_time ? match.match_time.slice(0, 5) : "Por confirmar"}
                {" · "}
                {match.competition}
              </div>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: match.is_home ? "#dbeafe" : "#f3f4f6",
                color: match.is_home ? "#1e3a8a" : "#6b7280",
              }}
            >
              {match.is_home ? "Local" : "Visita"}
            </span>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(match)}
                disabled={isPending}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(match.id)}
                disabled={isPending}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
