"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function RatingsSection({ eventId }) {
  const [session, setSession] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoadingList(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    supabase
      .from("ratings")
      .select("id, stars, comment, created_at, profiles(display_name)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!fetchError) setRatings(data || []);
        setLoadingList(false);
      });
  }, [eventId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!session) {
      setError("Bitte zuerst anmelden.");
      return;
    }

    setSubmitting(true);
    const { error: submitError } = await supabase.from("ratings").upsert({
      event_id: eventId,
      user_id: session.user.id,
      stars,
      comment,
    });
    setSubmitting(false);

    if (submitError) {
      setError(submitError.message);
      return;
    }

    setDone(true);
  }

  if (!supabase) {
    return (
      <p className="text-sm text-white/40">
        Bewertungen sind aktiv, sobald Supabase eingerichtet ist (siehe README).
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-white/40">Bewertungen</h2>

        {loadingList ? (
          <p className="text-sm text-white/40">Lädt…</p>
        ) : ratings.length === 0 ? (
          <p className="text-sm text-white/40">Noch keine Bewertungen — sei die erste Person.</p>
        ) : (
          <div className="space-y-3">
            {ratings.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-card p-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{r.profiles?.display_name || "Anonym"}</span>
                  <span className="text-amber-400">★ {r.stars}</span>
                </div>
                {r.comment && <p className="text-sm text-white/60">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-white/40">Deine Bewertung</h2>

        {!session ? (
          <p className="text-sm text-white/40">
            <Link href="/login" className="text-accentpink hover:underline">
              Melde dich an
            </Link>
            , um eine Bewertung abzugeben.
          </p>
        ) : done ? (
          <p className="text-sm text-emerald-400">Danke für deine Bewertung.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setStars(n)}
                  className={`text-xl ${n <= stars ? "text-amber-400" : "text-white/20"}`}
                  aria-label={`${n} Sterne`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Wie war's?"
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Einen Moment…" : "Bewertung abschicken"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
