// Пример Apps Script для приёма заявок и записи в Google Sheets
// 1) Создайте Google Sheet и получите его ID (из URL: /spreadsheets/d/<ID>/edit)
// 2) Вставьте этот код в новый проект Apps Script (https://script.google.com)
// 3) Замените SHEET_ID на ваш ID и задеплойте как "Web app" - Execute as: Me, Who has access: Anyone

const SHEET_ID = 'PUT_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Responses';

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'ready'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      data = JSON.parse(e.postData.contents || '{}');
    } else if (e.parameter) {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Ensure header row exists
    let lastCol = sheet.getLastColumn();
    let headers = [];
    if (lastCol > 0) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    const keys = Object.keys(data);
    if (headers.length === 0 || headers.filter(Boolean).length === 0) {
      // First submission: write headers in the order of keys
      sheet.appendRow(keys);
      headers = keys;
    }

    // Build row according to headers order; missing fields -> empty string
    const row = headers.map(h => data[h] || '');
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({result: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: 'error', message: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
