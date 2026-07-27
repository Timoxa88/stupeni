import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content/site";

/**
 * robots.txt с открытым доступом для AI-краулеров (ТЗ §4): OAI-SearchBot,
 * PerplexityBot, Google-Extended, ClaudeBot, YandexGPT и общих поисковиков.
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "PerplexityBot",
    "Google-Extended",
    "ClaudeBot",
    "Claude-Web",
    "Anthropic-AI",
    "YandexGPT",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...aiBots.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    // Директиву Host не отдаём: Яндекс отказался от неё ещё в 2018-м, а тут она
    // к тому же писалась со схемой и подпутём («https://…/stupeni»), что невалидно.
  };
}
