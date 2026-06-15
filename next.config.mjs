/** @type {import('next').NextConfig} */
const nextConfig = {
  // Évite que Webpack découpe @supabase en vendor-chunks cassés côté serveur
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js", "@supabase/ssr"],
  },
};

export default nextConfig;
