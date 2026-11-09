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

// Dec 12, 2026 course: all 18 machines, numbered in X-Golf walking order.
// Black Knight, Dune, Walking Dead, X-Men and Transformers are new; their targets are first guesses.
var HOLES = [
  {n:1, name:"Black Knight: Sword of Rage", target:40000000, label:"40M"},
  {n:2, name:"Cyclopes", target:200000, label:"200K"},
  {n:3, name:"Wheel of Fortune", target:9000000, label:"9M"},
  {n:4, name:"Dune", target:50000000, label:"50M"},
  {n:5, name:"Walking Dead", target:40000000, label:"40M"},
  {n:6, name:"SeaWitch", target:400000, label:"400K"},
  {n:7, name:"Beatles", target:2000000, label:"2M"},
  {n:8, name:"Joker Poker", target:100000, label:"100K"},
  {n:9, name:"Medieval Madness", target:12000000, label:"12M"},
  {n:10, name:"Uncanny X-Men", target:75000000, label:"75M"},
  {n:11, name:"Transformers", target:100000000, label:"100M"},
  {n:12, name:"John Wick", target:25000000, label:"25M"},
  {n:13, name:"Guardians of the Galaxy", target:25000000, label:"25M"},
  {n:14, name:"Metallica", target:24000000, label:"24M"},
  {n:15, name:"Ali", target:300000, label:"300K"},
  {n:16, name:"NBA Fast Break", target:75, label:"75"},
  {n:17, name:"Game of Thrones", target:50000000, label:"50M"},
  {n:18, name:"Mustang", target:60000, label:"60K"}
];
// The Sept 19 practice round used a 17-hole layout; keep it so History lines up.
var HOLES_SEPT_2026 = [
  {n:1, name:"Cyclopes"}, {n:2, name:"Wheel of Fortune"}, {n:3, name:"Star Wars: Fall of the Empire"},
  {n:4, name:"Star Wars"}, {n:5, name:"SeaWitch"}, {n:6, name:"Beatles"}, {n:7, name:"Joker Poker"},
  {n:8, name:"Medieval Madness"}, {n:9, name:"Pokemon"}, {n:10, name:"John Wick"}, {n:11, name:"Venom"},
  {n:12, name:"Guardians of the Galaxy"}, {n:13, name:"Metallica"}, {n:14, name:"Ali"},
  {n:15, name:"NBA Fast Break"}, {n:16, name:"Game of Thrones"}, {n:17, name:"Mustang"}
];
function holeImg(h){ return 'img/h' + (h.n < 10 ? '0' : '') + h.n + '.jpg'; }
function holesForEvent(eventId){
  return eventId === 'evt_practice_20260919' ? HOLES_SEPT_2026 : HOLES;
}
var MAX_MULLIGANS = 2, PAR = 3;
var RULES_TEXT = 'Hit the target on ball 1, 2, or 3 \u2014 that\'s your stroke count for the hole (1, 2, or 3). Short of target after 3 balls? Enter your final score and strokes (4\u20138) are looked up automatically. Play all 18 holes. Once all 18 are done, you get 2 mulligans: pick any game, play it again, and enter the score. It replaces that hole on your card only if it\'s better. Each mulligan must be a different game. Par is 3 per hole (54 total). Lowest total wins.';

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
function scoreRound(attempts){
  attempts = attempts.filter(function(a){ return !a.void; });
  var originals = {};
  attempts.forEach(function(a){
    if (a.mulligan) return;
    if (!originals[a.hole] || a.ts > originals[a.hole].ts) originals[a.hole] = a;
  });
  var mulls = attempts.filter(function(a){ return a.mulligan; })
    .sort(function(a,b){ return a.ts - b.ts; }).slice(0, MAX_MULLIGANS);
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
    complete: thru >= HOLES.length,
    toPar: total - PAR * counted.length,
    byHole: byHole,
    originals: originals,
    mulls: mulls,
    countedIds: counted.map(function(a){ return a.id; }),
    mulligansUsed: mulls.length
  };
}
function fmtPar(n){ return n === 0 ? 'E' : (n > 0 ? '+' + n : String(n)); }
function rankPlayers(a, b){ return a.res.toPar - b.res.toPar || b.res.thru - a.res.thru || a.name.localeCompare(b.name); }


// Players can fix or undo an entry for this long after saving it. After that
// only the organizer page can change it (the database rules enforce the same window).
var EDIT_WINDOW_MS = 2 * 60 * 1000;
function canStillChange(a){ return Date.now() - a.ts < EDIT_WINDOW_MS; }
