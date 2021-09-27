/* eslint-disable no-unused-vars */
import * as React from 'react'
import { Section, StackCol, StackRow } from '../components/Common'
import { ConnectWalletButton } from '../components/ConnectWalletButton'
import Layout from '../components/Layout'

import Web3 from 'web3/dist/web3.min.js'
import ChickenRun from '../../contract/Chicken_Fuji.json'
// import { AVALANCHE_TESTNET_PARAMS } from '../utils/network'
import { InjectedConnector } from '@web3-react/injected-connector'
import { Alert, Button, Card, Spinner, Table } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'

const ChickenCard = styled(({ className = '', ...props }) => (
  <Card className={`${className} rounded-3 shadow`} {...props} />
))`
  max-width: 300px;
`

const isBrowser = typeof window !== 'undefined'

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 43114, 43113, 43112]
})

const IndexPage = () => {
  const [web3Supported, setWeb3Supported] = React.useState(null)
  const [account, setAccounts] = React.useState('')
  const [contract, setContract] = React.useState(null)
  const [currentSupply, setCurrentSupply] = React.useState(0)
  const [maxSupply, setMaxSupply] = React.useState(0)
  const [tokens, setTokens] = React.useState([])
  const [tokenOwnByUser, setTokenOwnByUser] = React.useState(0)
  const [ownerTokenList, setOwnerTokenList] = React.useState([])
  const [metamaskConnected, setMetamaskConnected] = React.useState(false)
  const [isMinting, setIsMinting] = React.useState(false)

  React.useEffect(() => {
    async function fetchWeb3() {
      try {
        console.debug('loading web3...')
        await loadWeb3()
        console.debug('loading blockchain data...')
        await loadBlockchainData()
      } catch (err) {
        console.error(err.message, { stack: err.stack })
      }
    }
    if (isBrowser) {
      fetchWeb3()
      // addAvalancheNetwork()
    }
  }, [])

  // const connectWallet = () => {
  //   loadBlockchainData()
  // }

  // const addAvalancheNetwork = () => {
  //   injected.getProvider().then((provider) => {
  //     provider
  //       .request({
  //         method: 'wallet_addEthereumChain',
  //         params: [AVALANCHE_TESTNET_PARAMS]
  //       })
  //       .catch((error) => {
  //         console.log('Unable to push wallet', error)
  //       })
  //   })
  // }

  const loadWeb3 = async () => {
    if (isBrowser) {
      if (window.ethereum) {
        // new way
        window.web3 = new Web3(window.ethereum)
        setWeb3Supported(true)
        await window.eth_requestAccounts
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        setWeb3Supported(true)
      } else {
        setWeb3Supported(false)
        return Promise.reject(new Error('Browser does not support Web3.'))
      }
    }
  }

  const loadBlockchainData = async () => {
    // fetch our smart contract
    console.debug('got here 1')
    const web3 = window.web3

    // web3.on('accountsChanged', (code, reason) => {
    //   console.log("on account changed",code, reason )
    //   const accountSwitch = code[0];
    //   if (accountSwitch) {

    //   } else {

    //   }
    // });

    console.debug('got here 2')
    const accounts = await web3.eth.getAccounts()
    console.debug(`web3: found accounts - ${accounts.length}}`)
    if (accounts.length === 0) {
      setMetamaskConnected(false)
    } else {
      setMetamaskConnected(true)
      setAccounts(accounts[0]) // this is the first account that got selected
      let accountBalance = await web3.eth.getBalance(accounts[0])
      accountBalance = web3.utils.fromWei(accountBalance, 'Ether')
      console.log('account balance', accountBalance)
    }
    // const git = await web3.eth.net.getId()
    // const networkData  = ChickenRun.networks[networkId]
    const abi = ChickenRun.abi
    const address = ChickenRun.address
    try {
      const myContract = new web3.eth.Contract(abi, address)
      setContract(myContract)

      // subscribe to contract events from
      // const subscription = web3.eth.subscribe('logs', (err, event) => {
      //   if (!err) console.log('None error event -->', event)
      // })

      // subscription.on('data', (event) => console.log('data -->', event))
      // subscription.on('changed', (changed) =>
      //   console.log('changed --> ', changed)
      // )
      // subscription.on('error', (err) => {
      //   throw err
      // })
      // subscription.on('connected', (nr) => console.log('conencted', nr))

      const maxSupply = await myContract.methods.maxSupply().call()
      setMaxSupply(maxSupply)
      const supply = await myContract.methods.totalSupply().call()
      setCurrentSupply(supply)
      const allTokens = []
      for (let i = 1; i <= supply; i++) {
        const newToken = await myContract.methods.allChickenRun(i).call()
        allTokens.push(newToken)
      }
      setTokens(allTokens)
      const totalOwn = await myContract.methods.balanceOf(accounts[0]).call()
      setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log(
        'No contract found here try the right network please --> AVAX',
        err
      )
    }
  }

  const connectToMetamask = async () => {
    await window.ethereum.enable()
    setMetamaskConnected(true)
    window.location.reload() // NOTE is this required?!
  }

  const disconnectMetaMask = async () => {
    // TODO implement
    // await web3Modal.clearCachedProvider()
  }

  // if the token own change, refresh the list
  React.useEffect(() => {
    loopThroughUserTokens()
  }, [tokenOwnByUser])

  const loopThroughUserTokens = async () => {
    const temp = []
    for (let i = 0; i < tokenOwnByUser; i++) {
      const tokenDetail = await contract.methods
        .tokenOfOwnerByIndex(account, i)
        .call()
      const chicken = await contract.methods.allChickenRun(tokenDetail).call()
      temp.push(chicken)
    }
    setOwnerTokenList(temp)
  }

  /**
   * Re-retrieve contract details.
   */
  const refreshContract = async () => {
    try {
      const supply = await contract.methods.totalSupply().call()
      setCurrentSupply(supply)
      const allTokens = []
      for (let i = 1; i <= supply; i++) {
        const newToken = await contract.methods.allChickenRun(i).call()
        allTokens.push(newToken)
      }
      setTokens(allTokens)
      const totalOwn = await contract.methods.balanceOf(account).call()
      await setTokenOwnByUser(totalOwn)
    } catch (err) {
      console.log('Try to refresh data', err)
    }
  }

  /**
   * Mints the actual token.
   */
  const mintToken = (e) => {
    // e.preventDefault()
    setIsMinting(true)
    const price = window.web3.utils.toWei('2', 'Ether') // 2 AVAX
    // need to pass who is minting the coin
    // call server to get new
    const tokenURI = `https://chickenrun.io/${uuidv4()}`
    // console.log('minting the following token with ', tokenURI)
    contract.methods
      .mint(tokenURI)
      .send({ from: account, value: price })
      .on('transactionHash', async (txHash) => {
        // pending
        console.log('tx hash is return', txHash)
      })
      .on('receipt', async (receipt) => {
        // success
        console.log('receipt from minting', receipt)
        setIsMinting(false)
        refreshContract()
      })
      .on('error', (err) => {
        // error
        setIsMinting(false)
        console.log('Error minting', err)
      })
  }

  const shortFormAccountNum = () => {
    const firstHalf = account.substring(0, 4)
    const lastHalf = account.substring(38)
    return `${firstHalf}...${lastHalf}`
  }

  return (
    <Layout>
      <h1>Mint</h1>

      <Section className="bg-light">
        <h3>
          Chickens Minted: {currentSupply} / {maxSupply}
        </h3>
      </Section>

      <Section className="border">
        <StackCol className="gap-3">
          <p>You will need to connect your wallet before claiming an NFT.</p>

          {web3Supported === null && (
            <Spinner animation="border" className="m-3" />
          )}
          {web3Supported === false && (
            <Alert variant="info">
              Non-Ethereum browser detected. You should consider trying
              MetaMask!
            </Alert>
          )}
          {/* {web3Supported === true && <ConnectWalletButton />} */}
          {web3Supported === true && (
            <StackRow className="gap-3 justify-content-center">
              {/* connect */}
              <Button
                variant="primary"
                disabled={account}
                onClick={() => connectToMetamask()}
              >
                {account ? shortFormAccountNum() : 'Connect Wallet'}
              </Button>
              {/* disconnect */}
              <Button
                variant="outline-primary"
                disabled={true}
                onClick={() => disconnectMetaMask()}
              >
                Disconnect Wallet
              </Button>
            </StackRow>
          )}
          <Button
            type="button"
            size="lg"
            variant="outline-primary"
            onClick={() => mintToken()}
          >
            Mint my Chicken!
          </Button>
          {/* <div>Number of tokens you currently own: {tokenOwnByUser}</div> */}
        </StackCol>

        {/* <form onSubmit={mintToken}> */}
        {/* </form> */}
        {/* <div>
          {tokens.map((t, inx) => {
            return <div key={inx}>Token: {JSON.stringify(t)}</div>
          })}
        </div> */}
        {/* {ownerTokenList.map((t, inx) => {
            return <div key={inx}>Token: {t}</div>
          })} */}
      </Section>

      <h3>My Chickens ({tokenOwnByUser})</h3>

      {/* {"0":"2",
      "1":"https://chickenrun.io/7cab5b9e-f762-42de-b3be-50af9a094be3",
      "2":"0xd363EC3bc20c6842A198195453E7f1d877C708D1",
      "3":"0xd363EC3bc20c6842A198195453E7f1d877C708D1",
      "4":"0x0000000000000000000000000000000000000000",
      "5":"2000000000000000000",
      "6":"0",
      "7":false,
      "tokenId":"2",
      "tokenURI":"https://chickenrun.io/7cab5b9e-f762-42de-b3be-50af9a094be3",
      "mintedBy":"0xd363EC3bc20c6842A198195453E7f1d877C708D1",
      "currentOwner":"0xd363EC3bc20c6842A198195453E7f1d877C708D1",
      "previousOwner":"0x0000000000000000000000000000000000000000",
      "price":"2000000000000000000",
      "numberOfTransfers":"0",
      "forSale":false} */}
      <Section className="border">
        <StackRow>
          {ownerTokenList.map((token, i) => {
            return (
              <ChickenCard key={i}>
                <Card.Img
                  variant="top"
                  src={'/images/3fe19ff5-469c-4f90-b760-477b852d2617.png'}
                />
                <Card.Body>
                  <Card.Title>#{token.tokenId}</Card.Title>
                  <Card.Text>
                    <h5>Traits (TBD)</h5>
                    <Table>
                      <tr>
                        <th>For Sale</th>
                        <td>{token.forSale ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th>Last Sale Price</th>
                        <td>
                          {(
                            parseInt(token.price) / 1000000000000000000
                          ).toLocaleString()}{' '}
                          AVAX
                        </td>
                      </tr>
                      {/* <tr>
                        <th>Current Owner</th>
                        <td>$11</td>
                      </tr> */}
                      <tr>
                        <th>Number of Sales</th>
                        <td>
                          {parseInt(token.numberOfTransfers).toLocaleString()}
                        </td>
                      </tr>
                    </Table>
                  </Card.Text>
                </Card.Body>
              </ChickenCard>
            )
          })}
        </StackRow>
      </Section>
    </Layout>
  )
}

export default IndexPage
