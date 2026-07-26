# Pulsestate — Web MVP

Next.js + Tailwind Umsetzung von Design 1 (Dark Nightlife). Enthält: Startseite, Event-Übersicht,
Event-Detail, Login/Register (nur Ansicht), Unternehmer-Dashboard (Mock-Daten).

Alle Events kommen aktuell aus `src/lib/events.js` (Mock-Daten). Sobald Supabase angebunden ist,
werden diese durch echte Datenbankabfragen ersetzt.

## 1. Lokal starten (optional)

Nur nötig, wenn du selbst am Code weiterarbeiten willst. Voraussetzung: Node.js installiert.

```
npm install
npm run dev
```

Danach lokal unter http://localhost:3000 erreichbar.

## 2. Auf GitHub bringen

Im Projektordner (dort, wo diese README liegt):

```
git init
git add .
git commit -m "Pulsestate web MVP"
git branch -M main
git remote add origin https://github.com/<dein-username>/pulsestate-web.git
git push -u origin main
```

Das Repo `pulsestate-web` vorher leer auf GitHub anlegen (ohne README/gitignore, sonst gibt's einen
Konflikt beim ersten Push).

## 3. Auf Vercel deployen

1. Auf vercel.com mit GitHub-Account einloggen.
2. "Add New Project" → das `pulsestate-web` Repo auswählen → Import.
3. Vercel erkennt Next.js automatisch, keine Einstellungen nötig → Deploy.
4. Unter Project Settings → Domains → `pulsestate.at` hinzufügen und die angezeigten DNS-Einträge
   bei deinem Domain-Registrar setzen.

## 4. Supabase später anbinden

1. Auf supabase.com ein neues Projekt anlegen.
2. Project Settings → API → `Project URL` und `anon public key` kopieren.
3. Lokal `.env.local.example` zu `.env.local` kopieren und beide Werte eintragen.
4. Bei Vercel dieselben zwei Variablen unter Project Settings → Environment Variables eintragen.
5. `src/lib/supabaseClient.js` ist bereits vorbereitet — sobald die Variablen gesetzt sind, liefert
   `supabase` einen aktiven Client statt `null`.

## Hinweis zum Build

Dieses Projekt wurde in einer Sandbox ohne npm-Registry-Zugriff erstellt — `npm install` /
`npm run build` konnten hier nicht automatisch verifiziert werden. Der Code folgt Standard-Next.js-
Konventionen (App Router); ein `npm run build` läuft normalerweise ohne Anpassungen durch, sowohl
lokal als auch automatisch bei Vercel. Falls doch ein Fehler auftaucht, schick mir einfach die
Fehlermeldung.
