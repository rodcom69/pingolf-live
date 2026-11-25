# Pingolf Live

Pinball-golf scoring web app, live at https://playpingolf.com. It's static HTML/JS on GitHub Pages (this repo, `CNAME`) with Firebase Firestore (project `pingolf-95ba1`) as the database. There's no build step: push to `main` and it's live in about a minute. Pages cache for about 10 minutes.

This repo is public, so never commit PINs, secrets or personal details.

## Files
- `course.js`: the courses (holes, targets, ball counts) and the shared scoring code: `scoreRound`, `strokeRanges`/`chartStrokes`, closed-hole helpers, ranking (`compareScores`, `RANK_FINISHED_FIRST`) and event title/dates. **Bump the `?v=` on its `<script>` tag in index.html, admin.html and scoring.html whenever it changes**, or phones keep the old copy.
- `index.html`: the player app. It handles sign-in (name + 4-digit PIN), the scorecard, mulligans, the leaderboard, `#scores` (a shareable scores-only page) and `#tv` (the venue TV board, which shows a QR, pages through players and reloads every 3 hours).
- `admin.html`: the organizer page (PIN-gated) for events, hole closing, editing/voiding/adding scores, PIN resets and moving scores.
- `scoring.html`: the printable scoring chart, hole cards and paper scorecard.
- `manifest.webmanifest`, `sw.js`, `icons/`: the home-screen app (PWA). `sw.js` is network-first (always the latest deploy when online; cache only as an offline fallback) and never touches Firestore. Bump `CACHE` in `sw.js` only if the cache logic itself changes. Icon = flippers under a putting green (Rodney's pick). `icons/icon.svg` and `icons/icon-maskable.svg` (art shrunk for Android's circle crop) are the source; the PNGs are rendered from them with headless Chrome at 512 and resized with `sips`. index.html shows an "Add to Home Screen" tip (iPhone) or Install button (Android); dismissing it is remembered. A home-screen app on iPhone has its own storage, so players sign in once more there. Link-only events have their own app: `basement/manifest.webmanifest` ("Basement", opens ?e=basement-test, its own brick-wall BASEMENT icon `icons/basement*`) and `pincrossing/manifest.webmanifest`; index.html swaps the manifest + iOS title by ?e= (map in the head script).
- Emails: new players must give one on the welcome step; news checkbox (wording per course via `collectEmail.news`, default "Send me Pingolf event news"; X-Golf = "Send me Clubhouse pinball news"). Signed-in players without one get a one-time "Add your email" card (Save / No thanks); the home-screen tip waits until it's done (body.asking-email). Sign-in has a "Forgot your name or PIN?" link: search registered names (fills in the sign-up key), PIN = ask the organizer (admin Reset PIN). "Email me my name and PIN" (top of the Forgot panel) POSTs to a Google Apps Script web app (`apps-script/Code.gs`, project "Pingolf PIN helper" in playpingolf@gmail.com, deployed as Web app / Execute as me / Anyone). It runs as playpingolf@gmail.com, which has Cloud Datastore Viewer (read-only) on the project, and mails the sign-in name + PIN to that address only; same answer either way; 1 email per address per 10 min. To change the script: edit in Apps Script, then Deploy > Manage deployments > edit > New version (the URL stays the same). Saved write-only to `playerContacts/{key}` {email, news, venue, at, proof} in its own batch after sign-in (can never block sign-in). admin.html › Player emails: Sign in with Google (Firebase Auth, Google provider, playpingolf.com authorized) → table + CSV downloads (all, or a venue's news list). The rules allow reading playerContacts only for the organizer's Google account uid.
- `firestore.rules`: the database rules. **Editing this file does nothing until it's published** in Firebase console › Firestore › Rules.

## Data (Firestore)
- `events/{id}` holds:
  - name, location, date, time (string), course, status (`upcoming|open|closed`), test (bool)
  - optional: `hiddenPlayers` (player keys taken off the public boards; scores kept; admin Hide/Show button), `closedHoles` (closed temporarily: no new entries, par unchanged), `removedHoles` (closed permanently: dropped, par goes down), `closesAt` (ms; stops new scores), `rankFinishedFirst`, `note`, `multiCard`
  - Events made by hand in the console must have **every** field the rules check, or admin saves fail.
