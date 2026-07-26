export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}
