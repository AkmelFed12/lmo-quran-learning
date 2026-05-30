type SpeakArabicOptions = {
  pitch?: number;
  rate?: number;
  volume?: number;
};

const DEFAULT_RATE = 0.82;
const DEFAULT_PITCH = 1;
const DEFAULT_VOLUME = 1;

let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;
let activeAudio: HTMLAudioElement | null = null;

function getSpeechSynthesis() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function findArabicVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ar")) ||
    voices.find((voice) => voice.name.toLowerCase().includes("arabic")) ||
    null
  );
}

export function warmArabicVoices(timeoutMs = 700) {
  const synth = getSpeechSynthesis();
  if (!synth) return Promise.resolve<SpeechSynthesisVoice[]>([]);

  const loaded = synth.getVoices();
  if (loaded.length > 0) return Promise.resolve(loaded);

  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const previousHandler = synth.onvoiceschanged;
      const timeout = window.setTimeout(() => {
        synth.onvoiceschanged = previousHandler;
        resolve(synth.getVoices());
      }, timeoutMs);

      synth.onvoiceschanged = (event) => {
        window.clearTimeout(timeout);
        synth.onvoiceschanged = previousHandler;
        if (typeof previousHandler === "function") previousHandler.call(synth, event);
        resolve(synth.getVoices());
      };
    });
  }

  return voicesPromise;
}

export async function speakArabicText(text: string, options: SpeakArabicOptions = {}) {
  const synth = getSpeechSynthesis();
  if (!synth || typeof SpeechSynthesisUtterance === "undefined" || !text.trim()) return false;

  const voices = synth.getVoices().length > 0 ? synth.getVoices() : await warmArabicVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findArabicVoice(voices);

  utterance.lang = voice?.lang || "ar-SA";
  utterance.rate = options.rate ?? DEFAULT_RATE;
  utterance.pitch = options.pitch ?? DEFAULT_PITCH;
  utterance.volume = options.volume ?? DEFAULT_VOLUME;
  if (voice) utterance.voice = voice;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    utterance.onend = () => finish(true);
    utterance.onerror = () => finish(false);

    synth.cancel();
    window.setTimeout(() => {
      try {
        synth.speak(utterance);
        if (synth.paused) synth.resume();
        window.setTimeout(() => finish(true), Math.max(1800, text.length * 450));
      } catch {
        finish(false);
      }
    }, 30);
  });
}

function buildArabicAudioUrl(text: string) {
  const params = new URLSearchParams({ text });
  return `/api/audio/arabic?${params.toString()}`;
}

async function playRemoteArabicAudio(text: string) {
  if (typeof window === "undefined" || !text.trim()) return false;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }

  const audio = new Audio(buildArabicAudioUrl(text));
  activeAudio = audio;
  audio.preload = "auto";

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (played: boolean) => {
      if (settled) return;
      settled = true;
      resolve(played);
    };

    audio.addEventListener("playing", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.addEventListener("stalled", () => finish(false), { once: true });

    audio.play().then(() => finish(true)).catch(() => finish(false));
    window.setTimeout(() => finish(false), 8000);
  });
}

export async function playArabicText(text: string, options: SpeakArabicOptions = {}) {
  const remoteAudioPlayed = await playRemoteArabicAudio(text);
  if (remoteAudioPlayed) return true;

  return speakArabicText(text, options);
}
