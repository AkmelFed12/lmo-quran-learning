const rawAdSenseClient =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  "";

export const GOOGLE_ADSENSE_CLIENT = rawAdSenseClient.trim();
export const GOOGLE_ADSENSE_ENABLED = /^ca-pub-\d+$/.test(GOOGLE_ADSENSE_CLIENT);
export const GOOGLE_ADSENSE_PUBLISHER_ID = GOOGLE_ADSENSE_CLIENT.replace(/^ca-/, "");

export const GOOGLE_ADSENSE_SLOTS = {
  marketing: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_MARKETING?.trim() || "",
  lessons: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_LESSONS?.trim() || "",
  dashboard: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_DASHBOARD?.trim() || "",
};
