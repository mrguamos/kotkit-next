import type { RootObject } from "@/types/tiktok";

export async function GET(req: Request) {
  const reqURL = new URL(req.url);
  const query = reqURL.searchParams.get("url") || "";
  let path = query.split(/[?#]/)[0];
  if (path.includes("tiktok")) {
    if (!path.includes("video")) {
      const resp = await fetch(path, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
        },
      });
      path = resp.url.split(/[?#]/)[0];
    }
    const videoId = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (videoId) {
      const url = "https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/";
      const data: RootObject = await fetch(
        `${url}?${new URLSearchParams({ aweme_id: videoId })}`,
        { method: "OPTIONS" },
      ).then((_data) => _data.json());
      const video = await fetch(
        data?.aweme_list[0].video.play_addr.url_list[0] ?? "",
      ).then((_data) => _data.blob());
      return new Response(video, {
        headers: {
          "Content-Disposition": `attachment; filename=${videoId}.mp4`,
          "Content-Type": req.headers.get("Content-Type") || "",
        },
        status: 200,
      });
    }
  }
  return new Response("Video Not Found");
}
