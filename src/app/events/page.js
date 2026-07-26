import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { fetchEvents } from "@/lib/eventQueries";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main>
      <Navbar />

      <section className="px-6 pb-8 pt-14 md:px-12">
        <h1 className="mb-2 font-display text-3xl font-bold">Events in Salzburg</h1>
        <p className="mb-8 text-sm text-white/50">
          {supabase ? `${events.length} Events gefunden.` : "Supabase ist noch nicht eingerichtet — siehe README."}{" "}
          Filter nach Datum, Kategorie und Preis folgen in einer späteren Version.
        </p>

        {supabase && events.length === 0 ? (
          <p className="text-sm text-white/40">
            Noch keine Events. Unternehmer können über den Unternehmer-Account eigene Events anlegen.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
