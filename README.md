# Pulsestate — Web MVP

Next.js + Tailwind Umsetzung von Design 1 (Dark Nightlife). Enthält: Startseite, Event-Übersicht,
Event-Detail mit echtem Bewertungssystem, echten Login/Registrierung (Supabase Auth),
Unternehmer-Dashboard (Mock-Daten).

Events selbst kommen weiterhin aus `src/lib/events.js` (Mock-Daten) — Login, Registrierung und
Bewertungen laufen bereits über eine echte Supabase-Datenbank, sobald du sie eingerichtet hast.

## 1. Supabase-Projekt einrichten

1. Auf [supabase.com](https://supabase.com) einloggen (GitHub-Login geht auch) und **New Project**
   anlegen. Name z. B. `pulsestate`, Region am besten `Central EU (Frankfurt)`, ein Datenbank-Passwort
   setzen (merken, brauchst du selten, aber sicher aufheben).
2. Warten, bis das Projekt fertig aufgesetzt ist (dauert 1–2 Minuten).
3. Links im Menü auf **SQL Editor** → **New query**. Den kompletten Inhalt von `supabase-schema.sql`
   (liegt in diesem Projektordner) reinkopieren und **Run** klicken. Das legt die Tabellen `profiles`
   und `ratings` inklusive Berechtigungen an.
4. Links im Menü auf **Project Settings** → **API**. Dort **Project URL** und **anon public** Key
   kopieren.

## 2. Env-Variablen setzen

Lokal: `.env.local.example` zu `.env.local` kopieren und die zwei Werte eintragen:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Bei Vercel: Project Settings → **Environment Variables** → beide Variablen mit denselben Werten
eintragen (Environment: Production and Preview) → **Save**. Danach einmal **Redeploy** anstoßen
(Deployments-Tab → oben rechts bei der letzten Deployment die drei Punkte → Redeploy), damit die
Variablen greifen.

## 3. Lokal starten (optional)

Nur nötig, wenn du selbst am Code weiterarbeiten willst. Voraussetzung: Node.js installiert.

```
npm install
npm run dev
```

Danach lokal unter http://localhost:3000 erreichbar.

## 4. Änderungen live bringen

```
git add .
git commit -m "Supabase Auth + Bewertungen"
git push
```

Vercel deployt bei jedem Push auf `main` automatisch neu.

## Was aktuell schon echt funktioniert

Registrierung (User oder Unternehmer über den Toggle), Login/Logout, Anzeige des eingeloggten
Status in der Navigation, sowie Bewertungen abgeben und anzeigen auf jeder Event-Detailseite
(eine Bewertung pro Person und Event, erneutes Abschicken überschreibt die vorherige).

Falls bei der Registrierung in Supabase unter **Authentication** → **Providers** → **Email** die
Option "Confirm email" aktiviert ist (Standard), muss man nach dem Registrieren erst den
Bestätigungslink in der Mail anklicken, bevor der Login funktioniert.

## Was als Nächstes sinnvoll wäre

Events aus einer echten Tabelle statt `src/lib/events.js` (dann können Unternehmer eigene Events
anlegen), Post-Event-Chat, Party Challenges.

## Hinweis zum Build

Dieses Projekt wurde in einer Sandbox ohne npm-Registry-Zugriff erstellt — `npm install` /
`npm run build` konnten hier nicht automatisch verifiziert werden. Der Code folgt Standard-Next.js-
Konventionen (App Router); ein `npm run build` läuft normalerweise ohne Anpassungen durch, sowohl
lokal als auch automatisch bei Vercel. Falls doch ein Fehler auftaucht, schick mir einfach die
Fehlermeldung.
