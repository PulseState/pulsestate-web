import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RatingsSection from "@/components/RatingsSection";
import EventActions from "@/components/EventActions";
import { fetchEventById } from "@/lib/eventQueries";
import { formatDate, formatTime } from "@/lib/format";

export const revalidate = 0;

export default async function EventDetailPage({ params }) {
  const event = await fetchEventById(params.id);

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
          className="mb-8 flex h-56 items-center justify-center rounded-3xl bg-card bg-cover bg-center text-5xl text-white/30"
          style={event.banner_url ? { backgroundImage: `url(${event.banner_url})` } : undefined}
        >
          {!event.banner_url && "♪"}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accentpurple/20 px-3 py-1 text-xs font-medium text-accentpurple">
            {event.age_limit > 0 ? `${event.age_limit}+` : "Alle Altersgruppen"}
          </span>
          {event.avgRating && (
            <span className="text-sm text-amber-400">
              ★ {event.avgRating} ({event.ratingCount} Bewertungen)
            </span>
          )}
        </div>

        <h1 className="mb-2 font-display text-3xl font-bold">{event.title}</h1>
        <p className="mb-2 text-sm text-white/50">
          {event.location} · {formatDate(event.event_date)} · {formatTime(event.event_time)} · {event.price || "Gratis"}
        </p>

        <div className="mb-8 flex items-center gap-2">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-white/10">
            {event.profiles?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <span className="text-xs text-white/40">{event.profiles?.company_name || "Pulsestate"}</span>
        </div>

        {event.drink_menu && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-card p-6">
            <h2 className="mb-2 text-xs uppercase tracking-widest text-white/40">Getränkekarte</h2>
            <p className="whitespace-pre-line text-sm text-white/70">{event.drink_menu}</p>
          </div>
        )}

        <div className="mb-10 flex flex-wrap gap-3">
          <button className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium">
            Ich bin dabei
          </button>
          <EventActions eventId={event.id} businessId={event.business_id} />
        </div>

        <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6 text-sm text-white/50">
          Post-Event-Chat und Party-Challenge-Details werden freigeschaltet, sobald du eingecheckt hast.
        </div>

        <RatingsSection eventId={event.id} />
      </section>

      <Footer />
    </main>
  );
}
