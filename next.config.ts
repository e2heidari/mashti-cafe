import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { domains: ['cdn.sanity.io'], formats: ['image/webp','image/avif'] },
  compress: true,
  experimental: { optimizePackageImports: ['next-sanity'] },

  async redirects() {
    return [
      { source: '/all-about-creativity-and-inspiration/', destination: '/all-about-creativity-and-inspiration', permanent: true },
      { source: '/all-about-creativity-and-inspiration',  destination: '/all-about-creativity-and-inspiration', permanent: true },

      { source: '/7-facts-every-business-should-know/',  destination: '/7-facts-every-business-should-know', permanent: true },
      { source: '/7-facts-every-business-should-know',   destination: '/7-facts-every-business-should-know', permanent: true },

      { source: '/top-20-small-business-blogs-to-follow/', destination: '/top-20-small-business-blogs-to-follow', permanent: true },
      { source: '/top-20-small-business-blogs-to-follow',  destination: '/top-20-small-business-blogs-to-follow', permanent: true },

      { source: '/tips-to-move-your-project-more-forward/', destination: '/tips-to-move-your-project-more-forward', permanent: true },
      { source: '/tips-to-move-your-project-more-forward',  destination: '/tips-to-move-your-project-more-forward', permanent: true },

      { source: '/online-reputation-and-management/', destination: '/online-reputation-and-management', permanent: true },
      { source: '/online-reputation-and-management',  destination: '/online-reputation-and-management', permanent: true },

      { source: '/how-to-be-ahead-of-stock-changes/', destination: '/how-to-be-ahead-of-stock-changes', permanent: true },
      { source: '/how-to-be-ahead-of-stock-changes',  destination: '/how-to-be-ahead-of-stock-changes', permanent: true },

      // اگر دسته/تگ مسیر دیگری دارند مقصد را بر همان اساس عوض کن
      { source: '/category/:slug/', destination: '/category/:slug', permanent: true },
      { source: '/category/:slug',  destination: '/category/:slug', permanent: true },
      { source: '/tag/:slug/', destination: '/tag/:slug', permanent: true },
      { source: '/tag/:slug',  destination: '/tag/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
