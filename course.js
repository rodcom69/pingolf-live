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
    brand: 'XGOLF PINGOLF', place: 'Chester Springs, PA',
    // Email opt-in checkbox wording for this venue (every course asks for an optional email).
    collectEmail: {venue: 'xgolf', news: 'Send me Clubhouse pinball news'},
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
  },
  // PinCrossing (Railroad Street Bar and Grill, Linfield/Limerick PA). Lineup from Pinball Map,
  // Nov 2026. Alphabetical until we have the walking order; targets are first drafts.
  'pincrossing-2026': {
    name: 'PinCrossing · 11 machines (draft)',
    brand: 'PINCROSSING PINGOLF', place: 'Limerick, PA', mulligans: 1,
    listed: true, // in everyone's course dropdown even though its event is a test (link-only) event
    holes: [
      {n:1, name:"Avengers: Infinity Quest", img:"pc-avengers", target:50000000, label:"50M"},
      {n:2, name:"Batman 66", img:"pc-batman-66", target:100000000, label:"100M"},
      {n:3, name:"Firepower", img:"pc-firepower", target:350000, label:"350K"},
      {n:4, name:"Flash Gordon", img:"pc-flash-gordon", target:500000, label:"500K"},
      {n:5, name:"Harry Potter", img:"pc-harry-potter", target:200000000, label:"200M"},
      {n:6, name:"JAWS", img:"pc-jaws", target:150000000, label:"150M"},
      {n:7, name:"King Kong", img:"pc-king-kong", target:75000000, label:"75M"},
      {n:8, name:"Pulp Fiction", img:"pc-pulp-fiction", target:1500000, label:"1.5M"},
      {n:9, name:"Scared Stiff", img:"pc-scared-stiff", target:5000000, label:"5M"},
      {n:10, name:"Theatre of Magic", img:"pc-theatre-of-magic", target:500000000, label:"500M"},
      {n:11, name:"Wizard!", img:"pc-wizard", target:50000, label:"50K"}
    ]
  },
  // Rodney's basement: 5 machines, a home course (link-only test event, "Rodney C." under Home courses).
  // Targets are set hard, around tournament-winning scores on 3 balls.
  // Home courses (group 'home') are hidden from the public: the dropdown's "Home courses" section
  // only appears on a phone that has opened a home-course link, and then shows all of them. menuName = label there.
  'basement-2026': {
    name: "Rodney's House · 5 machines",
    brand: "RODNEY'S HOUSE PINGOLF", place: "Rodney's House", mulligans: 1,
    group: 'home', menuName: "Rodney's House",
    holes: [
      {n:1, name:"Batman 66 (Catwoman)", img:"batman-66-catwoman", target:200000000, label:"200M"},
      {n:2, name:"Harry Potter CE", img:"harry-potter-ce", target:400000000, label:"400M"},
      {n:3, name:"JAWS Premium", img:"pc-jaws", target:250000000, label:"250M"},
      {n:4, name:"Star Wars: Fall of the Empire CE", img:"sw-fall-of-the-empire", target:300000000, label:"300M"},
      {n:5, name:"King Kong Premium", img:"pc-king-kong", target:300000000, label:"300M"}
    ]
  },
  // Michael Reimer's house: 8 machines, home course ("Michael R." under Home courses). Order as Rodney listed them.
  // Targets set 2026-11-25 from Michael's sheet of 370 guest games so an average guest game scores a 4
  // (proposal https://claude.ai/artifact/WsvdFtsQ5ne8jjdrXEpnrs, Michael approved). Editions per Michael: Foo Fighters Pro, JAWS Premium, Monster Bash remake SE (CGC).
  // Art from IPDB (Foo Fighters Pro + Fish Tales translites; others backglass photos, cropped), JAWS reuses pc-jaws.
  'michael-2026': {
    name: "Michael's House · 8 machines",
    brand: "MICHAEL'S HOUSE PINGOLF", place: "Michael's House", mulligans: 1,
    group: 'home', menuName: "Michael's House",
    holes: [
      {n:1, name:"Foo Fighters Pro", img:"foo-fighters-pro", target:75000000, label:"75M"},
      {n:2, name:"The Getaway: High Speed II", img:"getaway-hs2", target:30000000, label:"30M"},
      {n:3, name:"Monster Bash SE (remake)", img:"monster-bash-se", target:20000000, label:"20M"},
      {n:4, name:"JAWS Premium", img:"pc-jaws", target:75000000, label:"75M"},
      {n:5, name:"Bobby Orr Power Play", img:"bobby-orr-power-play", target:80000, label:"80K"},
      {n:6, name:"Stars", img:"stars", target:80000, label:"80K"},
      {n:7, name:"Whirlwind", img:"whirlwind", target:1700000, label:"1.7M"},
      {n:8, name:"Fish Tales", img:"fish-tales", target:25000000, label:"25M"}
    ]
  }
};
// The Manor: every active machine (39; Meteor is inactive) from VENUE_MACHINES.manor (Rodney 2026-11-26:
// "make every game in the course"; it started as 9 random picks). Walking order by room (Garage, Breezeway,
// Back Room, Lodge, Horror Room), alphabetical within a room. Home course (link-only), 1 mulligan, draft targets.
// Art: IPDB scans/translites for the classics + WCS, Shadow, Sopranos, Junk Yard; Pinside polaroid crops for Deadpool,
// Iron Maiden, Metallica Remastered, TWD 2014, Elvira HoH, Godzilla 70th, Jurassic Park, Star Trek Pro; reused
// pc-* (Flash Gordon, King Kong, Firepower, JAWS, Pulp Fiction), getaway-hs2, fish-tales, foo-fighters-pro, stars,
// eight-ball, harlem-globetrotters, white-water.
COURSES['manor-2026'] = {
  name: 'The Manor · 39 machines (draft)',
  brand: 'THE MANOR PINGOLF', place: 'The Manor', mulligans: 1,
  group: 'home', menuName: 'The Manor',
  logo: 'img/manor-logo.jpg', // shown in the header instead of the brand text (The Manor Pinball logo, from Rodney)
  holes: [
    // Garage
    {n:1, name:"Attack From Mars (Remake)", img:"attack-from-mars", target:2000000000, label:"2B"},
    {n:2, name:"Eight Ball Deluxe (LE)", img:"eight-ball-deluxe", target:500000, label:"500K"},
    {n:3, name:"Evel Knievel", img:"evel-knievel", target:150000, label:"150K"},
    {n:4, name:"Flash Gordon", img:"pc-flash-gordon", target:500000, label:"500K"},
    {n:5, name:"King Kong: Myth of Terror Island (Pro)", img:"pc-king-kong", target:75000000, label:"75M"},
    {n:6, name:"Mystic", img:"mystic", target:200000, label:"200K"},
    {n:7, name:"Space Shuttle", img:"space-shuttle", target:500000, label:"500K"},
    {n:8, name:"Star Trek (Pro)", img:"star-trek-pro", target:100000000, label:"100M"},
    {n:9, name:"The Getaway: High Speed II", img:"getaway-hs2", target:30000000, label:"30M"},
    {n:10, name:"The Shadow", img:"the-shadow", target:300000000, label:"300M"},
    // Breezeway
    {n:11, name:"Deadpool (Pro)", img:"deadpool-pro", target:75000000, label:"75M"},
    {n:12, name:"Iron Maiden: Legacy of the Beast", img:"iron-maiden-lotb", target:100000000, label:"100M"},
    {n:13, name:"Metallica Remastered (Premium)", img:"metallica-remastered", target:30000000, label:"30M"},
    {n:14, name:"Paragon", img:"paragon", target:150000, label:"150K"},
    {n:15, name:"Solar City", img:"solar-city", target:75000, label:"75K"},
    {n:16, name:"The Sopranos", img:"sopranos", target:50000000, label:"50M"},
    {n:17, name:"Supersonic", img:"supersonic", target:150000, label:"150K"},
    {n:18, name:"Torch", img:"torch", target:200000, label:"200K"},
    {n:19, name:"The Walking Dead (Pro)", img:"walking-dead-2014", target:75000000, label:"75M"},
    {n:20, name:"World Cup Soccer", img:"world-cup-soccer", target:1000000000, label:"1B"},
    // Back Room
    {n:21, name:"Black Jack", img:"black-jack", target:150000, label:"150K"},
    {n:22, name:"Dracula", img:"dracula-stern", target:300000, label:"300K"},
    {n:23, name:"Eight Ball", img:"eight-ball", target:150000, label:"150K"},
    {n:24, name:"Firepower", img:"pc-firepower", target:350000, label:"350K"},
    {n:25, name:"Fish Tales", img:"fish-tales", target:25000000, label:"25M"},
    {n:26, name:"Godzilla (70th Anniversary)", img:"godzilla-70th", target:400000000, label:"400M"},
    {n:27, name:"JAWS (Pro)", img:"pc-jaws", target:75000000, label:"75M"},
    {n:28, name:"Junk Yard", img:"junk-yard", target:40000000, label:"40M"},
    {n:29, name:"Stars", img:"stars", target:80000, label:"80K"},
    {n:30, name:"Stranger Things (Premium)", img:"stranger-things-premium", target:150000000, label:"150M"},
    {n:31, name:"Strikes and Spares", img:"strikes-and-spares", target:300000, label:"300K"},
    // Lodge
    {n:32, name:"Flight 2000", img:"flight-2000", target:250000, label:"250K"},
    {n:33, name:"Foo Fighters (Pro)", img:"foo-fighters-pro", target:75000000, label:"75M"},
    {n:34, name:"Harlem Globetrotters On Tour", img:"harlem-globetrotters", target:300000, label:"300K"},
    {n:35, name:"Jurassic Park (Premium)", img:"jurassic-park-premium", target:200000000, label:"200M"},
    {n:36, name:"Pulp Fiction (SE)", img:"pc-pulp-fiction", target:1500000, label:"1.5M"},
    {n:37, name:"Super Orbit", img:"super-orbit", target:500000, label:"500K"},
    {n:38, name:"White Water", img:"white-water", target:75000000, label:"75M"},
    // Horror Room
    {n:39, name:"Elvira's House of Horrors (Premium)", img:"elvira-hoh", target:75000000, label:"75M"}
  ]
};
// Chad's: Chad's home course, all 14 machines from Match Play tournament 284697 arenas (Wednesday Night Pinball
// @ Chad's, Nov 2026), alphabetical. Home course (link-only), 1 mulligan, draft targets. Grand Prix is 5-ball.
// Art: IPDB (AFM 1995 translite, Dirty Harry, Eight Ball, Grand Lizard, Grand Prix, Harlem Globetrotters, Nitro Ground
// Shaker, Sinbad, White Water translite); Pinside polaroid crops (Godzilla Premium, D&D Tyrant's Eye Premium);
// reused: iron-maiden-lotb (Manor), pc-jaws, metallica (X-Golf Pro translite).
COURSES['chad-2026'] = {
  name: "Chad's House · 14 machines (draft)",
  brand: "CHAD'S HOUSE PINGOLF", place: "Chad's House", mulligans: 1,
  group: 'home', menuName: "Chad's House",
  logo: 'img/chad-logo.jpg', // First State Flippers / Delaware Pinball logo, from Rodney
  holes: [
    {n:1, name:"Attack from Mars", img:"attack-from-mars-1995", target:3000000000, label:"3B"},
    {n:2, name:"Dirty Harry", img:"dirty-harry", target:300000000, label:"300M"},
    {n:3, name:"Dungeons & Dragons: The Tyrant's Eye (Premium)", img:"dnd-tyrants-eye", target:75000000, label:"75M"},
    {n:4, name:"Eight Ball", img:"eight-ball", target:150000, label:"150K"},
    {n:5, name:"Godzilla (Premium)", img:"godzilla-premium", target:400000000, label:"400M"},
    {n:6, name:"Grand Lizard", img:"grand-lizard", target:2000000, label:"2M"},
    {n:7, name:"Grand Prix", img:"grand-prix", target:120000, label:"120K", balls:5},
    {n:8, name:"Harlem Globetrotters", img:"harlem-globetrotters", target:300000, label:"300K"},
    {n:9, name:"Iron Maiden (Pro)", img:"iron-maiden-lotb", target:100000000, label:"100M"},
    {n:10, name:"JAWS (Pro)", img:"pc-jaws", target:75000000, label:"75M"},
    {n:11, name:"Metallica", img:"metallica", target:30000000, label:"30M"},
    {n:12, name:"Nitro Ground Shaker", img:"nitro-ground-shaker", target:300000, label:"300K"},
    {n:13, name:"Sinbad", img:"sinbad", target:200000, label:"200K"},
    {n:14, name:"White Water", img:"white-water", target:75000000, label:"75M"}
  ]
};
// Zac's House: Zac's home course, 7 machines in the order Rodney listed them (2026-11-25), all 3-ball.
// Home course (link-only), 1 mulligan, draft targets. Monte Carlo = 1987 Gottlieb/Premier (Rodney).
// Art: IPDB (Aladdin's Castle, Monte Carlo 1987 photographic translite, Led Zeppelin Premium translite, Genie);
// Pinside polaroid crops (Texas Chainsaw Massacre CE, Rush Pro); JAWS Premium reuses pc-jaws.
COURSES['zac-2026'] = {
  name: "Zac's House · 7 machines (draft)",
  brand: "ZAC'S HOUSE PINGOLF", place: "Zac's House", mulligans: 1,
  group: 'home', menuName: "Zac's House",
  holes: [
    {n:1, name:"Aladdin's Castle", img:"aladdins-castle", target:50000, label:"50K"},
    {n:2, name:"Monte Carlo", img:"monte-carlo-1987", target:5000000, label:"5M"},
    {n:3, name:"Led Zeppelin (Premium)", img:"led-zeppelin", target:150000000, label:"150M"},
    {n:4, name:"Texas Chainsaw Massacre (CE)", img:"tcm-ce", target:50000000, label:"50M"},
    {n:5, name:"JAWS Premium", img:"pc-jaws", target:75000000, label:"75M"},
    {n:6, name:"Rush (Pro)", img:"rush-pro", target:300000000, label:"300M"},
    {n:7, name:"Genie", img:"genie", target:200000, label:"200K"}
  ]
};
// Machine rosters per location (not courses): every machine at the venue, so a course can be
// picked from them later. The Manor: from Match Play "The Manor Mega Matchplay" arenas
// (app.matchplay.events/tournaments/245339/arenas), Nov 2026; room = where it sits; opdb = Open Pinball DB id.
var VENUE_MACHINES = {
  chad: [ // Match Play tournament 284697 arenas (app.matchplay.events/tournaments/284697/arenas); note = venue's setting
    {name:"Attack from Mars", opdb:"G4do5-MDlN7", note:"Tournament ROM, mystery gives out awards"},
    {name:"Dirty Harry", opdb:"GrJ2Z-M61Xd"},
    {name:"Dungeons & Dragons: The Tyrant's Eye (Premium)", opdb:"GK1Ej-MePok-A9VWD"},
    {name:"Eight Ball", opdb:"GrN7J-MJ78q", note:"Has powerball"},
    {name:"Godzilla (Premium)", opdb:"GweeP-Ml9pZ-ARZoY", note:"Skill shot ball save & Oxy destroyer off; custom A/V"},
    {name:"Grand Lizard", opdb:"G4XPZ-M7Zob"},
    {name:"Grand Prix", opdb:"G4O1L-MDW47", note:"5 ball; game can be rolled; play extra balls"},
    {name:"Harlem Globetrotters", opdb:"GRnwQ-M9R5d", note:"Powerball; play EBs"},
    {name:"Iron Maiden (Pro)", opdb:"G4dOQ-MyNbb", note:"Skill shot ball save off"},
    {name:"JAWS (Pro)", opdb:"GLWll-MXr4N", note:"Skill shot ball save off; Life Ring hard"},
    {name:"Metallica", opdb:"GRBE4-MQK1Z-A9Yn1", note:"Spinners tied to the guitar pick switches"},
    {name:"Nitro Ground Shaker", opdb:"GrP6q-M5Rp1", note:"Has powerball"},
    {name:"Sinbad", opdb:"G4xqN-MD1Rj", note:"Has powerball"},
    {name:"White Water", opdb:"GRQKz-MyNXz"}
  ],
  manor: [
    {name:"Attack From Mars (Remake)", room:"Garage", opdb:"G4do5-MkPnV"},
    {name:"Black Jack", room:"Back Room", opdb:"G5nbD-MDyXb"},
    {name:"Deadpool (Pro)", room:"Breezeway", opdb:"G6lnq-Mq1kv"},
    {name:"Dracula", room:"Back Room", opdb:"G4Zl2-Ml90d"},
    {name:"Eight Ball", room:"Back Room", opdb:"GrN7J-MJ78q"},
    {name:"Eight Ball Deluxe (LE)", room:"Garage", opdb:"G5KXk-MLqNz"},
    {name:"Elvira's House of Horrors (Premium)", room:"Horror Room", opdb:"GZVOd-MwNxZ-AOLoy"},
    {name:"Evel Knievel", room:"Garage", opdb:"G59wx-MLnZ3"},
    {name:"Firepower", room:"Back Room", opdb:"G5VDd-MJpqO"},
    {name:"Fish Tales", room:"Back Room", opdb:"G5Wxd-MLxl3"},
    {name:"Flash Gordon", room:"Garage", opdb:"G5728-MDbjD"},
    {name:"Flight 2000", room:"Lodge", opdb:"G48kY-MDxRV"},
    {name:"Foo Fighters (Pro)", room:"Lodge", opdb:"GpeoL-MyNPq"},
    {name:"Godzilla (70th Anniversary)", room:"Back Room", opdb:"GweeP-Ml9pZ-AOvNL"},
    {name:"Harlem Globetrotters On Tour", room:"Lodge", opdb:"GRnwQ-M9R5d"},
    {name:"Iron Maiden: Legacy of the Beast", room:"Breezeway", opdb:"G4dOQ-MyNbb"},
    {name:"JAWS (Pro)", room:"Back Room", opdb:"GLWll-MXr4N"},
    {name:"Junk Yard", room:"Back Room", opdb:"GRLlj-MQZN8"},
    {name:"Jurassic Park (Premium)", room:"Lodge", opdb:"GK17D-MKNKd-A15Yn"},
    {name:"King Kong: Myth of Terror Island (Pro)", room:"Garage", opdb:"GEL0V-MBRyb"},
    {name:"Metallica Remastered (Premium)", room:"Breezeway", opdb:"GO0q3-MOEy8-ARol7"},
    {name:"Meteor", room:"Garage", opdb:"G5b38-MDqkx", inactive:true},
    {name:"Mystic", room:"Garage", opdb:"G5Bnl-MLnw6"},
    {name:"Paragon", room:"Breezeway", opdb:"GrXy3-ML0Ey"},
    {name:"Pulp Fiction (SE)", room:"Lodge", opdb:"GoEkx-MdEzN-ARJQz"},
    {name:"Solar City", room:"Breezeway", opdb:"GrEZ5-MJ9y3"},
    {name:"Space Shuttle", room:"Garage", opdb:"G4q3L-MKN50"},
    {name:"Star Trek (Pro)", room:"Garage", opdb:"Gryw4-MwNky"},
    {name:"Stars", room:"Back Room", opdb:"GrXEW-MDEwr"},
    {name:"Stranger Things (Premium)", room:"Back Room", opdb:"Gzy89-M0oPy-A1zrL"},
    {name:"Strikes and Spares", room:"Back Room", opdb:"GrleW-MYeod"},
    {name:"Super Orbit", room:"Lodge", opdb:"G4EPE-ML14r"},
    {name:"Supersonic", room:"Breezeway", opdb:"GRLXd-ME07p"},
    {name:"The Getaway: High Speed II", room:"Garage", opdb:"Grx8Y-MKNe9"},
    {name:"The Shadow", room:"Garage", opdb:"G4jPX-M85YZ"},
    {name:"The Sopranos", room:"Breezeway", opdb:"G5WoB-MDyNZ"},
    {name:"The Walking Dead (Pro)", room:"Breezeway", opdb:"G5nz5-M3d38"},
    {name:"Torch", room:"Breezeway", opdb:"G4JbV-M5Rqn"},
    {name:"White Water", room:"Lodge", opdb:"GRQKz-MyNXz"},
    {name:"World Cup Soccer", room:"Breezeway", opdb:"G42E2-MQP9e"}
  ]
};
// Demo: the X-Golf machines and targets, for showing people the app. Lives under Home courses as
// "Demo (try it out)", with a DEMO ribbon on screen (course demo: true) so it's never mistaken for the real event.
COURSES['demo-xgolf'] = Object.assign({}, COURSES['xgolf-2026-12'], {
  name: 'Demo · X-Golf machines (practice only)',
  brand: 'PINGOLF DEMO', place: 'Try it out',
  group: 'home', menuName: 'Demo (try it out)', demo: true,
  collectEmail: null
});
var DEFAULT_COURSE = 'xgolf-2026-12';
// Locations: each one has its own admin login (admin.html?loc=<id>, its own PIN, set by the organizer on
// admin.html > Location PINs). A location admin sees only events whose course belongs to that location and can
// close/reopen holes, fix/void/add scores and hide players there (enforced by firestore.rules via events/{id}.loc).
var LOCATIONS = {
  xgolf:       'X-Golf',
  pincrossing: 'PinCrossing',
  basement:    "Rodney's House",
  michael:     "Michael's House",
  manor:       'The Manor',
  chad:        "Chad's House",
  zac:         "Zac's House"
};
var COURSE_LOCATION = {
  'xgolf-2026-12': 'xgolf', 'pincrossing-2026': 'pincrossing', 'basement-2026': 'basement',
  'michael-2026': 'michael', 'manor-2026': 'manor', 'chad-2026': 'chad', 'zac-2026': 'zac'
  // demo-xgolf: no location (organizer only)
};
function courseLoc(courseId){ return COURSE_LOCATION[courseId] || ''; }
function courseInfo(courseId){ return COURSES[courseId] || COURSES[DEFAULT_COURSE]; }
// Mulligans per card: 2 unless the course says otherwise (PinCrossing plays with 1).
// Every event asks for an optional email. venue tags where it was collected (for per-venue lists);
// news = the opt-in checkbox text. A course can override both with collectEmail.
function courseEmail(courseId){
  var c = courseInfo(courseId).collectEmail;
  return {venue: (c && c.venue) || String(courseId || 'pingolf').split('-')[0], news: (c && c.news) || 'Send me Pingolf event news'};
}
function validEmail(e){ return typeof e === 'string' && e.length <= 100 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }
function courseMulligans(courseId){ var m = courseInfo(courseId).mulligans; return typeof m === 'number' ? m : 2; }
function mulliganWord(n){ return n + ' mulligan' + (n === 1 ? '' : 's'); }
function courseHoles(courseId){ return courseInfo(courseId).holes; }
// The course of the event being shown. The scorecard swaps it when you pick an event.
var HOLES = courseHoles(DEFAULT_COURSE);
// Two ways the organizer can take a hole out:
//  - closed for now (events/{id}.closedHoles): machine is down. Nobody can enter a
//    score on it, but par stays the same and scores already in still count.
//  - removed for good (events/{id}.removedHoles): skipped for everyone, its scores
//    stop counting, and par drops by 3.
// CLOSED_HOLES = removed (the scoring list); DOWN_HOLES = closed for now.
var CLOSED_HOLES = [], DOWN_HOLES = [];
function useCourse(courseId, removedHoles, downHoles){ HOLES = courseHoles(courseId); MAX_MULLIGANS = courseMulligans(courseId); CLOSED_HOLES = removedHoles || []; DOWN_HOLES = downHoles || []; }
function isHoleClosed(n, closed){ return (closed || CLOSED_HOLES).indexOf(n) !== -1; }
function isHoleDown(n, down){ return (down || DOWN_HOLES).indexOf(n) !== -1; }
function isHoleShut(n){ return isHoleClosed(n) || isHoleDown(n); }
function openHoleCount(holes, closed){
  return holes.filter(function(h){ return !isHoleClosed(h.n, closed); }).length;
}
// No picture yet: a plain tile with the machine name, so nothing shows as a broken image.
function holeImg(h){
  if (h.img) return 'img/' + h.img + '.jpg';
  var name = String(h.name).replace(/[&<>"']/g, '');
  var lines = [];
  name.split(/\s+/).forEach(function(w){
    var last = lines[lines.length - 1];
    if (last && (last + ' ' + w).length <= 12) lines[lines.length - 1] = last + ' ' + w; else lines.push(w);
  });
  var y0 = 210 - (lines.length - 1) * 19;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">' +
    '<rect width="300" height="400" fill="#2a2620"/><rect x="10" y="10" width="280" height="380" fill="none" stroke="#d9a441" stroke-width="3" rx="12"/>' +
    '<text fill="#f3e6c8" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle">' +
    lines.map(function(l, i){ return '<tspan x="150" y="' + (y0 + i * 38) + '">' + l + '</tspan>'; }).join('') + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

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
  if (holes.length && isGoal(holes[0])) return goalRulesText(holes, n);
  var five = holes.filter(function(h){ return holeBalls(h) === 5; }).map(function(h){ return h.name; });
  return 'Hit the target on ball 1, 2, or 3 — that\'s your stroke count for the hole (1, 2, or 3). Short of target after 3 balls? Enter your final score and strokes (4–8) are looked up automatically. ' +
    (five.length ? five.join(' and ') + (five.length > 1 ? ' are' : ' is') + ' a 5-ball game: hit the target on ball 4 = 4 strokes, ball 5 = 5; still short after 5 balls = 6–8 strokes. ' : '') +
    'Play all ' + n + ' holes. Once all ' + n + ' are done, you get ' + mulliganWord(MAX_MULLIGANS) + ': pick any game, play it again, and enter the score. It replaces that hole on your card only if it\'s better.' + (MAX_MULLIGANS > 1 ? ' Each mulligan must be a different game.' : '') + ' Par is 3 per hole (' + (PAR * n) + ' total). Lowest total wins. ' + TIEBREAK_TEXT;
}

// Most games are 3 balls; a hole with balls:5 (Joker Poker) lets ball 4 = 4 and
// ball 5 = 5 strokes. Short of target after the last ball, the final score is
// split into equal bands up to 8 strokes: fifths (4-8) for 3-ball games,
// thirds (6-8) for 5-ball games.
var MAX_STROKES = 8;
// Objective holes live in objectives.js (loaded after course.js); these two are the only shared hooks.
function isGoal(h){ return !!(h && h.goal); }
var GOAL_MISS = 9; // objective not done after 9 balls
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
  if (balls >= MAX_STROKES) return GOAL_MISS; // objective hole (objectives.js): 'not done' = 9
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
function attemptScoreLabel(a){ return a.method === 'ball' ? ('Ball ' + a.ball) : (a.strokes === GOAL_MISS ? 'Not done' : fmtNum(a.rawScore)); }
function playerKey(name){ return name.trim().toLowerCase(); }
// Work out which entry counts on each hole. Each hole has one regular entry
// (the newest, if a double-tap ever saved two). Mulligans are extra entries,
// used in the order played; one replaces its hole only if it took fewer strokes.
// holeCount = holes on the course; closed holes are taken off it here.
// down = holes closed temporarily: they still count, but a player who hasn't played
// one isn't held up by it (mulligans unlock once every open hole is done).
// mulls = mulligans allowed on that course (defaults to the shown event's course).
function scoreRound(attempts, holeCount, closed, down, mulls){
  closed = closed || CLOSED_HOLES;
  if (mulls == null) mulls = MAX_MULLIGANS;
  down = down || DOWN_HOLES;
  if (holeCount == null) holeCount = HOLES.length;
  // Only real, distinct hole numbers on this course count as closed.
  var closedHere = closed.filter(function(n, i){ return closed.indexOf(n) === i && n >= 1 && n <= holeCount; });
  holeCount -= closedHere.length;
  attempts = attempts.filter(function(a){ return !a.void; });
  // A mulligan keeps its slot even if its hole is closed later, so closing and
  // reopening a hole never changes which mulligans a player has used.
  var allMulls = attempts.filter(function(a){ return a.mulligan; })
    .sort(function(a,b){ return a.ts - b.ts; }).slice(0, mulls);
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
