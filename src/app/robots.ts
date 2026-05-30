import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lmo-quran-learning.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/dashboard",
          "/guided-path",
          "/lessons",
          "/arabic",
          "/learning-lab",
          "/gaps",
          "/quran",
          "/memorization",
          "/flashcards",
          "/planning",
          "/daily-quiz",
          "/leaderboard",
          "/progress",
          "/certificates",
          "/library",
          "/profile",
          "/settings",
          "/forum",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
