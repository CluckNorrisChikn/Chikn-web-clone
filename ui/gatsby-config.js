
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

const siteConfig = require('./site-config')

module.exports = {
  siteMetadata: {
    title: siteConfig.title,
    siteUrl: siteConfig.url
  },
  plugins: [
    // includes private pages
    ...(siteConfig.includePrivatePages
      ? [
        {
          resolve: 'gatsby-plugin-page-creator',
          options: {
            path: 'src/private-pages'
          }
        }
      ]
      : []),
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: siteConfig.gtm.id,
        includeInDevelopment: true,
        defaultDataLayer: { platform: 'gatsby' },
        routeChangeEventName: 'gatsby-route-change',
        enableWebVitalsTracking: true
      }
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-mdx',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        start_url: '/',
        background_color: '#f7f0eb',
        theme_color: siteConfig.themeColour,
        display: 'standalone',
        icon: 'src/images/Chikn_Icon_Red_whitebkgd.svg'
      }
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-fontawesome-css',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      },
      __key: 'images'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/'
      },
      __key: 'pages'
    }

  ]
}
