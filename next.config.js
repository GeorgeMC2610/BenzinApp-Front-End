/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/login',
        destination: 'http://192.168.1.93:3000/auth/login', // Proxy the login request to the backend
      },
      {
        source: '/api/register',
        destination: 'http://192.168.1.93:3000/signup', // Proxy the register request to the backend
      },
      {
        source: '/api/car',
        destination: 'http://192.168.1.93:3000/car',
      }
    ];
  },
};

module.exports = nextConfig;
