import type { NextConfig } from "next";

// Release-owner deploy config (card t_0db65fd9). The repository merged at
// 178b6b447548cca4caead3f976aba3ba85d31329 carries no next.config file; the
// OpenNext Cloudflare build toolchain requires one to recognize the app.
// This file intentionally sets no options, so the deployed bundle matches the
// CI-validated `next build` behavior of the merged revision.
const nextConfig: NextConfig = {};

export default nextConfig;