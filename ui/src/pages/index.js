import * as React from "react"
import Web3 from 'web3'
import ChickenRun from '../../contract/Chicken.json'
import { AVALANCHE_TESTNET_PARAMS } from '../utils/network'
import { InjectedConnector } from '@web3-react/injected-connector'
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 43114, 43113, 43112] })


const IndexPage = () => {

  const [account, setAccounts] = React.useState('')
  const [contract, setContract] = React.useState(null)
  const [totalSupply, setTotalSupply] = React.useState(0)
  const [tokens, setTokens] = React.useState([])
  const [tokenOwnByUser, setTokenOwnByUser] = React.useState(0)
  const [ownerTokenList, setOwnerTokenList] = React.useState([])

  React.useEffect(async () => {
    async function fetchWeb3() {
      await loadWeb3()
      await loadBlockchainData()
    }
    fetchWeb3()
    // addAvalancheNetwork()
  }, [])


  const connectWallet = () => {
    loadBlockchainData()
  }
  const addAvalancheNetwork = () => {
    injected.getProvider().then(provider => {
      provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [AVALANCHE_TESTNET_PARAMS]
        })
        .catch((error) => {
          console.log('Unable to push wallet', error)
        })
    })
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      // new way
      window.web3 = new Web3(window.ethereum)
      await window.eth_requestAccounts
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-etheruem brower detected')
    }
  }

  const loadBlockchainData = async () => {
    //fetch our smart contract 
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccounts(accounts[0]) // this is the first account that got selected
    // const git = await web3.eth.net.getId()
    // const networkData  = ChickenRun.networks[networkId]
    const abi = ChickenRun.abi
    const address = ChickenRun.address
    try {
      const myContract = new web3.eth.Contract(abi, address)
      setContract(myContract)
      const supply = await myContract.methods.totalSupply().call()
      setTotalSupply(supply)
      let allTokens = []
      for (let i = 0; i < supply; i++) {
        let newToken = await myContract.methods.chickens(i).call()
        allTokens.push(newToken)
      }
      setTokens(allTokens)
      const totalOwn = await myContract.methods.balanceOf(accounts[0]).call()
      setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log("No contract found here try the right network please --> AVAX", err)
    }
  }

  // if the token own change, refresh the list
  React.useEffect(() => {
    loopThroughUserTokens()
  }, [tokenOwnByUser])

  const loopThroughUserTokens = async () => {
    const temp = []
    for (let i = 0; i < tokenOwnByUser; i++) {
      const tokenDetail = await contract.methods.tokenOfOwnerByIndex(account, i).call()
      temp.push(tokenDetail)
    }
    setOwnerTokenList(temp)
  }

  const refreshContract = async () => {
    try {
      const supply = await contract.methods.totalSupply().call()
      setTotalSupply(supply)
      let newToken = await contract.methods.chickens(supply - 1).call()
      setTokens(pv => [...pv, newToken])
      const totalOwn = await contract.methods.balanceOf(account).call()
      await setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log("Try to refresh data", err)
    }
  }

  const mintToken = (e) => {
    e.preventDefault()
    // need to pass who is minting the coin
    contract.methods.mint().send({ from: account }).once('receipt', async (receipt) => {
      console.log("receipt from minting", receipt)
      refreshContract()
    })
  }

  return (
    <main>
      <title>Home Page</title>
      <div>Account: {account}</div>
      <div>Total: {totalSupply} / 8000</div>
      <hr />
      <div>
        <h1>Issue token</h1>
        <form onSubmit={mintToken}>
          <button type="submit">Mint</button>
        </form>
      </div>
      <hr />
      <div>
        {tokens.map((t, inx) => {
          return (<div key={inx}>Token: {t}</div>)
        })}
      </div>
      <hr />
      <div>
        Number of token the user own: {tokenOwnByUser}
        {ownerTokenList.map((t, inx) => {
          return (<div key={inx}>Token: {t}</div>)
        })}
      </div>
    </main>
  )
}

export default IndexPage