- `attempts/{id}`: one score each, with playerKey, playerName, hole, strokes, method (`ball|chart`), eventId, ts, plus optional ball, rawScore, mulligan, void, card, editedByAdmin.
- `players/{key}`: `{name}`, the display name. `key` = the lowercased name the player first signed up with. To give someone a longer name, edit only `players/{key}.name` and keep the key, so their PIN still works. Admin "Rename" changes the key and separates the player from their PIN.
- `playerSecrets`, `secrets`, `playerUnlock`, `adminUnlock`: PIN plumbing. The organizer PIN lives in `secrets/admin`. Never type it, store it or put it in code.

## Rules of the game
- Par 3 per hole; strokes come from which ball hit the target, or from a chart when the target is missed (up to 8). Joker Poker is a 5-ball game.
- 2 mulligans, unlocked once every open hole is done. A mulligan replaces a hole only if it's better.
- Entering a hole is two steps: pick Ball 1/2/3 (or "Didn't make it" + final score, shown with commas as typed), then a confirm screen (what, strokes circle, low-score warning, mulligan/fix context) with Save / Change it. Nothing is written until Save.
- A failed save shows a red bar pinned to the bottom naming the hole; scores still unsent after 4s (weak signal) show a "keep Pingolf open" bar. Sign-in is name + PIN + Start. A name nobody has used opens a "Welcome! One more step" screen: shows the name, "I'm <existing name>" buttons for close matches, a REQUIRED email + news checkbox, then Create my player (nothing is written before that). An open event dated today beats a remembered event.
- Players can fix or undo a score only within 2 minutes; after that the organizer fixes it in admin.
- Public boards show first name + last initial. Your own phone and admin show full names.
- `multiCard` events (the Practice Open): after finishing a card, a player can start another, one at a time. Each card is its own board row ("Rodney C. Card 2").

## Events
- `xgolf-2026-11-22`: "Practice Open till Dec 12th", open until Dec 12 noon, multi-card. Best finished card wins.
- `xgolf-2026-12-12`: the Dec 12 tournament at X-Golf Chester Springs, noon. Set it to **Open** in admin on event day; it's hidden from the event list until then. Link: https://playpingolf.com/?e=xgolf-2026-12-12

- `pincrossing-test`: hidden preview for a second venue, PinCrossing (Railroad Street Bar and Grill, Linfield/Limerick PA), course `pincrossing-2026`. It's 11 machines from Pinball Map, alphabetical for now, all 3-ball, with draft targets and name tiles instead of photos. Status open + test: it takes (fake) scores but is link-only. Test events never show in the dropdown or on the bare site. 1 mulligan (course `mulligans: 1`; the default is 2). Share link: https://playpingolf.com/pincrossing (redirects to ?e=pincrossing-test) · chart: https://playpingolf.com/scoring.html?course=pincrossing-2026&e=pincrossing-test
- `basement-test`: Rodney's private home course, course `basement-2026` (5 machines: Batman 66, Harry Potter CE, JAWS Premium, SW: Fall of the Empire CE, King Kong Premium), 1 mulligan, hard targets (~tournament-winning on 3 balls). Test event = link-only. Link: https://playpingolf.com/basement (redirects to ?e=basement-test). The event doc is created in admin › New event (needs the organizer PIN). Art: IPDB had none of these. FotE and HP Collectors Edition are from Pinside (`img/sw-fall-of-the-empire.jpg`, `img/harry-potter-ce.jpg`); JAWS and King Kong reuse PinCrossing `pc-*`; Batman 66 Catwoman is cropped from Rodney's own photo (`img/batman-66-catwoman.jpg`).
- Each course in `course.js` has `brand` and `place` for the page header.

## Working notes
- Rodney handles DNS changes and types the organizer PIN himself.
- Changing what plays on the X-Golf TV (AbleSign) needs Rodney's go-ahead each time.
- Scores are backed up nightly to Excel on Rodney's MacBook Air (`~/Pingolf Backups`). The script is in `~/Library/Application Support/Pingolf/`.
