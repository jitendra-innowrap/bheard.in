"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

const START_DELAY_MS = 90;

export default function TopRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      minimum: 0.08,
    });
  }, []);

  useEffect(() => {
    const complete = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      inFlightRef.current = false;
      NProgress.done();
    };
    complete();
  }, [pathname, searchParams]);

  useEffect(() => {
    const start = () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      timerRef.current = window.setTimeout(() => {
        NProgress.start();
      }, START_DELAY_MS);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      const nextUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isInternal = nextUrl.origin === currentUrl.origin;
      if (!isInternal) return;

      const changed =
        nextUrl.pathname !== currentUrl.pathname ||
        nextUrl.search !== currentUrl.search ||
        nextUrl.hash !== currentUrl.hash;

      if (!changed) return;
      start();
    };

    const onPopState = () => start();

    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);
    history.pushState = (...args) => {
      start();
      return originalPushState(...args);
    };
    history.replaceState = (...args) => {
      start();
      return originalReplaceState(...args);
    };

    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("popstate", onPopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      NProgress.done();
    };
  }, []);

  return null;
}

