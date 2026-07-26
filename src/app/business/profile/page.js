"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleBadge from "@/components/RoleBadge";
import { supabase } from "@/lib/supabaseClient";

export default function BusinessProfilePage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  async function loadLocations(businessId) {
    const { data } = await supabase
      .from("business_locations")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: true });
    setLocations(data || []);
  }

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
        setCompanyName(profileData.company_name || "");
        setContactEmail(profileData.contact_email || "");
        setBio(profileData.bio || "");
      }

      await loadLocations(data.session.user.id);
      setLoading(false);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    let avatarUrl = profile?.avatar_url || null;
    let bannerUrl = profile?.banner_url || null;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${session.user.id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, {
        upsert: true,
      });
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      avatarUrl = `${supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl}?t=${Date.now()}`;
    }

    if (bannerFile) {
      const ext = bannerFile.name.split(".").pop();
      const path = `${session.user.id}/banner.${ext}`;
      const { error: uploadError } = await supabase.storage.from("banners").upload(path, bannerFile, {
        upsert: true,
      });
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      bannerUrl = `${supabase.storage.from("banners").getPublicUrl(path).data.publicUrl}?t=${Date.now()}`;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        company_name: companyName,
        contact_email: contactEmail,
        bio,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        display_name: companyName || profile?.display_name,
      })
      .eq("id", session.user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Gespeichert.");
    setProfile((p) => ({ ...p, company_name: companyName, contact_email: contactEmail, bio, avatar_url: avatarUrl, banner_url: bannerUrl }));
  }

  async function handleAddLocation(e) {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const { error: insertError } = await supabase.from("business_locations").insert({
      business_id: session.user.id,
      label: newLabel || null,
      address: newAddress,
    });
    if (!insertError) {
      setNewLabel("");
      setNewAddress("");
      loadLocations(session.user.id);
    }
  }

  async function handleDeleteLocation(id) {
    await supabase.from("business_locations").delete().eq("id", id);
    loadLocations(session.user.id);
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
      <section className="mx-auto max-w-xl px-6 py-14">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">Unternehmensprofil</h1>
          <RoleBadge role={profile?.role} />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className={labelClass}>Banner</label>
            <div
              className="mb-2 h-28 w-full overflow-hidden rounded-2xl border border-white/10 bg-card bg-cover bg-center"
              style={{
                backgroundImage: `url(${bannerPreview || profile?.banner_url || ""})`,
              }}
            />
            <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40">
              Banner hochladen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBannerFile(file);
                  setBannerPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-card">
              {(avatarPreview || profile?.avatar_url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview || profile.avatar_url}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40">
              Logo hochladen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div>
            <label className={labelClass}>Unternehmensname</label>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kontakt-E-Mail</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Biographie</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} />
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

        <div className="mt-12">
          <h2 className="mb-4 text-xs uppercase tracking-widest text-white/40">Standorte</h2>

          <div className="mb-4 space-y-2">
            {locations.length === 0 && (
              <p className="text-sm text-white/40">Noch keine Standorte hinterlegt.</p>
            )}
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-card px-4 py-3 text-sm"
              >
                <div>
                  {loc.label && <span className="mr-2 font-medium">{loc.label}</span>}
                  <span className="text-white/60">{loc.address}</span>
                </div>
                <button
                  onClick={() => handleDeleteLocation(loc.id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddLocation} className="flex flex-wrap gap-2">
            <input
              placeholder="Bezeichnung (optional, z. B. Hauptstandort)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <input
              placeholder="Adresse"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:border-white/40">
              + Hinzufügen
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
