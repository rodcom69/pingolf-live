// Pingolf Live: course, scoring rules and Firebase settings shared by the
// scorecard (index.html) and the organizer page (admin.html).
var firebaseConfig = {
  apiKey: "AIzaSyAOL7_VvRNi_qkP3Ldocgatwxbpfk9X5l0",
  authDomain: "pingolf-95ba1.firebaseapp.com",
  projectId: "pingolf-95ba1",
  storageBucket: "pingolf-95ba1.firebasestorage.app",
  messagingSenderId: "883244078388",
  appId: "1:883244078388:web:c124ecf833196aec4b8161"
};

// ---------- Courses ----------
// A course is one venue's machines in walking order, with targets and pictures.
// Each event in the database names the course it uses. To play a new venue (or a
// changed lineup), add a course here; old events keep the course they were played on.
// img = picture file in img/ (named by machine so courses can share them).
var COURSES = {
  'xgolf-2026-12': {
    name: 'X-Golf · 18 machines (Dec 2026)',
    holes: [
      {n:1, name:"Cyclopes", target:200000, label:"200K", img:"cyclopes"},
      {n:2, name:"Mustang", target:50000, label:"50K", img:"mustang-em"},
      {n:3, name:"Wheel of Fortune", target:9000000, label:"9M", img:"wheel-of-fortune"},
      {n:4, name:"Dune", target:100000000, label:"100M", img:"dune"},
      {n:5, name:"Walking Dead", target:75000000, label:"75M", img:"walking-dead"},
      {n:6, name:"SeaWitch", target:400000, label:"400K", img:"seawitch"},
      {n:7, name:"Beatles", target:2000000, label:"2M", img:"beatles"},
      {n:8, name:"Joker Poker", target:175000, label:"175K", img:"joker-poker", balls:5},
      {n:9, name:"Medieval Madness", target:8000000, label:"8M", img:"medieval-madness"},
      {n:10, name:"Uncanny X-Men", target:75000000, label:"75M", img:"uncanny-x-men"},
      {n:11, name:"Transformers", target:75000000, label:"75M", img:"transformers"},
      {n:12, name:"John Wick", target:75000000, label:"75M", img:"john-wick"},
      {n:13, name:"Guardians of the Galaxy", target:40000000, label:"40M", img:"guardians"},
      {n:14, name:"Metallica", target:30000000, label:"30M", img:"metallica"},
      {n:15, name:"Ali", target:300000, label:"300K", img:"ali"},
      {n:16, name:"NBA Fast Break", target:60, label:"60", img:"nba-fast-break"},
      {n:17, name:"Game of Thrones", target:75000000, label:"75M", img:"game-of-thrones"},
      {n:18, name:"Black Knight: Sword of Rage", target:60000000, label:"60M", img:"black-knight-sor"}
    ]
  }
};
var DEFAULT_COURSE = 'xgolf-2026-12';
function courseHoles(courseId){ return (COURSES[courseId] || COURSES[DEFAULT_COURSE]).holes; }
// The course of the event being shown. The scorecard swaps it when you pick an event.
var HOLES = courseHoles(DEFAULT_COURSE);
// Two ways the organizer can take a hole out:
//  - closed for now (events/{id}.closedHoles): machine is down. Nobody can enter a
//    score on it, but par stays the same and scores already in still count.
//  - removed for good (events/{id}.removedHoles): skipped for everyone, its scores
//    stop counting, and par drops by 3.
// CLOSED_HOLES = removed (the scoring list); DOWN_HOLES = closed for now.
var CLOSED_HOLES = [], DOWN_HOLES = [];
function useCourse(courseId, removedHoles, downHoles){ HOLES = courseHoles(courseId); CLOSED_HOLES = removedHoles || []; DOWN_HOLES = downHoles || []; }
function isHoleClosed(n, closed){ return (closed || CLOSED_HOLES).indexOf(n) !== -1; }
function isHoleDown(n, down){ return (down || DOWN_HOLES).indexOf(n) !== -1; }
function isHoleShut(n){ return isHoleClosed(n) || isHoleDown(n); }
function openHoleCount(holes, closed){
  return holes.filter(function(h){ return !isHoleClosed(h.n, closed); }).length;
}
function holeImg(h){ return h.img ? 'img/' + h.img + '.jpg' : ''; }

