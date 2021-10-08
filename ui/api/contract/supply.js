const { allowCors } = require('../../apisrc/vercel-utils')
const ChickenContract = require('../../apisrc/ChickenContract.class')

const getMintAndTotal = async () => {
  const contract = new ChickenContract()
  const [minted, total] = await Promise.all([
    contract.mintedCount(),
    contract.totalCount()
  ])
  return { minted, total }
}

/** Returns the current minted vs total counts. */
module.exports = allowCors(async (req, res) => {
  res.setHeader('Cache-Control', 'public, s-max-age=5')
  res.json(await getMintAndTotal())
})

// ; (async () => {
//   console.log('getMintAndTotal', await getMintAndTotal())
// })()
