// const Web3 = require('web3')
const { abi, address } = require('../../contract/Chicken_Fuji.json')
const Web3Eth = require('web3-eth')

const url = process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc'

let daiToken = null

/** Returns the current minted. */
const service = async (req, res) => {
  if (daiToken === null) {
    const web3 = new Web3Eth(url)
    daiToken = new web3.Contract(abi, address)
  }
  const minted = await daiToken.methods.totalSupply().call()
  console.log('minted', minted)
  res.json({ minted })
}

module.exports = service