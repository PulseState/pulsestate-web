const ROLE_STYLES = {
  admin: { label: "Administrator", className: "bg-red-500/15 text-red-300 border-red-500/40" },
  moderator: { label: "Moderator", className: "bg-blue-500/15 text-blue-300 border-blue-500/40" },
  supporter: { label: "Supporter", className: "bg-teal-500/15 text-teal-300 border-teal-500/40" },
  team: { label: "Team", className: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  business: {
    label: "Unternehmer",
    className: "bg-accentpink/15 text-accentpink border-accentpink/40",
  },
};

export default function RoleBadge({ role }) {
  const style = ROLE_STYLES[role];
  if (!style) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}
