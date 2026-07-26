import { Space_Grotesk, Inter } from "next/font/google";
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
  title: "Pulsestate — Spür den Puls deiner Stadt",
  description: "Events entdecken, bewerten und nach der Party in Kontakt bleiben.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-ink font-sans text-white/90 antialiased">{children}</body>
    </html>
  );
}
