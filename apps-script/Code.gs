// Pingolf "Forgot your name or PIN?" emailer (Google Apps Script web app).
// Runs as the Pingolf Gmail account, which has read access (Cloud Datastore User) to the
// pingolf-95ba1 Firestore. The site POSTs {email}; if that address is on file in
// playerContacts, this emails it the sign-in name(s) and PIN(s). It always answers the
// same way, so it can't be used to check who has signed up, and each address gets at
// most one email per 10 minutes.
// Deploy: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.
// No secrets live in this file.

var PROJECT = 'pingolf-95ba1';
var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT + '/databases/(default)/documents/';
var COOLDOWN_SECONDS = 600;

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var email = String(body.email || '').trim().toLowerCase();
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length <= 100) handle(email);
  } catch (err) {
    console.error(err);
  }
  return ContentService.createTextOutput(JSON.stringify({ok: true})).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('Pingolf PIN helper is running.');
}

function handle(email) {
  var cache = CacheService.getScriptCache();
  var cacheKey = 'sent_' + Utilities.base64EncodeWebSafe(email).slice(0, 200);
  if (cache.get(cacheKey)) return;
  cache.put(cacheKey, '1', COOLDOWN_SECONDS);

  var keys = contactsFor(email);
  if (!keys.length) return;

  var lines = keys.map(function (key) {
    var pin = field(get('playerSecrets/' + encodeURIComponent(key)), 'pin');
    if (!pin) return null;
    var shown = field(get('players/' + encodeURIComponent(key)), 'name') || key;
    var typeName = key.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    return 'Name to type: ' + typeName + (shown.toLowerCase() !== key ? '   (shows on the board as ' + shown + ')' : '') + '\nPIN: ' + pin;
  }).filter(Boolean);
  if (!lines.length) return;

  MailApp.sendEmail({
    to: email,
    name: 'Pingolf',
    subject: 'Your Pingolf name and PIN',
    body: 'Here is how to sign in to Pingolf:\n\n' + lines.join('\n\n') +
      '\n\nGo to https://playpingolf.com, type the name exactly as above, then your PIN.\n\n' +
      'Didn\'t ask for this? Someone typed your email on the Pingolf sign-in page. You can ignore this email.'
  });
}

// Player keys whose saved email matches (case-insensitive). The list is small, so read it all.
function contactsFor(email) {
  var keys = [], pageToken = '';
  do {
    var res = api('playerContacts?pageSize=300' + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''));
    (res.documents || []).forEach(function (d) {
      if (String(field(d, 'email') || '').trim().toLowerCase() === email) keys.push(decodeURIComponent(d.name.split('/').pop()));
    });
    pageToken = res.nextPageToken || '';
  } while (pageToken);
  return keys;
}

function get(path) {
  try { return api(path); } catch (err) { return null; }
}

function api(path) {
  var r = UrlFetchApp.fetch(BASE + path, {
    headers: {Authorization: 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true
  });
  if (r.getResponseCode() !== 200) throw new Error('Firestore ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 200));
  return JSON.parse(r.getContentText());
}

function field(doc, name) {
  var f = doc && doc.fields && doc.fields[name];
  return f ? (f.stringValue != null ? f.stringValue : f.integerValue != null ? String(f.integerValue) : null) : null;
}

// Run once from the editor (pick "testSetup", then Run) to grant permissions and check database access.
function testSetup() {
  var res = api('players?pageSize=1');
  console.log('Database access OK: ' + (res.documents ? res.documents.length : 0) + ' player doc read.');
}
