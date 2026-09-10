import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "feedback.json");

function escapeTelegram(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function saveLocally(entry: { id: string; message: string; createdAt: string }) {
  await fs.mkdir(dataDir, { recursive: true });

  let existing: Array<{ id: string; message: string; createdAt: string }> = [];
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) existing = parsed as typeof existing;
  } catch {
    existing = [];
  }

  existing.push(entry);
  await fs.writeFile(dataFile, JSON.stringify(existing, null, 2), "utf8");
}

async function sendToTelegram(message: string, createdAt: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { configured: false, delivered: false };
  }

  const telegramMessage = [
    "🌱 <b>ULASAN BARU — FRESHCOY</b>",
    "",
    `<b>Pesan:</b>\n${escapeTelegram(message)}`,
    "",
    `<b>Waktu:</b> ${new Date(createdAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Telegram sendMessage failed:", response.status, detail);
    return { configured: true, delivered: false };
  }

  return { configured: true, delivered: true };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Masukan tidak boleh kosong." },
        { status: 400 },
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { ok: false, error: "Masukan maksimal 1000 karakter." },
        { status: 400 },
      );
    }

    const entry = {
      id: crypto.randomUUID(),
      message,
      createdAt: new Date().toISOString(),
    };

    // Keep a local copy for development / self-hosted environments.
    await saveLocally(entry);

    const telegram = await sendToTelegram(message, entry.createdAt);

    return NextResponse.json({
      ok: true,
      telegramDelivered: telegram.delivered,
    });
  } catch (error) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      { ok: false, error: "Server tidak dapat memproses masukan." },
      { status: 500 },
    );
  }
}
