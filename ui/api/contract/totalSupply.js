const Web3 = require('web3')
const { abi, address } = require('../../contract/Chicken_Fuji.json')

const url = process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc'

let daiToken = null

/** Returns the current minted. */
const service = async (req, res) => {
  if (daiToken === null) {
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    daiToken = new web3.eth.Contract(abi, address)
  }
  const minted = await daiToken.methods.totalSupply().call()
  res.json({ minted })
}

module.exports = service