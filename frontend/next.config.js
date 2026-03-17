/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.DEPLOY_TARGET === 'github-pages' ? '/Beyond-ETA' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
