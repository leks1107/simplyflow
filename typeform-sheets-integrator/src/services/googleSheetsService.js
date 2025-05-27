const { google } = require('googleapis');
const { SPREADSHEET_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

const sheets = google.sheets('v4');

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

async function checkEmailExists(email) {
  const response = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:A', // Assuming emails are in column A
  });

  const emails = response.data.values || [];
  return emails.flat().includes(email);
}

async function addRow(email, interest) {
  const timestamp = new Date().toISOString();
  const row = [email, timestamp, interest];

  await sheets.spreadsheets.values.append({
    auth,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:C', // Assuming data is added to columns A, B, C
    valueInputOption: 'RAW',
    resource: {
      values: [row],
    },
  });
}

module.exports = {
  checkEmailExists,
  addRow,
};