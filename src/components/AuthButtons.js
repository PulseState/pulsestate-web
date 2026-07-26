"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AuthButtons() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-9 w-40" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-white/60 sm:inline">{session.user.email}</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40"
        >
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40"
      >
        Anmelden
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-gradient-to-r from-accentpink to-accentpurple px-5 py-2 text-sm font-medium"
      >
        Registrieren
      </Link>
    </div>
  );
}
