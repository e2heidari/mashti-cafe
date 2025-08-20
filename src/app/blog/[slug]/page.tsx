import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Blog: ${slug}`,
    description: `Post ${slug}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: Fetch real content here (e.g., from Sanity) using `slug`.
  // If not found, you can show a friendly message instead of 404 for now.
  // Example:
  // const data = await getPostBySlug(slug);
  // if (!data) return <EmptyState slug={slug} />;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-3">Post: {slug}</h1>
      <p className="text-muted-foreground">
        Temporary stub — replace with real content.
      </p>
    </main>
  );
}
