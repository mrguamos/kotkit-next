"use client";

import { useState } from "react";

const path = "/api/download";

const DownloadForm = () => {
  const [url, setUrl] = useState("");
  const showAds = () => {
    if (process.env.NODE_ENV !== "production") return;
    const script = document.createElement("script");
    script.src = "//arsnivyr.com/1?z=5653509";
    script.async = false;
    script.setAttribute("data-cfasync", "false");
    document.querySelector("head")?.appendChild(script);
  };
  return (
    <div className="flex w-full flex-col items-center gap-y-5">
      <input
        onChange={(e) => setUrl(e.currentTarget.value)}
        type="text"
        placeholder="Paste URL here"
        className="w-full max-w-sm rounded-md bg-[#1b1b1b] p-3 text-center text-white placeholder-gray-500 outline-none ring-1 ring-[#2e2e2e] focus:ring-2 focus:ring-[#ff9000]"
      />
      <span className="px-2 text-center text-sm text-gray-400">
        ( Short URL does not work on regions near HongKong )
      </span>
      <a
        onClick={showAds}
        href={`${path}?url=${encodeURIComponent(url)}`}
        target="_blank"
        className="w-48 rounded-md bg-[#ff9000] py-2 px-4 text-center font-bold text-black transition-colors hover:bg-[#ffa31a]"
      >
        Download
      </a>
    </div>
  );
};

export default DownloadForm;
