// const Web3 = require('web3')
const { abi, address } = require('../../contract/Chicken_Fuji.json')
const Web3Eth = require('web3-eth')

class Contract {
  constructor(){
    const web3 = new Web3Eth(process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc')
    this.daiToken = new web3.Contract(abi, address)
  }

  async mintedCount() {
    return daiToken.methods.totalSupply().call()
  }

  async totalCount() {
    return daiToken.methods.maxSupply().call()
  }
}

module.exports = Contract