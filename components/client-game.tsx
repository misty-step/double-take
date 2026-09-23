"use client";

import dynamic from "next/dynamic";

/**
 * The game renders in the browser only. Its first frame is always this
 * splash (it waits for the guest seat), and server rendering it crashes the
 * Cloudflare Worker, so the server sends the splash and nothing else.
 */
export const ClientGame = dynamic(
  () => import("./double-take").then((mod) => mod.DoubleTake),
  {
    ssr: false,
    loading: () => (
      <main className="splash">
        <div className="splash-inner">
          <h1>Double Take</h1>
          <p className="lede">Finding your seat…</p>
        </div>
      </main>
    ),
  },
);
