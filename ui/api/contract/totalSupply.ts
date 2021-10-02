

import { VercelRequest, VercelResponse } from '@vercel/node';
import Web3 from 'web3'
import { abi, address } from './Chicken_Fuji.json'

const url = process.env.WEB3_URL || 'https://api.avax-test.network/ext/bc/C/rpc'

let daiToken = null

/** Returns the current minted. */

export default async (req: VercelRequest, res: VercelResponse) => {
  if (daiToken === null) {
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    daiToken = new web3.eth.Contract(abi as any, address)
  }
  const minted = await daiToken.methods.totalSupply().call()
  res.json({ minted })
}
