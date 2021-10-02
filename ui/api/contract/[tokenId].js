const fs = require('fs')
const path = require('path')
const { allowCors } = require('../../apisrc/vercel-utils')
const ChickenContract = require('../../contract/ChickenContract.class')

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
  const tid = parseInt(tokenId) - 1
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')))

  // token must be in range
  if (tid < 0 || tid >= data.length) return res.status(416).json({ message: 'Range not satisfiable: TokenId not in range.' })

  const contract = new ChickenContract()
  const minted = await contract.mintedCount()

  // token must be minted
  if (minted < tokenId) return res.status(412).json({ message: 'Precondition failed: token has not yet been minted.' })

  let record = { ...BASE_TRAITS, ...data[tokenId] }
  record = Object.fromEntries(Object.entries(record).map(([k, v]) => [BASE_TRAITS_KEY_MAP[k], v]))
  record.image = `/images/${record.id}.png`

  res.setHeader('Cache-Control', 's-max-age=60')
  res.json(record)
})
