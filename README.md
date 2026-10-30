# QendraEra

Website for QendraEra, a child development centre (early intervention for
attention and hyperactivity, learning difficulties, neurodevelopmental and
anxiety disorders). The site is in **Albanian**.

Plain HTML, CSS and JavaScript, plus one PHP file that sends appointment
requests to Telegram.

---

## What's inside

- Header with a mobile hamburger menu and smooth scroll to each section
- Banner ("Dje / Sot / Nesër")
- Service cards
- About ("Rreth nesh")
- Team ("Ekipi ynë")
- Testimonial slider
- **Appointment form** ("Rezervoni takimin tuaj"): name, surname, email,
  phone, reason. It checks the fields in the browser, then sends them as
  one message to a Telegram chat through `tgcontact.php` and shows a
  thank-you message.
- **Chat widget:** Botpress webchat, loaded from Botpress's CDN at the end
  of `index.html`. On phones the page behind the chat is locked while it is
  open, and the chat stays above the keyboard.
- Footer with address, phone and email
- Sections fade in on scroll

---

## Files

| File | What |
|---|---|
| `index.html` | All page content |
| `style.css`, `style/*.css` | Styles: global + one file per section (navbar, banner, cards, about, team, testimonial, appointment, footer) |
| `script.js` | Menu, smooth scroll, testimonial slider, form validation and sending, scroll reveal, Botpress mobile fixes |
| `tgcontact.php` | Receives `{ "text": "…" }` as JSON and forwards it to Telegram (`sendMessage`) |
| `img/` | Photos (team, about, banner) and icons |

---

## Run locally

The page itself opens in any browser, but the form needs PHP:

```bash
php -S localhost:8000
```

Then open http://localhost:8000.

---

## Telegram setup

`tgcontact.php` needs a Telegram bot token (`$botToken`) and the chat ID to
send to (`$chatId`). Both are set at the top of the file.

> [!WARNING]
> The bot token is written directly in `tgcontact.php` and this repository
> is public. Anyone who reads it can send messages as the bot. Create a new
> token with @BotFather, and keep it out of the repo (for example read it
> with `getenv('TELEGRAM_BOT_TOKEN')` from the server's environment).

`tgcontact.php` also turns on `display_errors`, which is meant for
debugging only.

---

## Deployment

Needs hosting with PHP and the curl extension (most shared hosting has
both). Upload all files to the web root. A static-only host (GitHub Pages,
Netlify) will show the site, but the appointment form won't work there.
