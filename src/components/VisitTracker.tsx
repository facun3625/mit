"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function store(kind: "local" | "session", key: string, make: () => string): string {
  try {
    const s = kind === "local" ? localStorage : sessionStorage;
    let v = s.getItem(key);
    if (!v) { v = make(); s.setItem(key, v); }
    return v;
  } catch {
    return make();
  }
}

// Registra una visita por cada página que se ve en el sitio público.
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = store("local", "mit_vid", uid);
    const sessionId = store("session", "mit_sid", uid);

    // La fuente (referrer / UTM) se captura al entrar y se reutiliza durante toda la sesión.
    const acquisition = JSON.parse(
      store("session", "mit_acq", () => {
        const q = new URLSearchParams(location.search);
        return JSON.stringify({
          referrer: document.referrer || null,
          utmSource: q.get("utm_source"),
          utmMedium: q.get("utm_medium"),
          utmCampaign: q.get("utm_campaign"),
        });
      })
    );

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, visitorId, sessionId, idioma: navigator.language, ...acquisition }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
