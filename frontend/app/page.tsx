import { Match } from "./types/match";
import CalendarView from "./components/CalendarView";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function getMatches(): Promise<Match[]> {
  const res = await fetch(`${API_URL}/matches`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch matches");
  return res.json();
}

async function getHolidays(): Promise<string[]> {
  const res = await fetch(`${API_URL}/holidays`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch holidays");
  const data: { date: string }[] = await res.json();
  return data.map((h) => h.date);
}

export default async function Home() {
  const [matches, holidays] = await Promise.all([getMatches(), getHolidays()]);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Próximos Partidos</h1>
        <p className="text-blue-600 font-medium mt-1">Universidad Católica</p>
      </div>
      {matches.length === 0 ? (
        <p className="text-gray-500">No hay partidos próximos registrados.</p>
      ) : (
        <CalendarView matches={matches} holidays={holidays} />
      )}
    </main>
  );
}
