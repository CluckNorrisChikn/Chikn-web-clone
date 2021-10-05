const siteConfig = require('./site-config')

module.exports = {
  siteMetadata: {
    title: siteConfig.title,
    siteUrl: siteConfig.url
  },
  plugins: [
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
        icon: 'src/images/chicken-icon-2-white.svg'
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
