import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";

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

      <AuthButtons />
    </nav>
  );
}
