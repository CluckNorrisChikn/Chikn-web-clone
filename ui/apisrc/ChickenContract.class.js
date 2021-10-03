// const Web3 = require('web3')
const { abi, address } = require('../contract/Chicken_Fuji.json')
const Web3Eth = require('web3-eth')

class ChickenContract {
  constructor() {
    const web3 = new Web3Eth(process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc')
    this.contract = new web3.Contract(abi, address)
  }

  /**
   * @returns {number} the count of minted tokens.
   */
  async mintedCount() {
    return this.contract.methods.totalSupply().call()
  }

  /**
   * @returns {number} the count of total tokens.
   */
  async totalCount() {
    return this.contract.methods.maxSupply().call()
  }
}

module.exports = ChickenContract
