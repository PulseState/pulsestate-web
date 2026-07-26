import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events } from "@/lib/events";

const myEvents = events.slice(0, 2);

export default function BusinessPage() {
  return (
    <main>
      <Navbar />

      <section className="px-6 py-14 md:px-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-1 font-display text-3xl font-bold">Unternehmer-Dashboard</h1>
            <p className="text-sm text-white/50">Republic Club · Salzburg</p>
          </div>
          <button className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium">
            + Neues Event erstellen
          </button>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Events live", value: "2" },
            { label: "Views (7 Tage)", value: "1.240" },
            { label: "Ø Bewertung", value: "4.4" },
            { label: "Interessenten", value: "86" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-card p-5">
              <p className="mb-1 text-xs text-white/40">{stat.label}</p>
              <p className="font-display text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-xs uppercase tracking-widest text-white/40">Meine Events</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/40">
              <tr>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Datum</th>
                <th className="px-5 py-3 font-medium">Bewertung</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {myEvents.map((event) => (
                <tr key={event.id} className="border-t border-white/10">
                  <td className="px-5 py-4">{event.title}</td>
                  <td className="px-5 py-4 text-white/60">{event.date}</td>
                  <td className="px-5 py-4 text-amber-400">★ {event.rating}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-accentpurple/20 px-3 py-1 text-xs text-accentpurple">
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-lg text-xs text-white/30">
          Hinweis: Dashboard zeigt aktuell Beispieldaten. Sobald Supabase angebunden ist, laufen hier eure echten
          Events und Statistiken auf.
        </p>
      </section>

      <Footer />
    </main>
  );
}
