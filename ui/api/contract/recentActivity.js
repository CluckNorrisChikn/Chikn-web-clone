const { allowCors } = require('../../apisrc/vercel-utils')
const ChickenContract = require('../../apisrc/ChickenContract.class')

/**
 * @typedef {Object} PastEvent
 * @property {string} address //'0xE72BCE29f39ca8495D23FD13ABEd73deeC51e16f',
 * @property {number} blockNumber //1910752,
 * @property {string} transactionHash //'0x6ba0b0c753bff6a16d512b160beaa740de4f2cd7576f6d79ab722ae96092e49a',
 * @property {number} transactionIndex //0,
 * @property {string} blockHash //'0x182bf59bcbf2fdc0bbc1297bfd1a7c146a49104ae953eda47b64a72961ffc4e3',
 * @property {number} logIndex //0,
 * @property {boolean} removed //false,
 * @property {string} id //'log_c4589d5a',
 * @property {Object} returnValues //Result {
 * @property {string} returnValues.from //'0x0000000000000000000000000000000000000000',
 * @property {string} returnValues.to //'0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC',
 * @property {string} returnValues.tokenId //'28'
 * @property {string} },
 * @property {string} event //'Transfer',
 * @property {string} signature //'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 * @property {string} raw //{ data: '0x', topics: [Array] }
 */

/**
 * Gets the latest X events for the contract off the blockchain, sorted by time descending.
 * @param {*} limit
 * @returns {object}
 */
const getLatestEvents = async (limit = 12) => {
  const contract = new ChickenContract()
  const PAGE_LIMIT = 10000
  let to = await contract.web3.getBlockNumber()
  let from = to - PAGE_LIMIT
  /** @type {PastEvent[]} */
  let events = []
  while (from > 0 && events.length < limit) {
    console.log(`searching range - ${JSON.stringify({ from, to, pageLimit: PAGE_LIMIT })} - eventsFound=${events.length}`)
    const tmp = await contract.contract.getPastEvents('allEvents', { fromBlock: from, toBlock: to })
    events = [...events, ...tmp]
    // setup vars for next iteration...
    to = from - 1
    from = to - PAGE_LIMIT
  }
  return events.sort((a, b) => b.blockNumber - a.blockNumber).map(e => {
    const { from, to, tokenId } = e.returnValues
    return { from, to, tokenId: parseInt(tokenId) }
  }).slice(0, limit)
}

/**
 * Returns the latest 12 events.
 * @link https://web3js.readthedocs.io/en/v1.2.9/web3-eth-contract.html#getpastevents
 * */
module.exports = allowCors(async (req, res) => {
  res.setHeader('Cache-Control', 'public, s-max-age=60')
  res.json(await getLatestEvents(12))
})

// ;(async () => {
//   console.log('getLatestEvents', JSON.stringify(await getLatestEvents(), null, 2))
// })()
