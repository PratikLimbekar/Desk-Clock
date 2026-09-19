declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface PWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    [key: string]: unknown;
  }

  function withPWA(
    options?: PWAOptions
  ): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}