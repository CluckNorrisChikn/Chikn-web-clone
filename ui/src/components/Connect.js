import React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import ChickenRun from '../../contract/Chicken_Fuji.json'
//  TODO: use mainnet contract
import { BigNumber, Contract, utils, Event } from 'ethers'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const getErrorMessage = (error) => {
  console.log(error)

  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network. Please connect to Fuji network" // TODO: change the name to mainnet
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return 'Please authorize this website to access your AVAX account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

// shortern the transactionHash
export const toShort = (value, factor = 5) => {
  const slice = Math.round(value.length / factor)
  return `${value.substring(0, slice)}...${value.substring(value.length - slice, value.length)}`
}

const TIMEOUT_1_MIN = 60 * 1000

const MINT_PRICE = '2'

export const KEYS = {
  CONTRACT: () => ['CONTRACT'],
  CONTRACT_TOTALSUUPLY: () => ['CONTRACT', 'TOTAL_SUPPLY'],
  CONTRACT_CURRENTSUPPLY: () => ['CONTRACT', 'CURRENTSUPPLY'],
  WALLET: () => ['WALLET'],
  WALLET_TOKEN: () => ['WALLET', 'WALLET_TOKEN'],
  WALLET_BALANCE: () => ['WALLET', 'WALLET_BALANCE'],
  TRANSACTION: () => ['TRANSACTION']
}

// GET contract
export const useGetContractQuery = () => {
  const { library, error } = useWeb3React()
  // queryClient.invalidateQueries(KEYS.WALLET())
  const [enabledContract, setEnableContract] = React.useState(false)

  React.useEffect(() => {
    setEnableContract(typeof library !== 'undefined')
  }, [library])

  return useQuery(
    KEYS.CONTRACT(),
    async () => {
      let errorMessage = null
      try {
        const abi = ChickenRun.abi
        const address = ChickenRun.address

        let contract = null
        let name = null
        let symbol = null

        if (error || !library) {
          errorMessage = getErrorMessage(error)
        } else {
          contract = new Contract(address, abi, library.getSigner())
          name = await contract.name()
          symbol = await contract.symbol()
        }

        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            contract,
            contractDetail: {
              name,
              symbol,
              address
            }
          })
        })
      } catch (err) {
        console.error('Error trying to get contract', err)
        errorMessage = getErrorMessage(err)
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract,
      cacheTime: TIMEOUT_1_MIN * 5,
      staleTime: TIMEOUT_1_MIN * 5
    }
  )
}

