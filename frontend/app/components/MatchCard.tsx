import { Match } from "../types/match";

function buildGoogleCalendarUrl(match: Match): string {
  const title = encodeURIComponent(
    match.is_home ? `UC vs ${match.opponent_name}` : `${match.opponent_name} vs UC`
  );
  const details = encodeURIComponent(
    `${match.competition} · ${match.is_home ? "Local" : "Visitante"}`
  );
  const location = match.location ? encodeURIComponent(match.location) : "";

  let dates: string;
  if (match.match_time) {
    const [h, m] = match.match_time.split(":");
    const start = `${match.match_date.replace(/-/g, "")}T${h}${m}00`;
    const endHour = String(Number(h) + 2).padStart(2, "0");
    const end = `${match.match_date.replace(/-/g, "")}T${endHour}${m}00`;
    dates = `${start}/${end}`;
  } else {
    const dateStr = match.match_date.replace(/-/g, "");
    const nextDay = new Date(match.match_date + "T12:00:00");
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = `${nextDay.getFullYear()}${String(nextDay.getMonth() + 1).padStart(2, "0")}${String(nextDay.getDate()).padStart(2, "0")}`;
    dates = `${dateStr}/${endStr}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function formatDate(dateStr: string): string {
  // Append time to avoid UTC midnight off-by-one in negative-UTC timezones
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "Por confirmar";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export default function MatchCard({ match }: { match: Match }) {
  const isTentative = match.match_time === null;
  const bgColor = match.is_home ? "#1d4ed8" : "#bfdbfe";
  const textColor = match.is_home ? "#ffffff" : "#1e3a8a";

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-3 sm:p-4"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: isTentative ? `2px dashed ${match.is_home ? "#93c5fd" : "#1d4ed8"}` : "none",
      }}
    >
      {/* Logo */}
      <div style={{ width: 56, height: 56, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={match.opponent_logo_url}
          alt={`Escudo ${match.opponent_name}`}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base sm:text-lg leading-tight">{match.opponent_name}</span>
          {isTentative && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: match.is_home ? "#1e40af" : "#1d4ed8",
                color: "#ffffff",
              }}
            >
              ?
            </span>
          )}
        </div>
        <div className="text-sm mt-0.5 capitalize">{formatDate(match.match_date)}</div>
        <div className="text-sm">{formatTime(match.match_time)}</div>
        {match.location && (
          <div className="text-xs mt-0.5 opacity-80">{match.location}</div>
        )}
      </div>

      {/* Right badges */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: match.is_home ? "#1e40af" : "#1d4ed8",
            color: "#ffffff",
          }}
        >
          {match.competition}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: match.is_home ? "#dbeafe" : "#1d4ed8",
            color: match.is_home ? "#1e3a8a" : "#ffffff",
          }}
        >
          {match.is_home ? "Local" : "Visitante"}
        </span>
        <a
          href={buildGoogleCalendarUrl(match)}
          target="_blank"
          rel="noopener noreferrer"
          title="Agregar a Google Calendar"
          style={{
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 6,
            backgroundColor: match.is_home ? "rgba(255,255,255,0.15)" : "rgba(29,78,216,0.12)",
            color: match.is_home ? "#ffffff" : "#1e3a8a",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          📅 Google Cal
        </a>
      </div>
    </div>
  );
}
