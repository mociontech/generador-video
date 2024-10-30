/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)', // Aplica a todas las rutas
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;