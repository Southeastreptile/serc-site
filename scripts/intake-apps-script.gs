/**
 * SERC Wildlife Intake — Google Apps Script backend
 * ---------------------------------------------------
 * Receives POSTs from southeastreptile.org/intake, appends a row to the
 * intake spreadsheet, and emails a notification. Stays entirely in Google.
 *
 * The target spreadsheet is set by SPREADSHEET_ID below, so this works whether
 * you create the script from inside the Sheet (Extensions -> Apps Script) or as
 * a standalone script at script.google.com.
 *
 * SETUP (one time):
 *  1. Open your intake Google Sheet -> Extensions -> Apps Script.
 *  2. Delete any sample code and paste this whole file.
 *  3. (Optional) If the tab you want isn't the first one, set SHEET_NAME to its
 *     name. (Optional) Run `setupHeaders` once to add a header row.
 *  4. Deploy -> New deployment -> type "Web app".
 *       - Description: "SERC intake"
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Click Deploy, authorize when prompted, and COPY the Web app URL
 *     (it ends in /exec).
 *  5. Send that /exec URL to paste into the website's INTAKE_ENDPOINT.
 *
 * To change fields later, edit FIELDS below and re-deploy (Manage deployments
 * -> edit -> new version).
 */

var SPREADSHEET_ID = '1qQHxC6XYYvXPdGIAd6dgBwpPKtfraOwNkstFao4kIb8';
var SHEET_NAME = 'Intake'; // Tab name. If it doesn't exist, the first tab is used.
var NOTIFY_EMAIL = 'info@southeastreptile.org';

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// Order matters: this is also the column order in the sheet.
var FIELDS = [
  ['timestamp', 'Timestamp'],
  ['name',      'Name'],
  ['email',     'Email'],
  ['phone',     'Phone'],
  ['address',   'Address'],
  ['species',   'Species'],
  ['dateFound', 'Date found'],
  ['location',  'Location found'],
  ['reason',    'Reason'],
  ['details',   'Details'],
  ['native',    'Native ack'],
];

function doPost(e) {
  try {
    var sheet = getSheet_();

    var p = (e && e.parameter) ? e.parameter : {};
    var row = FIELDS.map(function (f) {
      if (f[0] === 'timestamp') return new Date();
      if (f[0] === 'native') return p.native ? 'Yes' : '';
      return p[f[0]] || '';
    });
    sheet.appendRow(row);

    // Email notification
    var body = FIELDS
      .filter(function (f) { return f[0] !== 'timestamp'; })
      .map(function (f) { return f[1] + ': ' + (f[0] === 'native' ? (p.native ? 'Yes' : 'No') : (p[f[0]] || '')); })
      .join('\n');
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      'New intake report: ' + (p.species || 'animal') + (p.reason ? ' (' + p.reason + ')' : ''),
      body
    );

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err);
  }
}

// Run once from the editor if you want a header row.
function setupHeaders() {
  var sheet = getSheet_();
  sheet.getRange(1, 1, 1, FIELDS.length).setValues([FIELDS.map(function (f) { return f[1]; })]);
  sheet.setFrozenRows(1);
}
