"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

function calculateAge(birthdateStr) {
  const birthdate = new Date(birthdateStr);
  if (Number.isNaN(birthdate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");

  // Privatnutzer-Felder
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  // Unternehmer-Felder
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");

  // gemeinsam
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

    if (role === "user") {
      const age = calculateAge(birthdate);
      if (age === null) {
        setError("Bitte gib ein gültiges Geburtsdatum an.");
        return;
      }
      if (age < 16) {
        setError("Du musst mindestens 16 Jahre alt sein, um dich zu registrieren.");
        return;
      }
    }

    const metadata =
      role === "user"
        ? {
            role: "user",
            display_name: username,
            username,
            first_name: firstName,
            last_name: lastName,
            birthdate,
          }
        : {
            role: "business",
            display_name: companyName,
            company_name: companyName,
            first_name: contactName,
            contact_email: email,
          };

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
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

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50";
  const labelClass = "mb-1 block text-xs text-white/50";

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
          {role === "user" ? (
            <>
              <div>
                <label className={labelClass}>Nutzername</label>
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="dein_nutzername"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelClass}>Vorname</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Vorname"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Nachname</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nachname"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Geburtsdatum (ab 16 Jahren)</label>
                <input
                  type="date"
                  required
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>E-Mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@beispiel.at"
                  className={inputClass}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelClass}>Unternehmensname</label>
                <input
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="z. B. Republic Club"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Name (Ansprechpartner:in)</label>
                <input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Vor- und Nachname"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Kontakt-E-Mail (auch für den Login)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kontakt@deinbusiness.at"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Passwort</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
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
