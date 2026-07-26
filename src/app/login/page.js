"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Supabase ist noch nicht eingerichtet (.env.local fehlt).");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main>
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <h1 className="mb-2 font-display text-2xl font-bold">Willkommen zurück</h1>
        <p className="mb-8 text-sm text-white/50">Melde dich an, um Events zu bewerten und zu chatten.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/50">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@beispiel.at"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Passwort</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-accentpink to-accentpurple py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Einen Moment…" : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50">
          Noch keinen Account?{" "}
          <Link href="/register" className="text-accentpink hover:underline">
            Registrieren
          </Link>
        </p>

        {!supabase && (
          <p className="mt-8 max-w-sm text-center text-xs text-white/30">
            Hinweis: Supabase ist noch nicht verbunden — siehe README für die Einrichtung.
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
}
