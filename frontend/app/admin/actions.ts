"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Match } from "../types/match";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

async function checkAuth() {
  const store = await cookies();
  const pwd = getAdminPassword();
  if (!pwd || store.get("admin_auth")?.value !== pwd) {
    throw new Error("Unauthorized");
  }
}

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  const expected = getAdminPassword();
  if (expected && password === expected) {
    const store = await cookies();
    store.set("admin_auth", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect("/admin");
  }
  redirect("/admin?error=1");
}

export async function logout() {
  const store = await cookies();
  store.delete("admin_auth");
  redirect("/admin");
}

export async function getAllMatches(): Promise<Match[]> {
  await checkAuth();
  const res = await fetch(`${API_URL}/matches?all=true`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener partidos");
  return res.json();
}

export type MatchFormData = {
  opponent_name: string;
  opponent_logo_url: string;
  competition: string;
  match_date: string;
  match_time: string | null;
  is_home: boolean;
  location: string | null;
};

export async function createMatch(data: MatchFormData) {
  await checkAuth();
  const res = await fetch(`${API_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear partido");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateMatch(id: number, data: MatchFormData) {
  await checkAuth();
  const res = await fetch(`${API_URL}/matches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar partido");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteMatch(id: number) {
  await checkAuth();
  const res = await fetch(`${API_URL}/matches/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar partido");
  revalidatePath("/admin");
  revalidatePath("/");
}
