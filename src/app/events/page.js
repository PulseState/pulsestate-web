import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/events";

export default function EventsPage() {
  return (
    <main>
      <Navbar />

      <section className="px-6 pb-8 pt-14 md:px-12">
        <h1 className="mb-2 font-display text-3xl font-bold">Events in Salzburg</h1>
        <p className="mb-8 text-sm text-white/50">
          {events.length} Events gefunden. Filter nach Datum, Kategorie und Preis folgen in einer späteren Version.
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {["Alle", "Heute", "Diese Woche", "Gratis", "Party Challenge"].map((filter, i) => (
            <span
              key={filter}
              className={`rounded-full border px-4 py-1.5 text-xs ${
                i === 0
                  ? "border-transparent bg-gradient-to-r from-accentpink to-accentpurple font-medium"
                  : "border-white/15 text-white/60"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
