import { NextResponse } from "next/server";

export const runtime = "nodejs";

function escapeTelegram(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendToTelegram(message: string, createdAt: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram environment variables belum tersedia.");
    return false;
  }

  const telegramMessage = [
    "🌱 <b>ULASAN BARU — FRESHCOY</b>",
    "",
    `<b>Pesan:</b>\n${escapeTelegram(message)}`,
    "",
    `<b>Waktu:</b> ${new Date(createdAt).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    })}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
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
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      console.error("Telegram API error:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram request failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: unknown;
    };

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          ok: false,
          error: "Masukan tidak boleh kosong.",
        },
        { status: 400 },
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          ok: false,
          error: "Masukan maksimal 1000 karakter.",
        },
        { status: 400 },
      );
    }

    const createdAt = new Date().toISOString();

    const telegramDelivered = await sendToTelegram(
      message,
      createdAt,
    );

    if (!telegramDelivered) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Ulasan gagal dikirim ke Telegram. Periksa konfigurasi bot.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      telegramDelivered: true,
    });
  } catch (error) {
    console.error("Feedback API error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Server tidak dapat memproses masukan.",
      },
      { status: 500 },
    );
  }
}
