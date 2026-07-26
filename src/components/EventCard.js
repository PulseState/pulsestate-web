import Link from "next/link";
import { formatDate, formatTime } from "@/lib/format";

export default function EventCard({ event }) {
  const { id, title, location, event_date, event_time, age_limit, price, banner_url, profiles } = event;

  return (
    <Link
      href={`/events/${id}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:-translate-y-1 hover:border-accentpink/40"
    >
      <div
        className="flex h-36 items-center justify-center bg-card bg-cover bg-center text-3xl text-white/30"
        style={banner_url ? { backgroundImage: `url(${banner_url})` } : undefined}
      >
        {!banner_url && "♪"}
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-base font-medium">{title}</h3>
        <p className="mb-3 text-sm text-white/50">
          {location} · {formatDate(event_date)} · {formatTime(event_time)}
        </p>
        <div className="flex items-center justify-between text-sm text-white/50">
          <span>{age_limit > 0 ? `${age_limit}+` : "Alle Altersgruppen"}</span>
          <span>{price || "Gratis"}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/10">
            {profiles?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profiles.avatar_url} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <span className="truncate text-xs text-white/40">{profiles?.company_name || "Pulsestate"}</span>
        </div>
      </div>
    </Link>
  );
}
