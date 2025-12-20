/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com' , 'encrypted-tbn0.gstatic.com'],
  },
  experimental: {
    turbo: false
  },
  reactStrictMode: false,
};

export default nextConfig;
