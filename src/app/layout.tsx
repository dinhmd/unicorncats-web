import type { Metadata } from "next";
import { Bubblegum_Sans } from "next/font/google";
import "@/styles/globals.css";

const ggFont = Bubblegum_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Unicorn Cats",
  description: "Unicorn Cats",
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ggFont.className}>{children}</body>
    </html>
  );
}
