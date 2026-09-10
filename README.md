# Freshcoy — clean full-stack rebuild

Website Freshcoy dibuat ulang dari nol dengan fokus pada keterbacaan informasi, interaksi yang berguna, dan layout yang tidak saling tumpang tindih.

## Stack

- Next.js 16.3.4
- React 19
- TypeScript
- CSS tanpa UI framework tambahan
- Local API route untuk masukan
- Penyimpanan feedback lokal di `data/feedback.json`

## Jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Cek tipe

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

## Ganti QR

Ganti file:

`public/qr-freshcoy.svg`

dengan QR milikmu. Pertahankan nama file tersebut agar kode tidak perlu diubah.

## Data indikator

Data konten utama ada di:

`lib/content.ts`

Website sengaja hanya menggunakan tiga kondisi indikator:

1. Indikator ungu
2. Biru
3. Kuning

Tidak ada kondisi nomor 04.

## API feedback

POST `/api/feedback`

Body:

```json
{ "message": "Masukan pengguna" }
```

Data disimpan secara lokal. Mekanisme ini cocok untuk pengembangan lokal; untuk deployment serverless, ganti penyimpanan dengan database atau layanan persistence.

## Telegram feedback setup

The feedback form can forward each submission to a Telegram chat. The local JSON copy is still kept for local/self-hosted development.

1. Create a bot with **@BotFather** and copy the bot token.
2. Start a chat with your new bot and send it any message.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and find `message.chat.id`.
4. Create `.env.local` in the project root:

```env
TELEGRAM_BOT_TOKEN="123456789:replace_me"
TELEGRAM_CHAT_ID="123456789"
```

5. Restart the Next.js server. New feedback will be sent to Telegram.

Never put the bot token in `NEXT_PUBLIC_*` variables or client-side code.

### Test

Submit one feedback from the site. A Telegram message should arrive in the configured chat.

If you see `telegramDelivered: false`, check the two environment variables and make sure the bot can send messages to the selected chat.
