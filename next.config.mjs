import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

/** Instrument version for exported results: git short sha, else package version. */
function instrumentVersion() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
    return pkg.version;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_INSTRUMENT_VERSION: instrumentVersion(),
  },
};

export default nextConfig;
