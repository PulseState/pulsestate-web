"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoleBadge from "@/components/RoleBadge";
import { supabase } from "@/lib/supabaseClient";

export default function RatingsSection({ eventId }) {
  const [session, setSession] = useState(null);
  const [profileRole, setProfileRole] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [myRatingId, setMyRatingId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    if (!supabase) {
      setLoadingList(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);

    if (sessionData.session) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.session.user.id)
        .single();
      setProfileRole(prof?.role || "user");
    }

    const { data, error: fetchError } = await supabase
      .from("ratings")
      .select("id, stars, comment, user_id, profiles(display_name, role)")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (!fetchError) {
      setRatings(data || []);
      if (sessionData.session) {
        const mine = (data || []).find((r) => r.user_id === sessionData.session.user.id);
        if (mine) {
          setMyRatingId(mine.id);
          setStars(mine.stars);
          setComment(mine.comment || "");
          setEditing(false);
        } else {
          setEditing(true);
        }
      }
    }
    setLoadingList(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!session) {
      setError("Bitte zuerst anmelden.");
      return;
    }

    setSubmitting(true);
    const { data, error: submitError } = await supabase
      .from("ratings")
      .upsert(
        { event_id: eventId, user_id: session.user.id, stars, comment },
        { onConflict: "event_id,user_id" }
      )
      .select()
      .single();
    setSubmitting(false);

    if (submitError) {
      setError(submitError.message);
      return;
    }

    setMyRatingId(data.id);
    setEditing(false);
    load();
  }

  async function handleDeleteMine() {
    if (!myRatingId) return;
    if (!confirm("Deine Bewertung wirklich löschen?")) return;
    await supabase.from("ratings").delete().eq("id", myRatingId);
    setMyRatingId(null);
    setStars(5);
    setComment("");
    setEditing(true);
    load();
  }

  async function handleDeleteOther(id) {
    if (!confirm("Diese Bewertung wirklich löschen?")) return;
    await supabase.from("ratings").delete().eq("id", id);
    load();
  }

  const isStaff = profileRole === "admin" || profileRole === "moderator";

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
            {ratings.map((r) => {
              const isMine = session && r.user_id === session.user.id;
              const canDelete = isMine || isStaff;
              return (
                <div key={r.id} className="rounded-xl border border-white/10 bg-card p-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      {r.profiles?.display_name || "Anonym"}
                      <RoleBadge role={r.profiles?.role} />
                    </span>
                    <span className="text-amber-400">★ {r.stars}</span>
                  </div>
                  {r.comment && <p className="mb-2 text-sm text-white/60">{r.comment}</p>}
                  {canDelete && (
                    <button
                      onClick={() => (isMine ? handleDeleteMine() : handleDeleteOther(r.id))}
                      className="text-xs text-red-400 hover:underline"
                    >
                      {isMine ? "Löschen" : "Löschen (Moderation)"}
                    </button>
                  )}
                </div>
              );
            })}
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
        ) : !editing ? (
          <div className="flex items-center gap-3">
            <span className="text-amber-400">★ {stars}</span>
            <span className="text-sm text-white/50">{comment}</span>
            <button onClick={() => setEditing(true)} className="text-xs text-accentpink hover:underline">
              Bearbeiten
            </button>
            <button onClick={handleDeleteMine} className="text-xs text-red-400 hover:underline">
              Löschen
            </button>
          </div>
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
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-6 py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "Einen Moment…" : myRatingId ? "Bewertung aktualisieren" : "Bewertung abschicken"}
              </button>
              {myRatingId && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:border-white/40"
                >
                  Abbrechen
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
