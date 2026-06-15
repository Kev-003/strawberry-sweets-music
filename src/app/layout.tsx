import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strawberry Sweets",
  description:
    "Strawberry Sweets is an indie band from Balanga, Bataan. Making songs that capture fleeting feelings and dreamlike moments.",
  keywords:
    "Strawberry Sweets, indie band, Balanga, Bataan, Filipino indie, OPM",
  openGraph: {
    title: "Strawberry Sweets",
    description:
      "Making songs that capture fleeting feelings and dreamlike moments.",
    type: "website",
    url: "https://strawberry-sweets-music.cc",
    images: [
      { url: "https://pub-19202e96198a4f7ba7bbc7f311350d8a.r2.dev/band.webp" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strawberry Sweets",
    description:
      "Making songs that capture fleeting feelings and dreamlike moments.",
    images: ["https://pub-19202e96198a4f7ba7bbc7f311350d8a.r2.dev/band.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
