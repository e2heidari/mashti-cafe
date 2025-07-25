import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mashti Cafe - The First Iranian Juice and Ice Cream Bar in B.C.",
  description:
    "Experience authentic Iranian flavors with our premium juices, ice cream, and coffee. The first Iranian juice and ice cream bar in British Columbia.",
  keywords:
    "Iranian cafe, juice bar, ice cream, coffee, B.C., Vancouver, Persian food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources for better performance */}
        <link rel="preload" href="/images/newmashti-logo.png" as="image" />
        <link rel="preload" href="/images/1.webp" as="image" />
        <link rel="preload" href="/images/2.webp" as="image" />
        <link rel="preload" href="/images/3.webp" as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
