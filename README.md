# 🚀 SimpFlow

**SimpFlow** is a lightweight integration that connects **Typeform** to **Google Sheets** — with built-in logic, filters, and duplicate prevention. No Zapier, no Make, no subscriptions.

---

## ✅ What It Does

- Accepts Typeform responses via Webhook
- Writes data to a specified Google Sheet
- Filters responses (e.g. only from "New York")
- Skips duplicates (based on email)
- Adds timestamp automatically

---

## 📦 Features

- 🌐 Easy Webhook endpoint: `/webhook`
- 🧠 Built-in validation: email, city, interest
- 🔁 Real-time Google Sheets API integration
- 🧩 Customizable config via `.env`
- 🔐 Works with Google Service Account (secure)
- 💬 Healthcheck endpoints for debugging

---

## 🛠 Tech Stack

- Node.js + Express
- Google Sheets API (`googleapis`)
- CORS + dotenv + rate limiting
- Ready for deployment on **Render**, **Railway**, or **VPS**

---

## 🧪 Quick Test

```bash
curl -X POST https://your-simpflow-url/webhook \
-H "Content-Type: application/json" \
-d '{
  "form_response": {
    "answers": [
      { "type": "email", "email": "user@example.com" },
      { "type": "text", "field": { "ref": "city" }, "text": "New York" },
      { "type": "text", "field": { "ref": "interest" }, "text": "Marketing tips" }
    ]
  }
}'
