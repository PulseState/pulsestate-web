"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

function MaintenanceScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 font-display text-2xl font-bold tracking-tight">
        pulse
        <span className="bg-gradient-to-r from-accentpink to-accentpurple bg-clip-text text-transparent">
          state
        </span>
      </div>
      <h1 className="mb-3 font-display text-xl font-semibold text-white">Wir sind gerade im Wartungsmodus</h1>
      <p className="mb-10 max-w-sm text-sm text-white/50">
        Pulsestate wird gerade aktualisiert. Schau in Kürze wieder vorbei.
      </p>
      <a href="/login" className="text-xs text-white/25 hover:text-white/50 hover:underline">
        Admin-Login
      </a>
    </div>
  );
}

export default function MaintenanceGate({ children }) {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(!MAINTENANCE_MODE);

  useEffect(() => {
    if (!MAINTENANCE_MODE || !supabase) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();
      if (profile?.role === "admin") setAllowed(true);
    });
  }, []);

  if (!MAINTENANCE_MODE) return children;

  // /login muss immer erreichbar bleiben, sonst kann sich niemand mehr einloggen,
  // um den Wartungsmodus als Administrator zu umgehen.
  if (pathname === "/login") return children;

  if (allowed) return children;

  return <MaintenanceScreen />;
}
