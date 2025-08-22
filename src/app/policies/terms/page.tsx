import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Mashti Cafe",
  description: "Terms of service",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-3">Terms of Service</h1>
      <p className="text-gray-600">
        This is a placeholder. Content coming soon.
      </p>
    </main>
  );
}
