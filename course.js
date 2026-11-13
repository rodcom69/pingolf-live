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
      {n:2, name:"Mustang", target:60000, label:"60K", img:"mustang-em"},
      {n:3, name:"Wheel of Fortune", target:9000000, label:"9M", img:"wheel-of-fortune"},
      {n:4, name:"Dune", target:50000000, label:"50M", img:"dune"},
      {n:5, name:"Walking Dead", target:100000000, label:"100M", img:"walking-dead"},
      {n:6, name:"SeaWitch", target:400000, label:"400K", img:"seawitch"},
      {n:7, name:"Beatles", target:2000000, label:"2M", img:"beatles"},
      {n:8, name:"Joker Poker", target:200000, label:"200K", img:"joker-poker"},
      {n:9, name:"Medieval Madness", target:12000000, label:"12M", img:"medieval-madness"},
      {n:10, name:"Uncanny X-Men", target:100000000, label:"100M", img:"uncanny-x-men"},
      {n:11, name:"Transformers", target:100000000, label:"100M", img:"transformers"},
      {n:12, name:"John Wick", target:25000000, label:"25M", img:"john-wick"},
      {n:13, name:"Guardians of the Galaxy", target:25000000, label:"25M", img:"guardians"},
      {n:14, name:"Metallica", target:24000000, label:"24M", img:"metallica"},
      {n:15, name:"Ali", target:300000, label:"300K", img:"ali"},
      {n:16, name:"NBA Fast Break", target:75, label:"75", img:"nba-fast-break"},
      {n:17, name:"Game of Thrones", target:50000000, label:"50M", img:"game-of-thrones"},
      {n:18, name:"Black Knight: Sword of Rage", target:40000000, label:"40M", img:"black-knight-sor"}
    ]
  }
};
var DEFAULT_COURSE = 'xgolf-2026-12';
function courseHoles(courseId){ return (COURSES[courseId] || COURSES[DEFAULT_COURSE]).holes; }
// The course of the event being shown. The scorecard swaps it when you pick an event.
var HOLES = courseHoles(DEFAULT_COURSE);
// Holes the organizer has closed for this event (machine broke down). A closed hole
// is skipped for everyone: scores on it don't count, and par drops by 3.
var CLOSED_HOLES = [];
function useCourse(courseId, closedHoles){ HOLES = courseHoles(courseId); CLOSED_HOLES = closedHoles || []; }
function isHoleClosed(n, closed){ return (closed || CLOSED_HOLES).indexOf(n) !== -1; }
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
function fmtEventDate(ev){
  if (!ev.date) return '';
  var p = ev.date.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
  return d.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric', year:'numeric'});
}
function eventWhen(ev){ return [fmtEventDate(ev), ev.time].filter(Boolean).join(' · '); }
function eventTitle(ev){ return (ev.test ? '\ud83e\uddea ' : '') + ev.name + (ev.date && !ev.test ? ' — ' + fmtEventDate(ev) : ''); }
// Newest first, test events last.
function sortEvents(list){
  return list.slice().sort(function(a,b){ return (!!a.test - !!b.test) || (b.date || '').localeCompare(a.date || ''); });
}

var MAX_MULLIGANS = 2, PAR = 3;
function rulesText(holes){
  var n = openHoleCount(holes);
  return 'Hit the target on ball 1, 2, or 3 — that\'s your stroke count for the hole (1, 2, or 3). Short of target after 3 balls? Enter your final score and strokes (4–8) are looked up automatically. Play all ' + n + ' holes. Once all ' + n + ' are done, you get ' + MAX_MULLIGANS + ' mulligans: pick any game, play it again, and enter the score. It replaces that hole on your card only if it\'s better. Each mulligan must be a different game. Par is 3 per hole (' + (PAR * n) + ' total). Lowest total wins. ' + TIEBREAK_TEXT;
}

function strokeRanges(target){
  var b4 = Math.round(target*4/5), b3 = Math.round(target*3/5), b2 = Math.round(target*2/5), b1 = Math.round(target*1/5);
  return [
    {s:4, lo:b4, hi:target-1},
    {s:5, lo:b3, hi:b4-1},
    {s:6, lo:b2, hi:b3-1},
    {s:7, lo:b1, hi:b2-1},
    {s:8, lo:0, hi:b1-1}
  ];
}
function chartStrokes(target, score){
  if (score >= target) return 3;
  if (score >= target*4/5) return 4;
  if (score >= target*3/5) return 5;
  if (score >= target*2/5) return 6;
  if (score >= target*1/5) return 7;
  return 8;
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
function scoreRound(attempts, holeCount, closed){
  closed = closed || CLOSED_HOLES;
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
  return {
    total: total,
    thru: thru,
    complete: thru >= holeCount,
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
function fmtPar(n){ return n === 0 ? 'E' : (n > 0 ? '+' + n : String(n)); }
// Lowest to par first. Tiebreak: more holes played, then most aces, most 2s, most 3s.
// Players still level after that share the place (shown as T1, T2...).
var TIEBREAK_TEXT = 'Ties are broken by most aces (1s), then most 2s, then most 3s. Still tied = shared place.';
function compareScores(a, b){
  return a.toPar - b.toPar || b.thru - a.thru || b.aces - a.aces || b.twos - a.twos || b.threes - a.threes;
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
