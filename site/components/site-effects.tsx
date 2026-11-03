"use client";

import { useEffect } from "react";
import { initSiteEffects } from "@/lib/site-effects";

export function SiteEffects() {
  useEffect(() => {
    initSiteEffects();
  }, []);

  return null;
}