// ---------- Events ----------
// Stored in the database (events/{id}): name, location, date (YYYY-MM-DD), time,
// course, status ('upcoming' | 'open' | 'closed'), test (true for practice events).
// The id is what goes in the link: playpingolf.com/?e=<id>
var STARTER_EVENTS = [
  {id:'test', name:'Test Event', location:'X-Golf, Chester Springs, PA', date:'', time:'', course:'xgolf-2026-12', status:'open', test:true},
  {id:'xgolf-2026-12-12', name:'Pingolf', location:'X-Golf, Chester Springs, PA', date:'2026-12-12', time:'Noon', course:'xgolf-2026-12', status:'upcoming', test:false}
];
var EVENT_STATUSES = ['upcoming', 'open', 'closed'];
// closesAt (ms since 1970) = the event stops taking scores at that moment by itself.
function eventExpired(ev){ return !!(ev && ev.closesAt && Date.now() >= ev.closesAt); }
function eventTakingScores(ev){ return !!ev && ev.status === 'open' && !eventExpired(ev); }
function fmtClosesAt(ev){
  var d = new Date(ev.closesAt);
  return d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}) + ' at ' +
    (d.getHours() === 12 && d.getMinutes() === 0 ? 'noon' : d.toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'}));
}
function fmtEventDate(ev){
  if (!ev.date) return '';
  var p = ev.date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
  return d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric', year:'numeric'});
}
function eventWhen(ev){ return ev.closesAt ? 'open until ' + fmtClosesAt(ev) : [fmtEventDate(ev), ev.time].filter(Boolean).join(' · '); }
function eventTitle(ev){ return (ev.test ? '\ud83e\uddea ' : '') + ev.name + (ev.date && !ev.test && !ev.closesAt ? ' — ' + fmtEventDate(ev) : ''); }
// Newest first, test events last.
function sortEvents(list){
  return list.slice().sort(function(a,b){ return (!!a.test - !!b.test) || (b.date || '').localeCompare(a.date || ''); });
}

var MAX_MULLIGANS = 2, PAR = 3;
function rulesText(holes){
  var n = openHoleCount(holes);
  var five = holes.filter(function(h){ return holeBalls(h) === 5; }).map(function(h){ return h.name; });
  return 'Hit the target on ball 1, 2, or 3 — that\'s your stroke count for the hole (1, 2, or 3). Short of target after 3 balls? Enter your final score and strokes (4–8) are looked up automatically. ' +
    (five.length ? five.join(' and ') + (five.length > 1 ? ' are' : ' is') + ' a 5-ball game: hit the target on ball 4 = 4 strokes, ball 5 = 5; still short after 5 balls = 6–8 strokes. ' : '') +
    'Play all ' + n + ' holes. Once all ' + n + ' are done, you get ' + MAX_MULLIGANS + ' mulligans: pick any game, play it again, and enter the score. It replaces that hole on your card only if it\'s better. Each mulligan must be a different game. Par is 3 per hole (' + (PAR * n) + ' total). Lowest total wins. ' + TIEBREAK_TEXT;
}

