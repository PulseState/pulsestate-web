import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-white/70">
        <h1 className="mb-8 font-display text-3xl font-bold text-white">Impressum</h1>

        

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">Angaben gemäß § 5 ECG</h2>
        <p className="mb-1">Florian Basedow</p>
        <p className="mb-1">Mauracherstraße 6</p>
        <p className="mb-1">5020, Salzburg, Österreich</p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">Kontakt</h2>
        <p className="mb-1">E-Mail: administration@pulsestate.at</p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">Streitschlichtung</h2>
        <p className="mb-4">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            className="text-accentpink hover:underline"
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen. [ANPASSEN, falls das nicht zutrifft.]
        </p>

        <p className="mt-10 text-xs text-white/30">
          Hinweis: Dieser Text ist eine Vorlage und keine Rechtsberatung. Lass die finalen Angaben — vor allem bei
          Registrierung von Minderjährigen ab 16 Jahren und Verarbeitung von Nutzerdaten — von einer
          rechtskundigen Person prüfen.
        </p>
      </section>
      <Footer />
    </main>
  );
}
