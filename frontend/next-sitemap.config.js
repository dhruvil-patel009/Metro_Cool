/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.metro-cool.com",
  generateRobotsTxt: true,

  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,

  exclude: [
    "/admin",
    "/admin/*",
    "/auth",
    "/auth/*",
    "/technician",
    "/technician/*",
    "/profile",
    "/profile/*",
    "/checkout",
    "/addresses",
    "/bookings",
    "/bookings/*",
    "/addresses/*",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: [
          "/admin",
          "/auth",
          "/technician",
          "/profile",
          "/checkout",
          "/bookings",
          "/addresses",
        ],
      },
    ],
  },
}