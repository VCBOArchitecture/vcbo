/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
        port: " ",
        pathname: "/vcbo/**",
      },
    ],
  },
  async redirects() {
    // Legacy URLs flagged in the 2026 SEO audit. statusCode 301 instead of
    // `permanent: true`, which sends a 308.
    return [
      ["/u-of-u-football-center.html", "/projects/uu-end-zone1"],
      ["/project-page/Salt%20Lake%20City%20Library", "/projects/salt-lake-city-library"],
      ["/projects/uts-set-building", "/projects/ut-set-building"],
      ["/ihc-salt-lake-clinic.html", "/projects/specialty/clinics"],
      ["/kirk-chadwick.html", "/about/team"],
      ["/services.html", "/services"],
      ["/projects.html", "/projects"],
    ].map(([source, destination]) => ({ source, destination, statusCode: 301 }))
  },
}
