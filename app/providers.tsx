"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  useGuestCredential,
  type UseGuestCredentialResult,
} from "@parlor/react";
import type { GuestCredentialIssuer } from "@parlor/web";
import { createContext, useContext, useState, type ReactNode } from "react";
import {
  SEAT_RECOVERY_UNAVAILABLE,
  SEAT_RESET_UNAVAILABLE,
} from "../lib/player-copy";

const issuer: GuestCredentialIssuer = async (input) => {
  const response = await fetch("/api/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input ?? {}),
    credentials: "same-origin",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(SEAT_RECOVERY_UNAVAILABLE);
  return result;
};

/** Recovery path: deliberately drop the stranded identity and start a new guest seat. */
export const resetIssuer: GuestCredentialIssuer = async () => {
  const response = await fetch("/api/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "reset" }),
    credentials: "same-origin",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(SEAT_RESET_UNAVAILABLE);
  return result;
};
const GuestContext = createContext<UseGuestCredentialResult | null>(null);
export function useGuest() {
  const guest = useContext(GuestContext);
  if (!guest) throw new Error("Guest provider is missing");
  return guest;
}
function GuestProvider({ children }: { children: ReactNode }) {
  const guest = useGuestCredential({
    issuer,
    autoAcquire: true,
    key: "double-take:credential",
  });
  return (
    <GuestContext.Provider value={guest}>{children}</GuestContext.Provider>
  );
}
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    return url ? new ConvexReactClient(url) : null;
  });
  if (!client)
    return (
      <main className="setup-error">
        <h1>Double Take can’t start right now.</h1>
        <p>Try again in a moment.</p>
      </main>
    );
  return (
    <ConvexProvider client={client}>
      <GuestProvider>{children}</GuestProvider>
    </ConvexProvider>
  );
}
