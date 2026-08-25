"use client";

import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    fetch("/visitor", {
      method: "POST",
    }).catch(() => {
      // Tracking should never affect the website.
    });
  }, []);

  return null;
}
