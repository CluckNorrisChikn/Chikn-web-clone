// N.B. MUST BE IN THIS FORMAT!
const GATSBY_CONFIG = process.env.GATSBY_CONFIG || 'production'
const GATSBY_FT_CONNECT_WALLET_ENABLED =
  process.env.GATSBY_FT_CONNECT_WALLET_ENABLED || 'true'

const isProd = GATSBY_CONFIG === 'production'

const host = isProd
  ? 'chikn.farm'
  : 'chickenrun-git-dev-mountainpass.vercel.app'

// google tag manager configuration
const gtm = {
  id: 'GTM-NFLTF75'
}

const siteConfig = {
  includePrivatePages: !isProd,
  nftName: 'chikn',
  title: 'chikn',
  cdnUrl: 'https://cdn1.chikn.farm/images/',
  description:
    '10,000 algorithmically generated, unique chikn NFTs that lay $egg',
  url: `https://${host}`,
  imageUrl: `https://${host}/brand/banner_og-1200x630px.jpg`,
  image2by1Url: `https://${host}/brand/banner_og-1260x630px.jpg`,
  imageSquareUrl: `https://${host}/brand/banner_og-630x630px.jpg`,
  imageAlt:
    'A stylised farm scene showing grassy hills, two large red barns, free range chickens and the Chicken logo.',
  imageWidthPx: '1200',
  imageHeightPx: '630',
  themeColour: '#DF3F3D',
  keywords:
    'avalanche,avax,network,nft,chikn,chicken,chickn,chiken,gb,ecosystem,token,mint,minting,farm,farming,marketplace,$egg,$feed',
  author: `noreply@${host}`,
  links: {
    discord: 'https://discord.gg/chikn',
    twitter: 'https://twitter.com/chikn_farm',
    twitterAt: '@chikn_farm',
    docs: 'https://docs.chikn.farm/'
  },
  featureToggles: {
    connectWalledEnabled: GATSBY_FT_CONNECT_WALLET_ENABLED !== 'false'
  },
  publicMint: {
    title_open: 'Minting now open!',
    title_closed: 'Minting now closed.',
    releaseDate: '2021-11-12T22:00:00+0000',
    maxAllocation: 10000,
    maxPerMint: 12,
    limitPerWallet: 50,
    priceLookup: (count) => {
      if (count === 1) return 2.69
      if (count === 2) return 2.495
      else return 2.399
    }
  },
  gbMint: {
    title_open: 'GB Pre-Minting is now open!',
    title_closed: 'GB Pre-Minting is now closed.',
    maxAllocation: 1000,
    releaseDate: '2021-11-10T22:00:00+0000',
    maxPerMint: 1,
    limitPerWallet: 1,
    priceLookup: () => 0
  },
  gtm
}

console.log(`Using env: ${JSON.stringify(process.env, null, 2)}`)
console.log(`Using siteConfig: ${JSON.stringify(siteConfig, null, 2)}`)

module.exports = siteConfig
