import { supabase } from "@/lib/supabaseClient";

export async function fetchEvents(limit) {
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select("*, profiles(company_name, avatar_url)")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export async function fetchEventById(id) {
  if (!supabase) return null;

  const { data: event, error } = await supabase
    .from("events")
    .select("*, profiles(company_name, avatar_url)")
    .eq("id", id)
    .single();

  if (error || !event) return null;

  const { data: ratings } = await supabase.from("ratings").select("stars").eq("event_id", id);
  const count = ratings?.length || 0;
  const avg = count ? (ratings.reduce((sum, r) => sum + r.stars, 0) / count).toFixed(1) : null;

  return { ...event, avgRating: avg, ratingCount: count };
}
