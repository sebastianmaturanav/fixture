import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import AdminPanel from "./AdminPanel";
import { getAllMatches } from "./actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const isAuthed =
    adminPassword !== "" &&
    cookieStore.get("admin_auth")?.value === adminPassword;

  if (!isAuthed) {
    const params = await searchParams;
    return <LoginForm error={params.error === "1"} />;
  }

  const matches = await getAllMatches();
  return <AdminPanel initialMatches={matches} />;
}
