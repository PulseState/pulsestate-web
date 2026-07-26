import { Space_Grotesk, Inter } from "next/font/google";
import MaintenanceGate from "@/components/MaintenanceGate";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata = {
  metadataBase: new URL("https://pulsestate.at"),
  title: {
    default: "Pulsestate — Spür den Puls deiner Stadt",
    template: "%s · Pulsestate",
  },
  description:
    "Events entdecken, bewerten und nach der Party in Kontakt bleiben — Salzburg und bald überall.",
  openGraph: {
    title: "Pulsestate — Spür den Puls deiner Stadt",
    description: "Events entdecken, bewerten und nach der Party in Kontakt bleiben.",
    url: "https://pulsestate.at",
    siteName: "Pulsestate",
    locale: "de_AT",
    type: "website",
  },
  themeColor: "#0d0d12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-ink font-sans text-white/90 antialiased">
        <MaintenanceGate>{children}</MaintenanceGate>
      </body>
    </html>
  );
}
