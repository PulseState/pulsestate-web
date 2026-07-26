# Pulsestate — Web MVP

Next.js + Tailwind Umsetzung von Design 1 (Dark Nightlife). Enthält: Startseite, Event-Übersicht,
Event-Detail mit Bewertungssystem (bearbeiten/löschen), echtes Login/Registrierung (Supabase Auth,
getrennte Felder für Privatnutzer/Unternehmer, 16+ Prüfung), Profileinstellungen für beide
Account-Typen inkl. Bild-Upload, echtes Event-CRUD für Unternehmer (inkl. Löschen durch
Moderator/Administrator), Rollen-System mit farbigen Badges, Impressum/Datenschutz-Platzhalterseiten.

## 1. Supabase-Projekt einrichten (oder bestehendes updaten)

1. Falls noch nicht geschehen: auf [supabase.com](https://supabase.com) ein Projekt anlegen.
2. **SQL Editor** → **New query** → kompletten Inhalt von `supabase-schema.sql` einfügen → **Run**.
   Das Skript ist so geschrieben, dass es auch dann sicher ist, wenn du vorher schon eine ältere
   Version davon ausgeführt hattest — es legt nur an, was noch fehlt. Es legt zusätzlich zu den
   Tabellen auch automatisch die drei Storage-Buckets (`avatars`, `banners`, `event-media`) mit den
   passenden Zugriffsrechten an, dafür musst du im Dashboard nichts manuell klicken.
3. **Project Settings → API Keys**: Project URL und Publishable/anon Key kopieren (siehe unten).

## 2. Env-Variablen (falls noch nicht gesetzt)

Lokal in `.env.local`, bei Vercel unter Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (oder sb_publishable_...)
```

Nach dem Setzen bei Vercel einmal **Redeploy** anstoßen.

## 3. Rollen manuell vergeben (Administrator, Moderator, Supporter, Team)

Es gibt aktuell keine Oberfläche dafür — das machst du direkt in Supabase:

1. Supabase Dashboard → **Table Editor** → Tabelle **profiles**.
2. Zeile der gewünschten Person suchen (über die E-Mail lässt sich das nicht direkt filtern, aber
   `display_name`/`username` sollte helfen — im Zweifel über **Authentication** → **Users** die
   User-ID der Person nachschlagen und danach in `profiles` suchen).
3. In der Spalte **role** den Wert ändern auf `admin`, `moderator`, `supporter`, `team`, `business`
   oder `user`.
4. Speichern — die Person sieht die neue Rolle (Badge + Rechte) beim nächsten Neuladen der Seite.

## 4. Neue Seiten im Überblick

`/profile` — Profileinstellungen für Privatnutzer (Profilbild, Biographie, Name/Nutzername
bearbeiten, Geburtsdatum ist gesperrt).

`/business/profile` — Profileinstellungen für Unternehmer (Banner, Logo, Biographie, mehrere
Standorte verwalten).

`/business/events/new` — Event erstellen (nur für Unternehmer/Administrator-Accounts sichtbar).

`/impressum`, `/datenschutz` — rechtliche Seiten, aktuell mit **Platzhaltern** befüllt (siehe
Hinweis unten).

## 5. Wichtig: Impressum & Datenschutzerklärung

Die beiden Seiten unter `src/app/impressum/page.js` und `src/app/datenschutz/page.js` enthalten
noch Platzhalter wie `[DEIN NAME]`, `[DEINE ADRESSE]`, `[KONTAKT-EMAIL]`. Die musst du durch echte
Angaben ersetzen, bevor die Seite öffentlich läuft — sonst drohen in Österreich Abmahnungen wegen
fehlender Impressumspflicht (§ 5 ECG). Beide Texte sind Vorlagen und keine Rechtsberatung; lass sie
von einer rechtskundigen Person prüfen, besonders wegen der Registrierung ab 16 Jahren und der
verarbeiteten Nutzerdaten.

## 6. Bestätigungsmail branden

`supabase/email-templates/confirm-signup.html` enthält ein gebrandetes HTML-Template. Einbau:
Supabase Dashboard → **Authentication** → **Email Templates** → **Confirm signup** → Inhalt der
Datei in "Message body" einfügen → Speichern. Die Variable `{{ .ConfirmationURL }}` muss dabei
unverändert bleiben.

## 7. Lokal starten (optional)

```
npm install
npm run dev
```

## 8. Änderungen live bringen

```
git add .
git commit -m "Rollen, Profile, echte Events, Impressum/Datenschutz"
git push
```

Vercel deployt bei Push auf `main` automatisch neu.

## Bekannte Einschränkungen / nächste Schritte

`src/lib/events.js` (die alten Mock-Daten) wird nirgends mehr verwendet und kann bei Gelegenheit
gelöscht werden. Die Altersprüfung (16+) läuft aktuell nur clientseitig bei der Registrierung, nicht
serverseitig erzwungen. Rollen werden manuell in Supabase vergeben, es gibt noch keine
Admin-Oberfläche dafür. "Ich bin dabei"-Button, Post-Event-Chat und Party Challenges sind weiterhin
nur als Platzhalter vorhanden.

## Hinweis zum Build

Dieses Projekt wurde in einer Sandbox ohne npm-Registry-Zugriff erstellt — `npm install` /
`npm run build` konnten hier nicht automatisch verifiziert werden. Der Code folgt Standard-Next.js-
Konventionen (App Router); ein `npm run build` läuft normalerweise ohne Anpassungen durch. Falls
doch ein Fehler auftaucht, schick mir einfach die Fehlermeldung.
