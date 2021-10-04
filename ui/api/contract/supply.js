const { allowCors } = require('../../apisrc/vercel-utils')
const ChickenContract = require('../../apisrc/ChickenContract.class')

/** Returns the current minted vs total counts. */
module.exports = allowCors(async (req, res) => {
  const contract = new ChickenContract()
  const [minted, total] = await Promise.all([
    contract.mintedCount(),
    contract.totalCount()
  ])
  res.setHeader('Cache-Control', 'public, s-max-age=5')
  res.json({ minted, total })
})