export const useGetUserWalletAddressQuery = () => {
  const { library, account, error } = useWeb3React()
  const queryClient = useQueryClient()

  const [enabledContract, setEnableContract] = React.useState(false)
  const [currentAddress, setCurrentAddress] = React.useState(null)

  React.useEffect(() => {
    if (currentAddress !== account) {
      setEnableContract(typeof library !== 'undefined' && typeof account !== 'undefined')
    }
  }, [library, account, currentAddress, queryClient])

  return useQuery(
    KEYS.WALLET(),
    async () => {
      let errorMessage = null
      try {
        if (error) {
          errorMessage = getErrorMessage(error)
        }
        setCurrentAddress(account)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            isAuthenticated: true,
            user: { address: account || '' }
          })
        })
      } catch (err) {
        console.error('Error getting user wallet address', err)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useGetWalletBalanceQuery = () => {
  const { library, account, error } = useWeb3React()

  const [enabledContract, setEnableContract] = React.useState(false)
  const [currentAddress, setCurrentAddress] = React.useState(null)

  React.useEffect(() => {
    if (currentAddress !== account) {
      setEnableContract(typeof library !== 'undefined')
    }
  }, [library, account, currentAddress])

  return useQuery(
    KEYS.WALLET_BALANCE(),
    async () => {
      let errorMessage = null
      let balance = null
      try {
        if (error) {
          errorMessage = getErrorMessage(error)
        } else {
          balance = utils.formatEther(await library.getBalance(account || ''))
        }
        setCurrentAddress(account)
        setEnableContract(false) // reset this to false

        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            balance: balance.toString()
          })
        })
      } catch (err) {
        console.error('Error getting user wallet balance', err)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useGetWalletTokensQuery = () => {
  const { library, account, error } = useWeb3React()
  const useContract = useGetContractQuery()

  const [enabledContract, setEnableContract] = React.useState(false)
  const [currentAddress, setCurrentAddress] = React.useState(null)

  React.useEffect(() => {
    if (currentAddress !== account) {
      setEnableContract(typeof library !== 'undefined' && useContract.isSuccess)
    }
  }, [useContract, library, account, currentAddress])

  return useQuery(
    KEYS.WALLET_TOKEN(),
    async () => {
      const { contract } = useContract.isSuccess ? useContract.data : {}
      let errorMessage = null
      const ownedTokens = new Map()
      try {
        if (error) {
          errorMessage = getErrorMessage(error)
        } else {
          const ownedTokensEvents = contract.filters.Transfer(null, account)
          const results = await contract.queryFilter(ownedTokensEvents, 0, 'latest')
          console.log('results', results)

          // go through all the tx on the block
          await Promise.all(
            results.map(async current => {
              const ownerToken = await contract.ownerOf(current.args.tokenId)

              if (ownerToken === account) {
                const { tokenId, tokenURI, price, numberOfTransfers, forSale } = await contract.allChickenRun(current.args?.tokenId)

                // TODO: check new contract for new attribute
                // lastSalePrice, perchHeight
                ownedTokens.set(tokenURI, {
                  tokenId: tokenId.toString(),
                  price: price.toString(),
                  numberOfTransfers: numberOfTransfers.toString(),
                  forSale
                })
              }
            })
          )
        }

        const tokenDetail = Array.from(ownedTokens).map(([_, token]) => token)
        setCurrentAddress(account)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          if (errorMessage) reject(errorMessage)
          resolve({
            tokens: tokenDetail
          })
        })
      } catch (err) {
        console.error('Error getting user wallet tokens', err)
        setEnableContract(false) // reset this to false
        return new Promise((resolve, reject) => {
          reject(errorMessage)
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useGetContractMaxSupplyQuery = () => {
  const useContract = useGetContractQuery()
  const [enabledContract, setEnableContract] = React.useState(false)

  React.useEffect(() => {
    setEnableContract(useContract.isSuccess)
    // eslint-disable-next-line
  }, [useContract])

  return useQuery(
    KEYS.CONTRACT_TOTALSUUPLY(),
    async () => {
      const { contract } = useContract.isSuccess ? useContract.data : {}
      let totalSupply = 0
      try {
        console.log('0--- total totalSupply')
        totalSupply = await contract.maxSupply()
        return new Promise((resolve, reject) => {
          resolve({
            totalSupply: totalSupply.toString()
          })
        })
      } catch (err) {
        console.error('Error getting contract total supply', err)
        return new Promise((resolve, reject) => {
          reject(getErrorMessage(err))
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useGetContractCurrentSupplyQuery = () => {
  const useContract = useGetContractQuery()
  const [enabledContract, setEnableContract] = React.useState(false)

  React.useEffect(() => {
    setEnableContract(useContract.isSuccess)
  }, [useContract])

  return useQuery(
    KEYS.CONTRACT_CURRENTSUPPLY(),
    async () => {
      const { contract } = useContract.isSuccess ? useContract.data : {}
      let currentSupply = 0
      try {
        console.log('0--- total currentSupply')
        currentSupply = await contract.totalSupply() // total minted
        console.log('curret', currentSupply.toString())
        return new Promise((resolve, reject) => {
          resolve({
            currentSupply: currentSupply.toString()
          })
        })
      } catch (err) {
        console.error('Error getting contract current minted supply', err)
        return new Promise((resolve, reject) => {
          reject(getErrorMessage(err))
        })
      }
    },
    {
      enabled: enabledContract
    }
  )
}

export const useMintTokenMutation = () => {
  const useContract = useGetContractQuery()
  const [enabledContract, setEnableContract] = React.useState(false)
  const queryClient = useQueryClient()

  React.useEffect(() => {
    setEnableContract(useContract.isSuccess)
  }, [useContract])

  return useMutation(async (tokenURI) => {
    const { contract } = useContract.isSuccess ? useContract.data : {}
    console.debug(`Minting token with the ${tokenURI}`)
    const tx = await contract.mint(tokenURI, { value: utils.parseUnits(MINT_PRICE, 'ether') })
    console.log('long tx', tx)
    return new Promise((resolve, reject) => {
      resolve({
        ...tx
      })
    })
  }, {
    enabled: enabledContract,
    onSuccess: async (data) => {
      console.log('Tx mint request', data)

      // cancel anything in tranaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

// create a place holder transaction so that any mutation can push the transaction to
export const useStoreWorkingTxQuery = (currentTx) => {
  return useQuery(
    KEYS.TRANSACTION(),
    () => {
      return new Promise((resolve, reject) => {
        resolve({})
      })
    })
}