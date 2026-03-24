"use client";

import { login } from "./actions";

export default function LoginForm({ error }: { error: boolean }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm w-full max-w-sm">
        <h1 className="text-xl font-bold text-blue-900 mb-1">Admin</h1>
        <p className="text-sm text-blue-600 mb-6">Fixture Universidad Católica</p>
        <form action={login} className="flex flex-col gap-3">
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            autoFocus
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-red-500 text-sm">Contraseña incorrecta.</p>
          )}
          <button
            type="submit"
            className="bg-blue-700 text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
