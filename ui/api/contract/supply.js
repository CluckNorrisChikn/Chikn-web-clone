const Contract = require('../../contract/Contract.class')

/** Returns the current minted. */
const service = async (req, res) => {
  const contract = new Contract()
  const [ minted, total ] = await Promise.all([
    contract.mintedCount(),
    contract.totalCount(),
  ])
  res.setHeader('Cache-Control', 's-max-age=5')
  res.json({ minted, total })
}

module.exports = service