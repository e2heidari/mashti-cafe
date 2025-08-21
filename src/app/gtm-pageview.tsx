"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    (window as any).dataLayer.push({
      event: "pageview",
      page_path: pathname,
      page_location: `${window.location.origin}${url}`,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
