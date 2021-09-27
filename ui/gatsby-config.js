module.exports = {
  siteMetadata: {
    title: 'Chikn NFT',
    siteUrl: 'https://chickenrun.io'
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
        name: 'Chikn NFT',
        short_name: 'Chikn NFT',
        start_url: '/',
        background_color: '#f7f0eb',
        theme_color: '#E84141',
        display: 'standalone',
        icon: 'src/images/chicken-icon-white.png'
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
