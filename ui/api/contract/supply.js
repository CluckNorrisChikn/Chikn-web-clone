const ChickenContract = require('../../contract/ChickenContract.class')

/** Returns the current minted vs total counts. */
module.exports = async (req, res) => {
  const contract = new ChickenContract()
  const [minted, total] = await Promise.all([
    contract.mintedCount(),
    contract.totalCount()
  ])
  res.setHeader('Cache-Control', 's-max-age=5')
  res.json({ minted, total })
}
