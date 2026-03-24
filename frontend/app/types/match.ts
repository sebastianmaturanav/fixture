export type Match = {
  id: number;
  opponent_name: string;
  opponent_logo_url: string;
  competition: string;
  match_date: string; // ISO date string "YYYY-MM-DD"
  match_time: string | null; // "HH:MM:SS" or null
  is_home: boolean;
  location: string | null;
};
