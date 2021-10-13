
const isProd = process.env.NODE_ENV === 'production'

const host = isProd ? 'chikn.farm' : 'chickenrun-git-dev-mountainpass.vercel.app'

// google tag manager configuration
const gtm = {
  id: 'GTM-NFLTF75'
}

module.exports = {
  nftName: 'chikn',
  title: 'chikn',
  description: '10,000 algorithmically generated, unique chikn.',
  subdescription: 'NFT + Farm + TriToken Economy',
  url: `https://${host}`,
  imageUrl: `https://${host}/brand/banner_og-1200x630px.jpg`,
  imageWidthPx: '1200',
  imageHeightPx: '630',
  themeColour: '#DF3F3D',
  keywords: 'avax,nft,chikn,chicken',
  author: `noreply@${host}`,
  links: {
    discord: 'https://discord.gg/CRuxFQRDsN',
    twitter: 'https://twitter.com/chikn_farm',
    docs: 'https://docs.chikn.farm/'
  },
  featureToggles: {
    connectWalledEnabled: process.env.GATSBY_FT_CONNECT_WALLET_ENABLED !== 'false'
  },
  // releaseDate: '2021-10-09T00:00:00+10:00',
  releaseDate: '2021-10-06T21:15:00+11:00',
  maxPerMint: 12,
  limitPerWallet: 50,
  // v1 - deprecatd
  pricing: [
    {
      label: '1x',
      price: '2.69',
      requiredRemaining: 1,
      description: 'Includes 1x organic chikn.'
    },
    {
      label: '2x',
      price: '4.99',
      requiredRemaining: 2,
      description: 'Includes 2x organic, free range chikn.'
    },
    {
      label: '3x',
      price: '7.197',
      requiredRemaining: 3,
      description: 'Includes 3x organic, free range, gluten free, vegan friendly chikn.',
      highlight: true
    }
  ],
  // v2
  priceLookup: (count) => {
    if (count === 1) return 2.69
    if (count === 2) return 2.495
    else return 2.399
  },
  gtm
}
