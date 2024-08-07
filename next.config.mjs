/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   async redirects() {
      return [
         {
            source: "/",
            destination: "/seshs",
            permanent: false,
         },
      ];
   },
};

export default nextConfig;
