import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

// SoDo Sans alternative - Inter (clean, modern sans-serif)
const sodoSans = Inter({
  variable: "--font-sodo-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Lander alternative - reuse Inter for stability under Turbopack
const lander = Inter({
  variable: "--font-lander",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Pike alternative - Montserrat (bold, impactful)
const pike = Montserrat({
  variable: "--font-pike",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mashti Cafe - The First Iranian Juice and Ice Cream Bar in B.C.",
  description:
    "Experience authentic Iranian flavors with our premium juices, ice cream, and coffee. The first Iranian juice and ice cream bar in British Columbia.",
  keywords:
    "Iranian cafe, juice bar, ice cream, coffee, B.C., Vancouver, Persian food",
  icons: {
    icon: [{ url: "/images/mashti-logo-1.png", type: "image/png" }],
    shortcut: "/images/mashti-logo-1.png",
    apple: "/images/mashti-logo-1.png",
  },
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
        {/* Explicit favicon links for broad browser support */}
        <link
          rel="icon"
          href="/images/mashti-logo-1.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/images/mashti-logo-1.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="shortcut icon"
          href="/images/mashti-logo-1.png"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/images/mashti-logo-1.png" />
      </head>
      <body
        suppressHydrationWarning
        className={`${sodoSans.variable} ${lander.variable} ${pike.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
