const fs = require('fs')
const path = require('path')

const TOTAL_TOKENS = 10

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

module.exports = (req, res) => {
  const { query: { tokenId } } = req
  if (isNaN(parseInt(tokenId))) {
    // 400 Bad Request
    return res.status(400).json({ message: 'Invalid tokenId.' })
  }
  const tid = parseInt(tokenId) - 1
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')))
  if (tid < 0 || tid >= data.length) {
    // 416 Range Not Satisfiable
    return res.status(416).json({ message: 'TokenId not in range.' })
  }

  // TODO check if token has not been minted yet...
  // 412 Precondition failed

  let record = { ...BASE_TRAITS, ...data[tokenId] }
  record = Object.fromEntries(Object.entries(record).map(([k, v]) => [BASE_TRAITS_KEY_MAP[k], v]))
  record.image = `/images/${record.id}.png`

  res.json(record)
}
