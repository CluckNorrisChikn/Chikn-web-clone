// const Web3 = require('web3')
const { abi, address } = require('../contract/Chicken_Fuji.json')
const Web3Eth = require('web3-eth')

/**
 * @typedef {Object} ChickenDetails
 * @property {string} tokenId // e.g. '3',
 * @property {string} tokenURI // e.g. 'https://chickenrun.io/5126a23d-b59b-4841-a7ee-1621f0320947',
 * @property {string} mintedBy // e.g. '0x20e63CB166a90c22a7afC5623AEE59d8D8988Ec5',
 * @property {string} currentOwner // e.g. '0x20e63CB166a90c22a7afC5623AEE59d8D8988Ec5',
 * @property {string} previousOwner // e.g. '0x0000000000000000000000000000000000000000',
 * @property {string} price // e.g. '2000000000000000000',
 * @property {string} numberOfTransfers // e.g. '0',
 * @property {boolean} forSale // e.g. false
 */
class ChickenContract {
  constructor() {
    const web3 = new Web3Eth(process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc')
    this.contract = new web3.Contract(abi, address)
  }

  /**
   * @returns {Promise<number>} the count of minted tokens.
   */
  async mintedCount() {
    return this.contract.methods.totalSupply().call()
  }

  /**
   * @returns {Promise<number>} the count of total tokens.
   */
  async totalCount() {
    return this.contract.methods.maxSupply().call()
  }

  /**
   * @returns {Promise<ChickenDetails>} details of the chicken.
   */
  async details(tokenId) {
    if (typeof tokenId === 'undefined') throw new Error('Missing parameter - tokenId')
    const { price, numberOfTransfers, ...details } = await this.daiToken.methods.allChickenRun(tokenId).call()
    return { ...details, price: parseInt(price) / Math.pow(10, 18), numberOfTransfers: parseInt(numberOfTransfers) }
  }
}

module.exports = ChickenContract
