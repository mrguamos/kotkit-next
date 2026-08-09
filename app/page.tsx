import DownloadForm from "@/components/DownloadForm";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-10 px-4">
      <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-6xl">
        <span className="text-white">TikTok</span>
        <span className="ml-2 inline-block rounded-lg bg-[#ff9000] px-3 py-1 text-black">
          Downloader
        </span>
      </h1>
      <DownloadForm />
    </div>
  );
}
