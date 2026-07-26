import Link from "next/link";

export default function EventCard({ event }) {
  const { id, title, location, time, rating, badge, cover, icon } = event;

  return (
    <Link
      href={`/events/${id}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:-translate-y-1 hover:border-accentpink/40"
    >
      <div
        className={`flex h-36 items-center justify-center bg-gradient-to-br text-3xl text-white ${cover}`}
      >
        {icon}
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-base font-medium">{title}</h3>
        <p className="mb-4 text-sm text-white/50">
          {location} · {time}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-amber-400">★ {rating}</span>
          <span className="rounded-full bg-accentpurple/20 px-3 py-1 text-xs font-medium text-accentpurple">
            {badge}
          </span>
        </div>
      </div>
    </Link>
  );
}
