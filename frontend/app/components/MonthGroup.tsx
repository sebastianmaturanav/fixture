import { Match } from "../types/match";
import MatchCard from "./MatchCard";

function monthLabel(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
}

export default function MonthGroup({ month, matches }: { month: string; matches: Match[] }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold capitalize mb-3 text-blue-900 border-b border-blue-200 pb-1">
        {monthLabel(matches[0].match_date)}
      </h2>
      <div className="flex flex-col gap-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
