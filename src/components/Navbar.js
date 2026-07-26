import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-ink/80 px-6 py-5 backdrop-blur-md md:px-12">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        pulse
        <span className="bg-gradient-to-r from-accentpink to-accentpurple bg-clip-text text-transparent">
          state
        </span>
      </Link>

      <div className="hidden gap-8 text-sm text-white/60 md:flex">
        <Link href="/events" className="hover:text-white">
          Events
        </Link>
        <span className="cursor-default">Locations</span>
        <Link href="/business" className="hover:text-white">
          Für Veranstalter
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40"
        >
          Anmelden
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-5 py-2 text-sm font-medium"
        >
          Registrieren
        </Link>
      </div>
    </nav>
  );
}
