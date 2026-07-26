import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <main>
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <h1 className="mb-2 font-display text-2xl font-bold">Account erstellen</h1>
        <p className="mb-8 text-sm text-white/50">Kostenlos für User und Unternehmer.</p>

        <div className="mb-6 flex w-full rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <span className="flex-1 rounded-full bg-gradient-to-r from-accentpink to-accentpurple py-2 text-center font-medium">
            Privatnutzer
          </span>
          <span className="flex-1 py-2 text-center text-white/50">Unternehmer</span>
        </div>

        <form className="w-full space-y-4">
          <div>
            <label className="mb-1 block text-xs text-white/50">Name</label>
            <input
              type="text"
              placeholder="Dein Name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">E-Mail</label>
            <input
              type="email"
              placeholder="du@beispiel.at"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Passwort</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-accentpink to-accentpurple py-3 text-sm font-medium"
          >
            Account erstellen
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50">
          Schon dabei?{" "}
          <Link href="/login" className="text-accentpink hover:underline">
            Anmelden
          </Link>
        </p>

        <p className="mt-8 max-w-sm text-center text-xs text-white/30">
          Hinweis: Registrierung ist noch nicht mit Supabase verbunden — dieses Formular ist aktuell reine Ansicht.
        </p>
      </section>

      <Footer />
    </main>
  );
}
