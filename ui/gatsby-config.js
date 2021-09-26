module.exports = {
  siteMetadata: {
    siteUrl: 'https://chickenrun.io',
    title: 'ChickenRun'
  },
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-mdx',
    'gatsby-plugin-sharp',
    { resolve: 'gatsby-transformer-sharp', options: { icon: 'src/images/chicken-icon.png' } },
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
