import * as React from 'react'
import { Helmet } from 'react-helmet'
import siteConfig from '../../site-config'

const HelmetMeta = ({ pageName }) => {
  return (
    <Helmet>
      {/* <!-- page --> */}
      <meta charSet="utf-8" />
      <title>
        {siteConfig.title}
        {pageName ? ` - ${pageName}` : ''}
      </title>
      <meta name="description" content={siteConfig.description} />
      <link rel="canonical" href={siteConfig.url} />

      {/* <!-- meta --> */}
      <meta name="title" content={siteConfig.title} />
      <meta name="description" content={siteConfig.description} />
      <meta name="author" content={siteConfig.author} />
      <meta name="keywords" content={siteConfig.keywords} />
      <meta name="image" content={siteConfig.imageUrl} />
      <meta name="url" content={siteConfig.url} />

      {/* <!-- og --> */}
      <meta property="og:title" content={siteConfig.title} />
      <meta property="og:description" content={siteConfig.description} />
      <meta property="og:image" content={siteConfig.imageUrl} />
      <meta property="og:image:width" content={siteConfig.imageWidthPx} />
      <meta property="og:image:height" content={siteConfig.imageHeightPx} />
      <meta property="og:image:alt" content={siteConfig.imageAlt} />
      <meta property="og:url" content={siteConfig.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.title} />

      {/* <!-- twitter --> */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={siteConfig.title} />
      <meta name="twitter:site" content={siteConfig.links.twitterAt} />
      <meta name="twitter:description" content={siteConfig.description} />
      <meta name="twitter:image" content={siteConfig.imageSquareUrl} />
      <meta name="twitter:image:alt" content={siteConfig.imageAlt} />

      {/* <!-- Chrome, Firefox OS and Opera --> */}
      <meta name="theme-color" content={siteConfig.themeColour} />
      {/* <!-- Windows Phone --> */}
      <meta
        name="msapplication-navbutton-color"
        content={siteConfig.themeColour}
      />
      {/* <!-- iOS Safari --> */}
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content={siteConfig.themeColour}
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
  )
}

export default HelmetMeta
