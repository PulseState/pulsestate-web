import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { fetchEvents } from "@/lib/eventQueries";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

export default async function Home() {
  const todaysEvents = await fetchEvents(3);

  return (
    <main>
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-28 text-center">
        <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-accentpurple/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-accentpink/20 blur-3xl" />

        <h1 className="relative mx-auto mb-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Spür den Puls deiner Stadt
        </h1>
        <p className="relative mx-auto mb-9 max-w-md text-lg text-white/60">
          Events entdecken, bewerten und nach der Party in Kontakt bleiben — Salzburg und bald überall.
        </p>

        <form
          action="/events"
          className="relative mx-auto flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 sm:flex-row"
        >
          <input
            name="city"
            placeholder="Stadt, z. B. Salzburg"
            className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />
          <input
            name="when"
            placeholder="Heute Abend"
            className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />
          <button className="rounded-xl bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium">
            Suchen
          </button>
        </form>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <p className="mb-5 text-xs uppercase tracking-widest text-white/40">Heute in Salzburg</p>

        {!supabase ? (
          <p className="text-sm text-white/40">Supabase ist noch nicht eingerichtet — siehe README.</p>
        ) : todaysEvents.length === 0 ? (
          <p className="text-sm text-white/40">
            Noch keine Events. Unternehmer können über den Unternehmer-Account eigene Events anlegen.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {todaysEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <div className="mx-6 mb-16 flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-white/10 bg-gradient-to-r from-accentpurple/15 to-accentpink/15 p-8 md:mx-12 md:p-10">
        <div>
          <h3 className="mb-1 font-display text-xl font-semibold">Du veranstaltest Events?</h3>
          <p className="text-sm text-white/60">
            Listing ist kostenlos — kein Setup-Aufwand, keine Grundgebühr.
          </p>
        </div>
        <a
          href="/business"
          className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium"
        >
          Unternehmer-Account erstellen
        </a>
      </div>

      <Footer />
    </main>
  );
}
