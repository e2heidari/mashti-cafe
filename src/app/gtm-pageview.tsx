"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = [];
    }
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.dataLayer.push({
      event: "pageview",
      page_path: pathname,
      page_location: `${window.location.origin}${url}`,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
