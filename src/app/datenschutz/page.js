import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-14 text-sm leading-relaxed text-white/70">
        <h1 className="mb-8 font-display text-3xl font-bold text-white">Datenschutzerklärung</h1>

        <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
          Diese Vorlage beschreibt, welche Daten die Pulsestate-Plattform technisch verarbeitet. Sie ersetzt keine
          rechtliche Prüfung — bitte von einer rechtskundigen Person (insbesondere wegen Nutzerinnen und Nutzern
          ab 16 Jahren) gegenlesen lassen, bevor die Seite live geht. [DEIN NAME / FIRMENNAME] als Verantwortlicher
          gemäß Art. 4 Nr. 7 DSGVO einsetzen.
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">1. Verantwortlicher</h2>
        <p className="mb-4">
          Angaben im {" "} zu finden.
          <a href="/impressum" className="text-accentpink hover:underline">
            Impressum
          </a>
          .
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">2. Welche Daten wir verarbeiten</h2>
        <p className="mb-2">Bei der Registrierung und Nutzung von Pulsestate verarbeiten wir folgende Daten:</p>
        <p className="mb-1">
          Privatnutzer: E-Mail-Adresse, Nutzername, Vor- und Nachname, Geburtsdatum (zur Altersprüfung ab 16
          Jahren), optional Profilbild und Biographie.
        </p>
        <p className="mb-1">
          Unternehmer: Kontakt-E-Mail, Unternehmensname, Ansprechpartner:in, optional Banner, Profilbild,
          Biographie und Standortadressen.
        </p>
        <p className="mb-4">
          Bewertungen: Sterne-Bewertung und Kommentartext, verknüpft mit deinem Profil und dem bewerteten Event.
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">3. Hosting und Auftragsverarbeiter</h2>
        <p className="mb-2">
          Die Website läuft auf Vercel (Vercel Inc.). Datenbank, Login und Datei-Uploads laufen über Supabase
          (Supabase Inc.). [Region bei der Supabase-Projekterstellung eintragen, z. B. EU/Frankfurt.] Mit beiden
          Anbietern ist ein Auftragsverarbeitungsvertrag abzuschließen bzw. deren Standardvertragsklauseln gelten,
          sofern Daten außerhalb der EU verarbeitet werden.
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">4. Cookies und lokale Speicherung</h2>
        <p className="mb-4">
          Für den Login wird ein technisch notwendiges Sitzungs-Token im Browser gespeichert (kein
          Tracking-Cookie). Es findet aktuell kein Analyse- oder Marketing-Tracking statt.
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">5. Deine Rechte</h2>
        <p className="mb-4">
          Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten
          sowie auf Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Wende dich dafür an
          [KONTAKT-EMAIL]. Du hast außerdem das Recht, dich bei der österreichischen Datenschutzbehörde
          (dsb.gv.at) zu beschweren.
        </p>

        <h2 className="mb-2 mt-8 font-display text-lg font-semibold text-white">6. Löschung deines Accounts</h2>
        <p className="mb-4">
          Auf Anfrage an [KONTAKT-EMAIL] werden dein Profil, deine Bewertungen und hochgeladenen Bilder gelöscht,
          soweit keine gesetzliche Aufbewahrungspflicht entgegensteht.
        </p>

        <p className="mt-10 text-xs text-white/30">
          Stand: Platzhalter-Vorlage. Vor Veröffentlichung durch eine rechtskundige Person prüfen lassen.
        </p>
      </section>
      <Footer />
    </main>
  );
}
