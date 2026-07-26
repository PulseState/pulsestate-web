"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function NewEventPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [ageLimit, setAgeLimit] = useState("0");
  const [price, setPrice] = useState("");
  const [drinkMenu, setDrinkMenu] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();
        setProfile(profileData);
      }
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!session) {
      setError("Bitte zuerst anmelden.");
      return;
    }

    setSaving(true);

    let bannerUrl = null;
    if (bannerFile) {
      const ext = bannerFile.name.split(".").pop();
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("event-media").upload(path, bannerFile);
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      bannerUrl = supabase.storage.from("event-media").getPublicUrl(path).data.publicUrl;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("events")
      .insert({
        business_id: session.user.id,
        title,
        location,
        event_date: eventDate,
        event_time: eventTime,
        age_limit: parseInt(ageLimit, 10),
        price: price || "Gratis",
        drink_menu: drinkMenu || null,
        banner_url: bannerUrl,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/events/${inserted.id}`);
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-accentpink/50";
  const labelClass = "mb-1 block text-xs text-white/50";

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

  if (checking) {
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
        <section className="px-6 py-20 text-center text-sm text-white/50">Bitte zuerst anmelden.</section>
        <Footer />
      </main>
    );
  }

  if (profile && profile.role !== "business" && profile.role !== "admin") {
    return (
      <main>
        <Navbar />
        <section className="px-6 py-20 text-center text-sm text-white/50">
          Nur Unternehmer-Accounts können Events erstellen.
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-lg px-6 py-14">
        <h1 className="mb-8 font-display text-2xl font-bold">Neues Event erstellen</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Titel</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ort</label>
            <input required value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Datum</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Uhrzeit</label>
              <input
                type="time"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Alterseinlass</label>
              <select value={ageLimit} onChange={(e) => setAgeLimit(e.target.value)} className={inputClass}>
                <option value="0">Keine Beschränkung</option>
                <option value="16">Ab 16</option>
                <option value="18">Ab 18</option>
                <option value="21">Ab 21</option>
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Kosten</label>
              <input
                placeholder="z. B. 12 € oder Gratis"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Getränkekarte (optional)</label>
            <textarea
              placeholder="z. B. Bier 4€, Longdrink 8€…"
              value={drinkMenu}
              onChange={(e) => setDrinkMenu(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Banner / Logo</label>
            {bannerPreview && (
              <div
                className="mb-2 h-32 w-full rounded-xl border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerPreview})` }}
              />
            )}
            <label className="inline-block cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/40">
              Bild hochladen
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-accentpink to-accentpurple py-3 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Erstellt…" : "Event veröffentlichen"}
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
