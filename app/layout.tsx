import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "DSA Visualizer: Learn algorithms visually",
  description:
    "Interactive step-by-step visualizations for data structures and algorithms, with interview patterns and progress tracking.",
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

const themeBootstrap = `(function(){try{var s=localStorage.getItem("dsa-visualizer:theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>{children}</body>
    </html>
  );
}
