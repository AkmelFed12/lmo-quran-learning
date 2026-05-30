import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

const MAX_TEXT_LENGTH = 220;
const FALLBACK_SPEECH_URL = process.env.ARABIC_TTS_URL;
const GOOGLE_SPEECH_URL = "https://translate.google.com/translate_tts";

function cleanText(value: string | null) {
  return (value || "")
    .replace(/\s+/g, " ")
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,،؛؟!'-]/g, "")
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

export async function GET(request: Request) {
  const apiKey = process.env.ARABIC_TTS_KEY;
  const { searchParams } = new URL(request.url);
  const text = cleanText(searchParams.get("text"));

  if (!text) {
    return NextResponse.json({ error: "Texte audio manquant." }, { status: 400 });
  }

  const googleUrl = new URL(GOOGLE_SPEECH_URL);
  googleUrl.searchParams.set("ie", "UTF-8");
  googleUrl.searchParams.set("client", "tw-ob");
  googleUrl.searchParams.set("tl", "ar");
  googleUrl.searchParams.set("q", text);

  const googleResponse = await fetch(googleUrl, {
    headers: {
      Accept: "audio/mpeg",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (googleResponse.ok) {
    const contentType = googleResponse.headers.get("content-type") || "";
    if (contentType.includes("audio")) {
      const audio = await googleResponse.arrayBuffer();
      return new NextResponse(audio, {
        headers: {
          "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=604800",
          "Content-Type": "audio/mpeg",
        },
      });
    }
  }

  if (!apiKey || !FALLBACK_SPEECH_URL) {
    return NextResponse.json({ error: "Service audio indisponible." }, { status: 503 });
  }

  const response = await fetch(FALLBACK_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      instructions: "Prononcer uniquement le texte arabe fourni, lentement, clairement, avec une articulation pédagogique. Ne pas traduire et ne rien ajouter.",
      model: process.env.ARABIC_TTS_MODEL,
      response_format: "mp3",
      voice: process.env.ARABIC_TTS_VOICE,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Lecture audio momentanément indisponible." }, { status: response.status });
  }

  const audio = await response.arrayBuffer();

  return new NextResponse(audio, {
    headers: {
      "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=604800",
      "Content-Type": "audio/mpeg",
    },
  });
}
