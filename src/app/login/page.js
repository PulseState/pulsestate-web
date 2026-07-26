import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <main>
      <Navbar />

      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <h1 className="mb-2 font-display text-2xl font-bold">Willkommen zurück</h1>
        <p className="mb-8 text-sm text-white/50">Melde dich an, um Events zu bewerten und zu chatten.</p>

        <form className="w-full space-y-4">
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
            Anmelden
          </button>
        </form>

        <p className="mt-6 text-sm text-white/50">
          Noch keinen Account?{" "}
          <Link href="/register" className="text-accentpink hover:underline">
            Registrieren
          </Link>
        </p>

        <p className="mt-8 max-w-sm text-center text-xs text-white/30">
          Hinweis: Login ist noch nicht mit Supabase verbunden — dieses Formular ist aktuell reine Ansicht.
        </p>
      </section>

      <Footer />
    </main>
  );
}
