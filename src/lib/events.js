export const events = [
  {
    id: "rooftop-live-session",
    title: "Rooftop Live Session",
    location: "Republic Club",
    time: "22:00",
    date: "26. Juli 2026",
    rating: "4.6",
    reviews: 128,
    badge: "Party Challenge",
    price: "12 €",
    cover: "from-accentpink to-orange-400",
    icon: "♪",
    description:
      "Live-DJ-Set auf der Dachterrasse des Republic Club mit Blick über die Altstadt. Einlass ab 21:30, Dresscode leger-elegant.",
  },
  {
    id: "altstadt-night-out",
    title: "Altstadt Night Out",
    location: "Shamrock Bar",
    time: "23:00",
    date: "26. Juli 2026",
    rating: "4.2",
    reviews: 64,
    badge: "Gratis Einlass",
    price: "Gratis",
    cover: "from-accentpurple to-indigo-500",
    icon: "✦",
    description:
      "Klassischer Barabend in der Getreidegasse mit Live-Musik ab 23 Uhr. Kein Eintritt, freier Zugang bis Kapazität erreicht ist.",
  },
  {
    id: "sommer-open-air",
    title: "Sommer Open Air",
    location: "Kapitelplatz",
    time: "19:00",
    date: "27. Juli 2026",
    rating: "4.8",
    reviews: 203,
    badge: "Party Challenge",
    price: "8 €",
    cover: "from-teal-400 to-blue-500",
    icon: "◎",
    description:
      "Open-Air-Konzert mit lokalen Bands auf dem Kapitelplatz. Foodtrucks vor Ort, Einlass ab 18 Uhr.",
  },
  {
    id: "warehouse-sessions",
    title: "Warehouse Sessions",
    location: "Halle X",
    time: "23:30",
    date: "1. August 2026",
    rating: "4.4",
    reviews: 91,
    badge: "18+",
    price: "15 €",
    cover: "from-accentpink to-accentpurple",
    icon: "▲",
    description:
      "Underground Electronic Night in der alten Lagerhalle. Zwei Floors, drei DJs, Altersnachweis erforderlich.",
  },
];

export function getEventById(id) {
  return events.find((event) => event.id === id);
}
