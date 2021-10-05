
const devHost = 'chickenrun-git-dev-mountainpass.vercel.app'
const prodHost = 'chikn.farm'
const host = process.env.NODE_ENV === 'production' ? prodHost : devHost

module.exports = {
  nftName: 'Chikn',
  title: 'Chikn',
  description: '8,008 algorithmically generated, unique Chikn.',
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
  // releaseDate: '2021-10-09T00:00:00+10:00',
  releaseDate: '2021-10-06T21:15:00+11:00',
  // v1
  pricing: [
    {
      label: '1x',
      price: '2.69',
      requiredRemaining: 1,
      description: 'Includes 1x organic Chikn.'
    },
    {
      label: '2x',
      price: '4.99',
      requiredRemaining: 2,
      description: 'Includes 2x organic, free range Chikn.'
    },
    {
      label: '3x',
      price: '7.197',
      requiredRemaining: 3,
      description: 'Includes 3x organic, free range, gluten free, vegan friendly Chikn.',
      highlight: true
    }
  ],
  // v2
  priceLookup: (count) => {
    if (count === 1) return 2.69
    if (count === 2) return 2.495
    else return 2.399
  }
}
