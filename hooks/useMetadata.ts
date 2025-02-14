"use client";

import appGlobal from "@/lib/zustand";

export default function useMetadata() {
  return appGlobal((state) => state.metadata);
}