// Most games are 3 balls; a hole with balls:5 (Joker Poker) lets ball 4 = 4 and
// ball 5 = 5 strokes. Short of target after the last ball, the final score is
// split into equal bands up to 8 strokes: fifths (4-8) for 3-ball games,
// thirds (6-8) for 5-ball games.
var MAX_STROKES = 8;
function holeBalls(h){ return (h && h.balls) || 3; }
function strokeRanges(target, balls){
  balls = balls || 3;
  var k = MAX_STROKES - balls, out = [], hi = target - 1;
  for (var i = 1; i <= k; i++) {
    var lo = i === k ? 0 : Math.round(target * (k - i) / k);
    out.push({s: balls + i, lo: lo, hi: hi});
    hi = lo - 1;
  }
  return out;
}
function chartStrokes(target, score, balls){
  balls = balls || 3;
  if (score >= target) return balls;
  // Use the same rounded bands the printed chart shows, so they always agree.
  var r = strokeRanges(target, balls);
  for (var i = 0; i < r.length; i++) if (score >= r[i].lo) return r[i].s;
  return MAX_STROKES;
}
function fmtNum(n){ return n.toLocaleString("en-US"); }
function esc(v){
  return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function attemptScoreLabel(a){ return a.method === 'ball' ? ('Ball ' + a.ball) : fmtNum(a.rawScore); }
function playerKey(name){ return name.trim().toLowerCase(); }
// Work out which entry counts on each hole. Each hole has one regular entry
// (the newest, if a double-tap ever saved two). Mulligans are extra entries,
// used in the order played; one replaces its hole only if it took fewer strokes.
// holeCount = holes on the course; closed holes are taken off it here.
// down = holes closed temporarily: they still count, but a player who hasn't played
// one isn't held up by it (mulligans unlock once every open hole is done).
function scoreRound(attempts, holeCount, closed, down){
  closed = closed || CLOSED_HOLES;
  down = down || DOWN_HOLES;
  if (holeCount == null) holeCount = HOLES.length;
  // Only real, distinct hole numbers on this course count as closed.
  var closedHere = closed.filter(function(n, i){ return closed.indexOf(n) === i && n >= 1 && n <= holeCount; });
  holeCount -= closedHere.length;
  attempts = attempts.filter(function(a){ return !a.void; });
  // A mulligan keeps its slot even if its hole is closed later, so closing and
  // reopening a hole never changes which mulligans a player has used.
  var allMulls = attempts.filter(function(a){ return a.mulligan; })
    .sort(function(a,b){ return a.ts - b.ts; }).slice(0, MAX_MULLIGANS);
  attempts = attempts.filter(function(a){ return closedHere.indexOf(a.hole) === -1; });
  var originals = {};
  attempts.forEach(function(a){
    if (a.mulligan) return;
    if (!originals[a.hole] || a.ts > originals[a.hole].ts) originals[a.hole] = a;
  });
  var mulls = allMulls.filter(function(a){ return closedHere.indexOf(a.hole) === -1; });
  var byHole = {};
  Object.keys(originals).forEach(function(k){ byHole[k] = originals[k]; });
  mulls.forEach(function(m){
    if (byHole[m.hole] && m.strokes < byHole[m.hole].strokes) byHole[m.hole] = m;
  });
  var counted = Object.keys(byHole).map(function(k){ return byHole[k]; });
  var total = counted.reduce(function(s,a){ return s + a.strokes; }, 0);
  var thru = Object.keys(originals).length;
  var skippedDown = down.filter(function(n, i){
    return down.indexOf(n) === i && closedHere.indexOf(n) === -1 && !originals[n] && n >= 1 && n <= holeCount + closedHere.length;
  }).length;
  var needed = holeCount - skippedDown;
  return {
    total: total,
    thru: thru,
    complete: thru >= needed,
    needed: needed,
    toPar: total - PAR * counted.length,
    byHole: byHole,
    originals: originals,
    mulls: mulls,
    countedIds: counted.map(function(a){ return a.id; }),
    mulligansUsed: allMulls.length,
    holeCount: holeCount,
    // Tiebreak counts: how many holes took 1, 2 and 3 strokes.
    aces: counted.filter(function(a){ return a.strokes === 1; }).length,
    twos: counted.filter(function(a){ return a.strokes === 2; }).length,
    threes: counted.filter(function(a){ return a.strokes === 3; }).length
  };
}
// Pace check (organizer flag only; nothing is blocked). A real game of pinball takes
// a few minutes, so a card whose player-entered holes average under 2 minutes apart
// is flagged in admin. Entries the organizer added (editedByAdmin) are skipped,
// so paper cards typed in at once aren't flagged. Returns null or {holes, minutes, text}.
var PACE_MIN_SEC_PER_HOLE = 120, PACE_MIN_HOLES = 6;
function paceCheck(attempts){
  var ts = attempts.filter(function(a){ return !a.void && !a.mulligan && !a.editedByAdmin && typeof a.ts === 'number'; })
    .map(function(a){ return a.ts; }).sort(function(x, y){ return x - y; });
  if (ts.length < PACE_MIN_HOLES) return null;
  var spanSec = (ts[ts.length - 1] - ts[0]) / 1000;
  if (spanSec / (ts.length - 1) >= PACE_MIN_SEC_PER_HOLE) return null;
  var mins = Math.max(1, Math.round(spanSec / 60));
  return {holes: ts.length, minutes: mins, text: ts.length + ' holes in ' + mins + ' min'};
}
function fmtPar(n){ return n === 0 ? 'E' : (n > 0 ? '+' + n : String(n)); }
// Lowest to par first. Tiebreak: more holes played, then most aces, most 2s, most 3s.
// Players still level after that share the place (shown as T1, T2...).
var TIEBREAK_TEXT = 'Ties are broken by most aces (1s), then most 2s, then most 3s. Still tied = shared place.';
// Events with rankFinishedFirst (the Practice Open): finished rounds rank above unfinished ones.
var RANK_FINISHED_FIRST = false;
function compareScores(a, b){
  return (RANK_FINISHED_FIRST ? (b.complete ? 1 : 0) - (a.complete ? 1 : 0) : 0) ||
    a.toPar - b.toPar || b.thru - a.thru || b.aces - a.aces || b.twos - a.twos || b.threes - a.threes;
}
function rankPlayers(a, b){ return compareScores(a.res, b.res) || a.name.localeCompare(b.name); }
// Place labels for a list already sorted with rankPlayers: '1', 'T2', 'T2', '4'...
function placeLabels(players){
  var places = [];
  players.forEach(function(p, i){
    places.push(i > 0 && compareScores(players[i-1].res, p.res) === 0 ? places[i-1] : i + 1);
  });
  return places.map(function(pl, i){
    var shared = places.filter(function(x){ return x === pl; }).length > 1;
    return (shared ? 'T' : '') + pl;
  });
}


// Players can fix or undo an entry for this long after saving it. After that
// only the organizer page can change it (the database rules enforce the same window).
var EDIT_WINDOW_MS = 2 * 60 * 1000;
function canStillChange(a){ return Date.now() - a.ts < EDIT_WINDOW_MS; }
