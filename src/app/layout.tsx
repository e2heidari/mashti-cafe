import type { Metadata } from "next";
import { Inter, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

// SoDo Sans alternative - Inter (clean, modern sans-serif)
const sodoSans = Inter({
  variable: "--font-sodo-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Lander alternative - Poppins (friendly, geometric)
const lander = Poppins({
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
        className={`${sodoSans.variable} ${lander.variable} ${pike.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
