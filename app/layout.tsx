import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok Downloader",
  description: "Next.js TikTok Downloader",
  other: {
    monetag: "f1daa5e468c43e7f4b35d2256e5b0daa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        {children}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="/js/banner-adblock.js"
              strategy="afterInteractive"
              data-cfasync="false"
            />
            <Script
              src="/js/banner-adblock-ext.js"
              strategy="afterInteractive"
            />
          </>
        )}
      </body>
    </html>
  );
}
