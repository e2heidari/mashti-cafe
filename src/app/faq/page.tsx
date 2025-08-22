import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Mashti Cafe",
  description: "Frequently Asked Questions",
};

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-3">FAQ</h1>
      <p className="text-gray-600">
        This is a placeholder. Content coming soon.
      </p>
    </main>
  );
}
