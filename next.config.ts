import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
    ],
    formats: ['image/webp','image/avif'],
  },
  compress: true,
  experimental: { optimizePackageImports: ['next-sanity'] },

  async redirects() {
    return [
      // فقط وقتی مقصد "متفاوت" است ریدایرکت بذار
      { source: '/all-about-creativity-and-inspiration/', destination: '/blog/all-about-creativity-and-inspiration', permanent: true },
      { source: '/all-about-creativity-and-inspiration',  destination: '/blog/all-about-creativity-and-inspiration', permanent: true },

      { source: '/7-facts-every-business-should-know/',  destination: '/blog/7-facts-every-business-should-know', permanent: true },
      { source: '/7-facts-every-business-should-know',   destination: '/blog/7-facts-every-business-should-know', permanent: true },

      { source: '/top-20-small-business-blogs-to-follow/', destination: '/blog/top-20-small-business-blogs-to-follow', permanent: true },
      { source: '/top-20-small-business-blogs-to-follow',  destination: '/blog/top-20-small-business-blogs-to-follow', permanent: true },

      { source: '/tips-to-move-your-project-more-forward/', destination: '/blog/tips-to-move-your-project-more-forward', permanent: true },
      { source: '/tips-to-move-your-project-more-forward',  destination: '/blog/tips-to-move-your-project-more-forward', permanent: true },

      { source: '/online-reputation-and-management/', destination: '/blog/online-reputation-and-management', permanent: true },
      { source: '/online-reputation-and-management',  destination: '/blog/online-reputation-and-management', permanent: true },

      { source: '/how-to-be-ahead-of-stock-changes/', destination: '/blog/how-to-be-ahead-of-stock-changes', permanent: true },
      { source: '/how-to-be-ahead-of-stock-changes',  destination: '/blog/how-to-be-ahead-of-stock-changes', permanent: true },

      { source: '/category/:slug/', destination: '/blog/category/:slug', permanent: true },
      { source: '/category/:slug',  destination: '/blog/category/:slug', permanent: true },

      { source: '/tag/:slug/', destination: '/blog/tag/:slug', permanent: true },
      { source: '/tag/:slug',  destination: '/blog/tag/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
