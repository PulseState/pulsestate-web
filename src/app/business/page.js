"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleBadge from "@/components/RoleBadge";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/format";

export default function BusinessPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);
    if (!sessionData.session) {
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sessionData.session.user.id)
      .single();
    setProfile(profileData);

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .eq("business_id", sessionData.session.user.id)
      .order("event_date", { ascending: true });
    setEvents(eventsData || []);
    setLoading(false);
  }

  useEffect(() => {
    if (supabase) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id) {
    if (!confirm("Event wirklich löschen?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  }

  if (!supabase) {
    return (
      <main>
        <Navbar />
        <section className="px-6 py-20 text-center text-sm text-white/40">
          Supabase ist noch nicht eingerichtet.
        </section>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <Navbar />
        <section className="px-6 py-20 text-center text-sm text-white/40">Lädt…</section>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main>
        <Navbar />
        <section className="px-6 py-20 text-center text-sm text-white/50">
          Bitte zuerst{" "}
          <Link href="/login" className="text-accentpink hover:underline">
            anmelden
          </Link>
          .
        </section>
        <Footer />
      </main>
    );
  }

  const isStaff = profile?.role === "admin" || profile?.role === "moderator";

  return (
    <main>
      <Navbar />
      <section className="px-6 py-14 md:px-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">Unternehmer-Dashboard</h1>
              <RoleBadge role={profile?.role} />
            </div>
            <p className="text-sm text-white/50">{profile?.company_name || profile?.display_name}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/business/profile"
              className="rounded-full border border-white/20 px-5 py-3 text-sm hover:border-white/40"
            >
              Profil bearbeiten
            </Link>
            <Link
              href="/business/events/new"
              className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-3 text-sm font-medium"
            >
              + Neues Event erstellen
            </Link>
          </div>
        </div>

        <h2 className="mb-4 text-xs uppercase tracking-widest text-white/40">Meine Events</h2>

        {events.length === 0 ? (
          <p className="text-sm text-white/40">Noch keine Events angelegt.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Datum</th>
                  <th className="px-5 py-3 font-medium">Ort</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-white/10">
                    <td className="px-5 py-4">
                      <Link href={`/events/${event.id}`} className="hover:text-accentpink">
                        {event.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-white/60">{formatDate(event.event_date)}</td>
                    <td className="px-5 py-4 text-white/60">{event.location}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleDelete(event.id)} className="text-xs text-red-400 hover:underline">
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isStaff && (
          <p className="mt-6 text-xs text-white/30">
            Als {profile.role === "admin" ? "Administrator" : "Moderator"} kannst du zusätzlich auf jeder
            Event-Detailseite fremde Events löschen.
          </p>
        )}
      </section>
      <Footer />
    </main>
  );
}
