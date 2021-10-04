const fs = require('fs')
const path = require('path')
const { allowCors } = require('../../../apisrc/vercel-utils')
const ChickenContract = require('../../../apisrc/ChickenContract.class')

const BASE_TRAITS_KEY_MAP = {
  id: 'id',
  b: 'background',
  c: 'chicken',
  h: 'headwear',
  m: 'mouth',
  e: 'eyewear',
  n: 'neck',
  a: 'arms',
  t: 'tail',
  f: 'feet'
}

const BASE_TRAITS = {
  b: 'None', // background
  c: 'None', // chicken
  h: 'None', // headwear
  m: 'None', // mouth
  e: 'None', // eyewear
  n: 'None', // neck
  a: 'None', // arms
  t: 'None', // tail
  f: 'None' // feet
}

module.exports = allowCors(async (req, res) => {
  const { query: { tokenId } } = req

  // token must be a number
  if (isNaN(parseInt(tokenId))) return res.status(400).json({ message: 'Bad request: Invalid tokenId.' })
  const tid = parseInt(tokenId)

  const contract = new ChickenContract()
  const [minted, total, details] = await Promise.all([
    contract.mintedCount(),
    contract.totalCount(),
    contract.details(tokenId)
  ])

  // token must be in range
  if (!(tid >= 1 && tid <= total)) return res.status(416).json({ message: 'Range not satisfiable: TokenId not in range.' })

  // token must be minted
  if (tid > minted) return res.status(412).json({ message: 'Precondition failed: token has not yet been minted.' })

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data.json')))
  const chickenIndex = (tid - 1) % 10 // TODO remove mod 10
  let properties = { ...BASE_TRAITS, ...data[chickenIndex] }
  properties = Object.fromEntries(Object.entries(properties).map(([k, v]) => [BASE_TRAITS_KEY_MAP[k], v]))
  properties.image = `/images/${properties.id}.png`

  res.setHeader('Cache-Control', 'public, s-max-age=60')
  res.json({ properties, details })
})
