"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleBadge from "@/components/RoleBadge";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (!data.session) {
        setLoading(false);
        return;
      }
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
        setBio(profileData.bio || "");
      }
      setLoading(false);
    });
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    let avatarUrl = profile?.avatar_url || null;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${session.user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        first_name: firstName,
        last_name: lastName,
        bio,
        avatar_url: avatarUrl,
        display_name: username || profile?.display_name,
      })
      .eq("id", session.user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Gespeichert.");
    setProfile((p) => ({
      ...p,
      username,
      first_name: firstName,
      last_name: lastName,
      bio,
      avatar_url: avatarUrl,
    }));
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50";
  const labelClass = "mb-1 block text-xs text-white/50";

  if (!supabase) {
    return (
      <main>
        <Navbar />
        <section className="mx-auto max-w-md px-6 py-20 text-center text-sm text-white/40">
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
        <section className="mx-auto max-w-md px-6 py-20 text-center text-sm text-white/40">Lädt…</section>
        <Footer />
      </main>
    );
  }

  if (!session) {
    return (
      <main>
        <Navbar />
        <section className="mx-auto max-w-md px-6 py-20 text-center text-sm text-white/50">
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

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-md px-6 py-14">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">Profileinstellungen</h1>
          <RoleBadge role={profile?.role} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-card">
              {(avatarPreview || profile?.avatar_url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview || profile.avatar_url}
                  alt="Profilbild"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40">
              Profilbild hochladen
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className={labelClass}>Nutzername</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Vorname</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Nachname</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Biographie</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Geburtsdatum</label>
            <input disabled value={profile?.birthdate || ""} className={`${inputClass} opacity-50`} />
            <p className="mt-1 text-xs text-white/30">Kann aus Sicherheitsgründen nicht geändert werden.</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-accentpink to-accentpurple py-3 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Speichert…" : "Speichern"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
