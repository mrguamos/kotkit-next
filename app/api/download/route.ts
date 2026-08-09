import type { RootObject } from "@/types/tiktok";

export const maxDuration = 60;

const FEED_API = "https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const isTikTokHost = (hostname: string) =>
  hostname === "tiktok.com" || hostname.endsWith(".tiktok.com");

const error = (message: string, status: number) =>
  Response.json({ error: message }, { status });

// TikTok's feed API fails intermittently on identical requests, so retry
const fetchPlayUrl = async (videoId: string) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 400));
    try {
      const feed = await fetch(
        `${FEED_API}?${new URLSearchParams({ aweme_id: videoId })}`,
        { method: "OPTIONS", cache: "no-store" },
      );
      if (!feed.ok) continue;
      const data: RootObject = await feed.json();
      const playUrl = data?.aweme_list?.[0]?.video?.play_addr?.url_list?.[0];
      if (playUrl) return playUrl;
    } catch {
      continue;
    }
  }
  return undefined;
};

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url")?.trim();
  if (!raw) return error("Missing url parameter", 400);

  let target: URL;
  try {
    target = new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`);
  } catch {
    return error("Invalid URL", 400);
  }
  if (!isTikTokHost(target.hostname)) return error("Not a TikTok URL", 400);

  try {
    if (!/\/(video|photo)\/\d+/.test(target.pathname)) {
      const resolved = await fetch(target, { headers: BROWSER_HEADERS });
      const resolvedUrl = new URL(resolved.url);
      if (!isTikTokHost(resolvedUrl.hostname)) {
        return error("Short URL did not resolve to a TikTok video", 404);
      }
      target = resolvedUrl;
    }

    const videoId = target.pathname.match(/\/(?:video|photo)\/(\d+)/)?.[1];
    if (!videoId) return error("Could not find a video id in the URL", 404);

    const playUrl = await fetchPlayUrl(videoId);
    if (!playUrl) return error("Video not found", 404);

    const video = await fetch(playUrl);
    if (!video.ok || !video.body) return error("Failed to fetch video", 502);

    return new Response(video.body, {
      headers: {
        "Content-Disposition": `attachment; filename="${videoId}.mp4"`,
        "Content-Type": video.headers.get("Content-Type") ?? "video/mp4",
      },
    });
  } catch {
    return error("Download failed", 500);
  }
}
