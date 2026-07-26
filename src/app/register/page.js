"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!supabase) {
      setError("Supabase ist noch nicht eingerichtet (.env.local fehlt).");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, role } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setInfo("Fast geschafft — bitte bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben.");
    }
  }

  return (
    <main>
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <h1 className="mb-2 font-display text-2xl font-bold">Account erstellen</h1>
        <p className="mb-8 text-sm text-white/50">Kostenlos für User und Unternehmer.</p>

        <div className="mb-6 flex w-full rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 rounded-full py-2 text-center font-medium transition ${
              role === "user" ? "bg-gradient-to-r from-accentpink to-accentpurple" : "text-white/50"
            }`}
          >
            Privatnutzer
          </button>
          <button
            type="button"
            onClick={() => setRole("business")}
            className={`flex-1 rounded-full py-2 text-center font-medium transition ${
              role === "business" ? "bg-gradient-to-r from-accentpink to-accentpurple" : "text-white/50"
            }`}
          >
            Unternehmer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/50">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>
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
          {info && <p className="text-sm text-emerald-400">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-accentpink to-accentpurple py-3 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Einen Moment…" : "Account erstellen"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50">
          Schon dabei?{" "}
          <Link href="/login" className="text-accentpink hover:underline">
            Anmelden
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
