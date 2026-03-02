Инструкция: отправка заявок в Google Sheets через Apps Script

1) Создайте Google Spreadsheet (Google Sheets).
2) Откройте `apps_script/Code.gs` и замените `PUT_YOUR_SHEET_ID_HERE` на ID вашей таблицы (в URL: /spreadsheets/d/<ID>/edit).
3) Вставьте код в проект Apps Script (https://script.google.com), сохраните.
4) Деплой как Web App:
   - Deploy -> New deployment
   - Тип: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone" или "Anyone, even anonymous" (если хотите принимать запросы из публичного сайта)
   - После деплоя скопируйте Web app URL.
5) В `index.html` найдите строку `const WEB_APP_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';` и вставьте туда URL.

Замечания о CORS и безопасности:
- При доступе с браузера Web App должен быть доступен "Anyone"; при этом запросы с браузера обычно проходят.
- Не храните чувствительные данные в публичной таблице.
- Если нужно защищать доступ — добавьте проверку секретного ключа в запрос (например, header `X-SCRIPT-KEY`).

Пример запроса (в браузере):
fetch(WEB_APP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({email: 'a@b.com', phone: '+1...'})
})
.then(r => r.json()).then(console.log).catch(console.error);
