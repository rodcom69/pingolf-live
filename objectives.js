// Pingolf objectives courses (separate from the target-score courses in course.js).
// Format (Rodney 2026-11-26): each hole has one objective (goal + how). Up to 9 balls (3-ball games =
// up to 3 games in a row, ball count carries on). Strokes = the ball it's done on; not done after
// 9 balls = 9 (saved as method 'chart', rawScore 0, strokes GOAL_MISS).
// short = a few words for the hole tile; goal = the objective; how = details (tap to open).
// Holes get target:1, balls:9 so the shared scoring code (course.js) works unchanged; isGoal(h)
// (course.js) switches the screens in index.html / admin.html to objective wording.
// Load order: course.js, then objectives.js.

function goalRulesText(holes, n){
  return 'Each machine has one objective. You get up to 9 balls to do it: on a 3-ball game that is up to 3 games in a row, and the ball count carries on (game 2, ball 1 = ball 4). Your strokes = the ball you do it on (ball 1 = 1 stroke, ball 9 = 9). Not done after 9 balls = 9 strokes. Once it\'s done, the hole is over. Play all ' + n + ' holes. Then you get ' + mulliganWord(MAX_MULLIGANS) + ': play one objective again; it replaces that hole only if it\'s better. Lowest total wins. ' + TIEBREAK_TEXT;
}
function addObjectiveCourse(id, loc, course){
  course.objectives = true;
  course.holes.forEach(function(h){ h.target = 1; h.balls = 9; h.label = h.short || h.goal; });
  COURSES[id] = course;
  COURSE_LOCATION[id] = loc;
}

// Chad's House Objectives: same 14 machines, but each hole is a task (Rodney 2026-11-26).
// Up to 9 balls (3-ball games = up to 3 games in a row, ball count carries on); strokes = the ball you
// complete it on; not done after 9 balls = 9. goal = short task, how = how to do it.
// Rodney chose the hard objectives. easy = the easier one kept ready: swap it in by moving easy.goal/how into goal/how.
// Research + Chad's edit doc: https://claude.ai/artifact/RqFU1JUzudradGTumCNDkx
addObjectiveCourse('chad-obj-2026', 'chad', {
  name: "Chad's House Objectives · 14 machines (draft)",
  brand: "CHAD'S HOUSE OBJECTIVES", place: "Chad's House", mulligans: 1,
  group: 'home', menuName: "Chad's House Objectives", 
  logo: 'img/chad-logo.jpg',
  holes: [
    {n:1, name:"Attack from Mars", img:"attack-from-mars-1995", short:"Multiball", goal:"Start multiball", how:"Shoot the lock lane left of the saucer to light locks (one shot lights all 3 the first time), then lock 3 balls."},
    {n:2, name:"Dirty Harry", img:"dirty-harry", short:"Multiball", goal:"Start multiball", how:"Hit all 5 badge shots (HQ, side ramp, safe house, Warehouse, right ramp), then shoot the Warehouse or side ramp.",
      easy:{short:"Start a mode", goal:"Start a mode", how:"Shoot the lit HQ hole. Not lit? Shoot a lit orbit to light it."}},
    {n:3, name:"Dungeons & Dragons: The Tyrant's Eye (Premium)", img:"dnd-tyrants-eye", short:"Dragon multiball", goal:"Start Dragon Multiball", how:"Hit the 3 targets under the dragon."},
    {n:4, name:"Eight Ball", img:"eight-ball", short:"Sink the 8", goal:"Sink the 8 ball", how:"Collect pool balls 1-7 (top lanes and targets), then hit the lit 8-ball target. Has powerball.",
      easy:{short:"Balls 1–4", goal:"Collect pool balls 1-4", how:"Roll through top lanes 1, 2, 3 and 4."}},
    {n:5, name:"Godzilla (Premium)", img:"godzilla-premium", short:"Godzilla multiball", goal:"Start Godzilla Multiball", how:"Hit the ramps and the building to fill damage, then lock 3 balls at the building."},
    {n:6, name:"Grand Lizard", img:"grand-lizard", short:"Multiball", goal:"Start multiball", how:"Lock balls in the horseshoe lane right of the A ramp. With 2 locked, lock the 3rd or hit the top-right Release target."},
    {n:7, name:"Grand Prix", img:"grand-prix", short:"Extra ball", goal:"Earn an extra ball", how:"Knock down both pairs of drops (A+B and C+D) to light extra ball at the inlane, then roll through it. 5-ball game: balls keep counting (game 2, ball 1 = ball 6)."},
    {n:8, name:"Harlem Globetrotters", img:"harlem-globetrotters", short:"GLOBE", goal:"Collect all GLOBE letters", how:"Complete G-L-O-B-E. Has powerball."},
    {n:9, name:"Iron Maiden (Pro)", img:"iron-maiden-lotb", short:"Trooper multiball", goal:"Start Trooper Multiball", how:"Drop targets light Trooper Lock on the orbits; lock 3 balls."},
    {n:10, name:"JAWS (Pro)", img:"pc-jaws", short:"JAWS multiball", goal:"Start JAWS Multiball", how:"Chum the water: hit the chum bucket, then the flashing red shots to fill the meter. Raise the fin: hit a lit yellow shot, hit the fin, then shoot the ramp."},
    {n:11, name:"Metallica", img:"metallica", short:"Grave Marker MB", goal:"Start Grave Marker multiball", how:"Clear the 3 in-line drop targets, then hit the standup behind them."},
    {n:12, name:"Nitro Ground Shaker", img:"nitro-ground-shaker", short:"A–F", goal:"Complete A-F", how:"Complete the A through F lights (lights the 20,000 super bonus). Has powerball."},
    {n:13, name:"Sinbad", img:"sinbad", short:"3X lit", goal:"Get 3X bonus lit", how:"Knock down the white drop target (2X), then the yellow targets (3X). Has powerball."},
    {n:14, name:"White Water", img:"white-water", short:"Multiball", goal:"Start multiball", how:"Hit each green standup to light locks, then lock 3 balls in No Way Out.",
      easy:{short:"First raft", goal:"Complete the first raft", how:"Make one lit hazard shot to complete the raft."}}
  ]
});
