"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EventActions({ eventId, businessId }) {
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      if (data.session.user.id === businessId) {
        setCanDelete(true);
        return;
      }
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();
      if (profileData && ["admin", "moderator"].includes(profileData.role)) {
        setCanDelete(true);
      }
    });
  }, [businessId]);

  async function handleDelete() {
    if (!confirm("Dieses Event wirklich löschen?")) return;
    setDeleting(true);
    await supabase.from("events").delete().eq("id", eventId);
    router.push("/events");
    router.refresh();
  }

  if (!canDelete) return null;

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-full border border-red-500/40 px-6 py-3 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
    >
      {deleting ? "Löscht…" : "Event löschen"}
    </button>
  );
}
