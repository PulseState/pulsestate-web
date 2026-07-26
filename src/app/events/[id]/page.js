import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, getEventById } from "@/lib/events";

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export default function EventDetailPage({ params }) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/events" className="mb-6 inline-block text-sm text-white/50 hover:text-white">
          ← Zurück zu allen Events
        </Link>

        <div
          className={`mb-8 flex h-56 items-center justify-center rounded-3xl bg-gradient-to-br text-5xl text-white ${event.cover}`}
        >
          {event.icon}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accentpurple/20 px-3 py-1 text-xs font-medium text-accentpurple">
            {event.badge}
          </span>
          <span className="text-sm text-amber-400">
            ★ {event.rating} ({event.reviews} Bewertungen)
          </span>
        </div>

        <h1 className="mb-2 font-display text-3xl font-bold">{event.title}</h1>
        <p className="mb-8 text-sm text-white/50">
          {event.location} · {event.date} · {event.time} · {event.price}
        </p>

        <p className="mb-10 max-w-xl text-white/70">{event.description}</p>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium">
            Ich bin dabei
          </button>
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm">
            Bewertung schreiben
          </button>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-card p-6 text-sm text-white/50">
          Post-Event-Chat und Party-Challenge-Details werden freigeschaltet, sobald du eingecheckt hast.
        </div>
      </section>

      <Footer />
    </main>
  );
}
