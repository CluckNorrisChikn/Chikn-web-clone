import * as React from "react"
import Web3 from 'web3'
import ChickenRun from '../../contract/Chicken.json'
import { AVALANCHE_TESTNET_PARAMS } from '../utils/network'
import { InjectedConnector } from '@web3-react/injected-connector'
import { v4 as uuidv4 } from 'uuid';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 43114, 43113, 43112] })


const IndexPage = () => {

  const [account, setAccounts] = React.useState('')
  const [contract, setContract] = React.useState(null)
  const [currentSupply, setCurrentSupply] = React.useState(0)
  const [maxSupply, setMaxSupply] = React.useState(0)
  const [tokens, setTokens] = React.useState([])
  const [tokenOwnByUser, setTokenOwnByUser] = React.useState(0)
  const [ownerTokenList, setOwnerTokenList] = React.useState([])
  const [metamaskConnected, setMetamaskConnected] = React.useState(false)
  const [isMinting, setIsMinting] = React.useState(false)

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
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }


  const loadBlockchainData = async () => {
    //fetch our smart contract 
    const web3 = window.web3

    // web3.on('accountsChanged', (code, reason) => {
    //   console.log("on account changed",code, reason )
    //   const accountSwitch = code[0];
    //   if (accountSwitch) {

    //   } else {

    //   }
    // });

    const accounts = await web3.eth.getAccounts()
    if (accounts.length === 0) {
      setMetamaskConnected(false)
    } else {
      setMetamaskConnected(true)
      setAccounts(accounts[0]) // this is the first account that got selected
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      console.log("account balance", accountBalance)
    }
    // const git = await web3.eth.net.getId()
    // const networkData  = ChickenRun.networks[networkId]
    const abi = ChickenRun.abi
    const address = ChickenRun.address
    try {
      const myContract = new web3.eth.Contract(abi, address)
      setContract(myContract)

      //subscribe to contract events from
      let subscription = web3.eth.subscribe('logs', (err, event) => {
        if (!err)
          console.log('None error event -->', event)
      });

      subscription.on('data', event => console.log('data -->', event))
      subscription.on('changed', changed => console.log('changed --> ', changed))
      subscription.on('error', err => { throw err })
      subscription.on('connected', nr => console.log('conencted', nr))

      const maxSupply = await myContract.methods.maxSupply().call()
      setMaxSupply(maxSupply)
      const supply = await myContract.methods.totalSupply().call()
      setCurrentSupply(supply)
      let allTokens = []
      for (let i = 1; i <= supply; i++) {
        let newToken = await myContract.methods.allChickenRun(i).call()
        allTokens.push(newToken)
      }
      setTokens(allTokens)
      const totalOwn = await myContract.methods.balanceOf(accounts[0]).call()
      setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log("No contract found here try the right network please --> AVAX", err)
    }
  }

  const connectToMetamask = async () => {
    await window.ethereum.enable();
    setMetamaskConnected(true);
    window.location.reload();
  }

  const disconnectMetaMask = async () => {
    // await web3Modal.clearCachedProvider();
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
      setCurrentSupply(supply)
      let allTokens = []
      for (let i = 1; i <= supply; i++) {
        let newToken = await contract.methods.allChickenRun(i).call()
        allTokens.push(newToken)
      }
      setTokens(allTokens)
      const totalOwn = await contract.methods.balanceOf(account).call()
      await setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log("Try to refresh data", err)
    }
  }

  const mintToken = (e) => {
    e.preventDefault()
    setIsMinting(true)
    const price = window.web3.utils.toWei('2', "Ether") // 2 AVAX
    // need to pass who is minting the coin
    const tokenURI = `https://chickenrun.io/${uuidv4()}`

    console.log("minting the following token with ", tokenURI)
    contract.methods.mint(tokenURI).send({ from: account, value: price })
      .on('transactionHash', async (txHash) => {
        console.log("tx hash is return", txHash)
      })
      .on('receipt', async (receipt) => {
        console.log("receipt from minting", receipt)
        setIsMinting(false)
        refreshContract()
      })
      .on('error', (err) => {
        setIsMinting(false)
        console.log("Error minting", err)
      })
  

  }

  const shortFormAccountNum = () => {
    let firstHalf = account.substring(0, 4)
    let lastHalf = account.substring(38)
    return `${firstHalf}...${lastHalf}`
  }

  return (
    <main>
      <title>Home Page</title>
      <Button variant="primary" disabled={account} onClick={() => connectToMetamask()}>{account ? shortFormAccountNum() : 'Connect Wallet'}</Button>
      {!account && <Button variant="primary" disabled={account} onClick={() => disconnectMetaMask()}>Disconnect Wallet'</Button>}
      <div>Total: {currentSupply} / {maxSupply}</div>
      <div dstyle={{ height: '30px', width: '200px', border: '1px solid grey', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
      <hr />
      <div>
        <h1>Mint token</h1>
        <form onSubmit={mintToken}>
          <Button type="submit" variant="success">Mint</Button>
        </form>
      </div>
      <hr />
      <div>
        {tokens.map((t, inx) => {
          return (<div key={inx}>Token: {JSON.stringify(t)}</div>)
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