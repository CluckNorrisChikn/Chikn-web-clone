import * as React from 'react'
import { Helmet } from 'react-helmet'
import siteConfig from '../../site-config'

const HelmetMeta = (props) => {
  const { pageName, title, description, url, imageUrl, imageWidthPx, imageHeightPx, imageAlt } = props

  return (
    <Helmet>
      {/* <!-- page --> */}
      <meta charSet="utf-8" />
      <title>
        {title || siteConfig.title}
        {pageName ? ` - ${pageName}` : ''}
      </title>
      <meta name="description" content={description || siteConfig.description} />
      <link rel="canonical" href={url || siteConfig.url} />

      {/* <!-- meta --> */}
      <meta name="title" content={title || siteConfig.title} />
      <meta name="description" content={description || siteConfig.description} />
      <meta name="keywords" content={siteConfig.keywords} />
      <meta name="image" content={imageUrl || siteConfig.imageUrl} />
      <meta name="url" content={url || siteConfig.url} />

      {/* <!-- og --> */}
      <meta property="og:title" content={title || siteConfig.title} />
      <meta property="og:description" content={description || siteConfig.description} />
      <meta property="og:image" content={imageUrl || siteConfig.imageUrl} />
      <meta property="og:image:width" content={imageWidthPx || siteConfig.imageWidthPx} />
      <meta property="og:image:height" content={imageHeightPx || siteConfig.imageHeightPx} />
      <meta property="og:image:alt" content={imageAlt || siteConfig.imageAlt} />
      <meta property="og:url" content={url || siteConfig.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title || siteConfig.title} />

      {/* <!-- twitter --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteConfig.title} />
      <meta name="twitter:site" content={siteConfig.links.twitterAt} />
      <meta name="twitter:description" content={description || siteConfig.description} />
      <meta name="twitter:image" content={imageUrl || siteConfig.image2by1Url} />
      <meta name="twitter:image:alt" content={imageAlt || siteConfig.imageAlt} />

      {/* <!-- Chrome, Firefox OS and Opera --> */}
      <meta name="theme-color" content={siteConfig.themeColour} />
      {/* <!-- Windows Phone --> */}
      <meta name="msapplication-navbutton-color" content={siteConfig.themeColour} />
      {/* <!-- iOS Safari --> */}
      <meta name="apple-mobile-web-app-status-bar-style" content={siteConfig.themeColour} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
  )
}

export default HelmetMeta
