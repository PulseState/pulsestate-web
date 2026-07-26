import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-white/40">
      <p className="mb-2">© 2026 Pulsestate.at — Salzburg</p>
      <div className="flex items-center justify-center gap-4 text-xs">
        <Link href="/impressum" className="hover:text-white/70">
          Impressum
        </Link>
        <Link href="/datenschutz" className="hover:text-white/70">
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}
