// const Web3 = require('web3')
const { abi, address } = require('../contract/Chicken_Fuji.json')
const Web3Eth = require('web3-eth')

class ChickenContract {
  constructor() {
    const web3 = new Web3Eth(process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc')
    this.daiToken = new web3.Contract(abi, address)
  }

  /**
   * @returns {number} the count of minted tokens.
   */
  async mintedCount() {
    return this.daiToken.methods.totalSupply().call()
  }

  /**
   * @returns {number} the count of total tokens.
   */
  async totalCount() {
    return this.daiToken.methods.maxSupply().call()
  }
}

module.exports = ChickenContract
