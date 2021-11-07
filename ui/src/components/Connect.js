import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { Contract, utils } from 'ethers'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
// import ChickenRun from '../../contract/Chicken_Fuji.json'
import ChickenRun from '../../contract/Chicken_Mainnet.json'
import siteConfig from '../../site-config'
import traits from '../components/traits/traits.json'

export const getErrorMessage = (error, deactivate) => {
  const { constructor: { name } = {} } = error
  const errorName = name || typeof error
  let errorMessage = null
  if (error.response && error.response.data && error.response.data.message) {
    errorMessage = error.response.data.message
  } if (error.data && error.data.message) {
    errorMessage = error.data.message
    if (error.data.message.includes('insufficient funds for gas')) {
      errorMessage = 'Insufficient funds for gas'
    }
  } else {
    errorMessage = error.message
  }
  console.error(`${errorName} - ${errorMessage}`, error)

  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return 'You are connected to an unsupported network. Please connect to the Avalanche Mainnet network'
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Avalanche account.'
  } else if (errorMessage.startsWith('call revert exception')) {
    return 'Contract not found. Please check you are connected to the Avalanche Mainnet network'
  } else if (errorMessage.startsWith('underlying network changed')) {
    if (typeof deactivate === 'function') deactivate()
    return 'Underlying network changed. Please reconnect your wallet.'
  } else {
    return 'Internal JSON-RPC eror: ' + errorMessage
  }
}

// shortern the transactionHash
export const toShort = (value, factor = 5) => {
  const slice = Math.round(value.length / factor)
  return `${value.substring(0, slice)}...${value.substring(value.length - slice, value.length)}`
}

const TIMEOUT_1_MIN = 60 * 1000

export const KEYS = {
  CONTRACT: () => ['contract'],
  CONTRACT_CURRENTSUPPLY: () => ['supply'],
  CONTRACT_TOKEN: (tokenId) => ['token', tokenId],
  ALLTOKEN: () => ['web3Token'],
  TOKEN: (tokenId) => ['web3Token', tokenId],
  RECENT_ACTIVITY: () => ['recent_activity'],
  MARKET: () => ['market'],
  WALLET: () => ['wallet'],
  WALLET_TOKEN: () => ['wallet', 'wallet_token'],
  WALLET_BALANCE: () => ['wallet', 'wallet_balance'],
  TRANSACTION: () => ['transaction'],
  ADMIN: () => ['admin'],
  ADMIN_GB_TOGGLE: () => ['admin', 'gb_toggle'],
  ADMIN_PUBLIC_TOGGLE: () => ['admin', 'public_toggle'],
  ADMIN_BASEURL: () => ['admin', 'baseurl'],
  SALES: () => ['admin', 'sales']
}

/**
 * ANCHOR Get's the minted / total count of tokens.
 */
export const useGetSupplyQuery = () => {
  const { active, contract } = useWeb3Contract()
  return useQuery(KEYS.CONTRACT_CURRENTSUPPLY(), async () => {
    console.debug({ active, keys: Object.keys(contract) })
    let [
      minted,
      publicMintLimit,
      gbMintLimit,
      // gbHolders,
      publicMintFeex1,
      publicMintFeex2,
      publicMintFeex3more,
      baseUrl,
      gbMintOpen,
      publicMintOpen
    ] = await Promise.all([
      contract.totalSupply(),
      contract.maxSupply(),
      contract.gbHoldersMaxMint(),
      // contract.gbholders(),
      contract.mintFeeAmount(),
      contract.mint2BaseFeeAmount(),
      contract.mint3BaseFeeAmount(),
      contract.baseURL(), // e.g. https://cd1n.chikn.farm/tokens/
      contract.openForGB(),
      contract.openForPublic()
    ])
    minted = parseInt(minted)
    publicMintLimit = parseInt(publicMintLimit)
    gbMintLimit = parseInt(gbMintLimit)
    publicMintFeex1 = FormatAvaxPrice(publicMintFeex1)
    publicMintFeex2 = FormatAvaxPrice(publicMintFeex2)
    publicMintFeex3more = FormatAvaxPrice(publicMintFeex3more)
    return {
      minted,
      publicMintLimit,
      gbMintLimit,
      // gbHolders,
      publicMintFeex1,
      publicMintFeex2,
      publicMintFeex3more,
      baseUrl,
      gbMintOpen,
      publicMintOpen
    }
  }, {
    enabled: active === true,
    refetchInterval: 60 * 1000
  })
}

/**
 * Gets the latest X events for the contract off the blockchain, sorted by time descending.
 * @param {*} limit
 * @returns {object}
 */
const getLatestEvents = async (contract, limit = 12) => {
  if (!contract) throw new Error('getLatestEvents - contract not yet initialised')
  const PAGE_LIMIT = 10000
  console.debug('contractkeys=' + JSON.stringify(Object.keys(contract)))
  let to = await contract.getBlockNumber()
  let from = to - PAGE_LIMIT

  // look for events related to this contract...
  let events = []
  while (from > 0 && events.length < limit) {
    console.debug(`searching range - ${JSON.stringify({ from, to, pageLimit: PAGE_LIMIT })} - eventsFound=${events.length}`)
    const tmp = await contract.contract.getPastEvents('allEvents', { fromBlock: from, toBlock: to })
    await contract.queryFilter
    events = [...events, ...tmp]
    // setup vars for next iteration...
    to = from - 1
    from = to - PAGE_LIMIT
  }
  // ensure they're in order...
  return events.sort((a, b) => b.blockNumber - a.blockNumber).map(e => {
    const { from, to, tokenId } = e.returnValues
    return { from, to, tokenId: parseInt(tokenId) }
  }).slice(0, limit)
}

/**
 * ANCHOR Get's metadata for the given token.
 */
export const useGetTokenQuery = (tokenId) => {
  return useQuery(KEYS.CONTRACT_TOKEN(tokenId), () => {
    const properties = traits[tokenId - 1]
    if (properties && properties.filename) {
      properties.image = siteConfig.cdnUrl + properties.filename
    }
    return { properties }
  }, { enabled: !isNaN(tokenId) })
}

/**
 * ANCHOR Get's latest contract activity.
 */
export const useGetRecentActivityQuery = ({ active, contract }) => {
  return useQuery(KEYS.RECENT_ACTIVITY(), async () => {
    return getLatestEvents(contract, 12)
  }, { enabled: active === true }) // NOTE === true is important!
}

// TODO Chicken pricing sale data
// const { price, previousPrice, numberOfTransfers, ...details } = await this.contract.methods.allChickenRun(tokenId).call()
// return { ...details, price: parseInt(price) / Math.pow(10, 18), previousPrice: parseInt(previousPrice) / Math.pow(10, 18), numberOfTransfers: parseInt(numberOfTransfers) }

// export const getWalletTokensQuery = () => {
//   return useQuery()
// }

/**
 * @returns {}
 */
export const useWeb3Contract = () => {
  const [state, setState] = React.useState({})
  const web3react = useWeb3React()

  React.useEffect(() => {
    console.debug('watch contract', web3react)
    let contract
    if (web3react.library) {
      const { abi, address } = ChickenRun
      contract = new Contract(address, abi, web3react.library.getSigner())
    }
    setState({ ...web3react, contract })
  }, [web3react])

  return state
}

export const useGetContractQuery = () => ({})
export const getContractQuery = () => ({})

// export const useGetUserWalletAddressQuery = () => {
//   const { library, account, error } = useWeb3React()
//   const queryClient = useQueryClient()

//   const [enabledContract, setEnableContract] = React.useState(false)
//   const [currentAddress, setCurrentAddress] = React.useState(null)

//   React.useEffect(() => {
//     if (currentAddress !== account) {
//       setEnableContract(typeof library !== 'undefined' && typeof account !== 'undefined')
//     }
//   }, [library, account, currentAddress, queryClient])

//   return useQuery(
//     KEYS.WALLET(),
//     async () => {
//       let errorMessage = null
//       try {
//         if (error) {
//           errorMessage = getErrorMessage(error)
//         }
//         setCurrentAddress(account)
//         setEnableContract(false) // reset this to false
//         return new Promise((resolve, reject) => {
//           if (errorMessage) reject(errorMessage)
//           resolve({
//             isAuthenticated: true,
//             user: { address: account || '' }
//           })
//         })
//       } catch (err) {
//         console.error('Error getting user wallet address', err)
//         setEnableContract(false) // reset this to false
//         return new Promise((resolve, reject) => {
//           reject(errorMessage)
//         })
//       }
//     },
//     {
//       enabled: enabledContract
//     }
//   )
// }

export const useGetWalletBalanceQuery = (library, account, enabled = true) => {
  return useQuery(
    KEYS.WALLET_BALANCE(),
    async () => {
      const balance = utils.formatEther(await library.getBalance(account || ''))
      return new Promise((resolve, reject) => {
        resolve({
          balance: balance.toString()
        })
      })
    },
    {
      enabled: !isUndef(account) && enabled,
      cacheTime: TIMEOUT_1_MIN * 10,
      staleTime: TIMEOUT_1_MIN * 10,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )
}

const isUndef = o => typeof o === 'undefined'

export const useGetAllTokensForSaleQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.MARKET(),
    async () => {
      console.debug('refetching tokens for sale', { contract, account, enabled })
      const tokensIds = []
      const tokenCount = await contract.totalSupply()
      for (let i = 1; i <= tokenCount.toNumber(); i++) {
        tokensIds.push({
          tokenId: i
        })
        // const token = await contract.allChickenRun(i)
        // tokensIds.push({
        //   currentOwner: token.currentOwner,
        //   forSale: token.forSale,
        //   mintedBy: token.mintedBy,
        //   numberOfTransfers: token.numberOfTransfers.toNumber(),
        //   perchHeight: token.perchHeight.toNumber(),
        //   previousPrice: utils.formatEther(token.previousPrice),
        //   price: utils.formatEther(token.price),
        //   tokenId: token.tokenId.toNumber()
        // })
      }
      return tokensIds
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

const FormatAvaxPrice = (price) => {
  return parseInt(price) / Math.pow(10, 18)
}

export const useGetWeb3TokenDetail = (contract, enabled = true, tokenId) => {
  return useQuery(
    KEYS.TOKEN(tokenId),
    async () => {
      const tokenDetail = await contract.allChickenRun(tokenId)
      return {
        currentOwner: tokenDetail.currentOwner,
        forSale: tokenDetail.forSale,
        mintedBy: tokenDetail.mintedBy,
        numberOfTransfers: parseInt(tokenDetail.numberOfTransfers),
        perchHeight: tokenDetail.perchHeight,
        previousPrice: FormatAvaxPrice(tokenDetail.previousPrice),
        price: FormatAvaxPrice(tokenDetail.price),
        tokenId: tokenDetail.tokenId
      }
    },
    {
      enabled: !isUndef(contract) && !isUndef(tokenId) && enabled
    }
  )
}

export const useGetWalletTokensQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.WALLET_TOKEN(),
    async () => {
      console.debug('refetching wallet tokens', { contract, account, enabled })
      const tokensIds = []
      const tokenCount = await contract.balanceOf(account)
      // const ownedTokensEvents = contract.filters.Transfer(null, account)
      // const results = await contract.queryFilter(ownedTokensEvents, 0, 'latest')
      // console.debug('wallet tokens', results)

      // // TODO go through all the tx on the block - sounds expensive, no? - Nick
      for (let i = 0; i < tokenCount.toNumber(); i++) {
        const token = await contract.tokenOfOwnerByIndex(account, i)
        tokensIds.push(token.toNumber())
      }
      return tokensIds
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

/**
 * This is the public mint.
 */
export const usePublicMintTokenMutation = () => {
  const { contract, active } = useWeb3Contract()
  const queryClient = useQueryClient()
  return useMutation(async ({ countOfChickens, totalPrice }) => {
    return contract.mint(countOfChickens, { value: utils.parseUnits(totalPrice, 'ether') })
  }, {
    enabled: active === true,
    onSuccess: async (data) => {
      console.debug('Tx mint request', data)
      // cancel anything in transaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}
/**
 * This is the gb mint.
 */
export const useGBMintTokenMutation = () => {
  const { contract, active } = useWeb3Contract()
  const queryClient = useQueryClient()
  return useMutation(() => contract.gbHolderMint(), {
    enabled: active === true,
    onSuccess: async (data) => {
      console.debug('Tx mint request', data)
      // cancel anything in transaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

export const useSetTokenSalePriceMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ tokenId, newPrice, isForSale }) => {
    return new Promise((resolve, reject) => {
      const ethPrice = utils.parseUnits(newPrice.toString(), 'ether')
      contract.setPriceForSale(tokenId, ethPrice, isForSale)
        .then((tx) => {
          console.log('Set sale price tx', tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('set sale price error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      // cancel anything in tranaction queue
      await queryClient.cancelQueries(KEYS.TRANSACTION())
      queryClient.setQueryData(KEYS.TRANSACTION(), data)
    }
  })
}

export const useBuyTokenMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ tokenId, salePrice }) => {
    return new Promise((resolve, reject) => {
      contract.buyToken(tokenId, { value: utils.parseUnits(salePrice.toString(), 'ether') })
        .then((tx) => {
          console.log('Buy token tx', tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Buy token error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
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

// admin functions

export const useIsPublicMintOpenQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.ADMIN_PUBLIC_TOGGLE(),
    async () => {
      const publicStatus = await contract.openForPublic()
      console.log('Public', publicStatus)
      return publicStatus
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

export const useIsGBMintOpenQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.ADMIN_GB_TOGGLE(),
    async () => {
      const gbStatus = await contract.openForGB()
      console.log('Fetching GB open status', gbStatus)
      return gbStatus
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

export const useToggleOpenForGBMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ isOpen }) => {
    return new Promise((resolve, reject) => {
      contract.toggleOpenForGB(isOpen)
        .then((tx) => {
          console.log(`Toggle GB ${isOpen}`, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Toggle GB error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries(KEYS.ADMIN())
      }, 2000)
    }
  })
}

export const useToggleOpenForPublicMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  return useMutation(async ({ isOpen }) => {
    return new Promise((resolve, reject) => {
      contract.toggleOpenForPublic(isOpen)
        .then((tx) => {
          console.log(`Toggle for public ${isOpen}`, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Toggle for public error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries(KEYS.ADMIN())
      }, 2000)
    }
  })
}

export const useGetExcludedMutation = (contract, account, enabled = true) => {
  return useMutation(async ({ address }) => {
    return new Promise((resolve, reject) => {
      contract.excludedList(address)
        .then((data) => {
          console.log(`Check exclusion list ${address}`, data)
          resolve({
            exist: data
          })
        })
        .catch((err) => {
          console.log('Check exclusion  error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled
  })
}

export const useSetExcludedMutation = (contract, enabled = true) => {
  // adress, wallet address
  // status : boolean
  return useMutation(async ({ address, status }) => {
    return new Promise((resolve, reject) => {
      contract.setExcluded(address, status)
        .then((tx) => {
          console.log(`Update exclusion list ${address} - ${status}`, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Update exclusion  error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled
  })
}

export const useBaseUrlQuery = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.ADMIN_BASEURL(),
    async () => {
      const baseUrl = await contract.baseURL()
      console.log('Get current base URL', baseUrl)
      return baseUrl
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

export const useChangeUrlMutation = (contract, enabled = true) => {
  const queryClient = useQueryClient()
  // adress, wallet address
  // status : boolean
  return useMutation(async ({ url }) => {
    return new Promise((resolve, reject) => {
      contract.changeUrl(url)
        .then((tx) => {
          console.log(`Change based url to  ${url}`, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Change based url error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled,
    onSuccess: async (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries(KEYS.ADMIN())
      }, 2000)
    }
  })
}

export const useAirdropMutation = (contract, enabled = true) => {
  // adress, wallet address
  // status : boolean
  return useMutation(async ({ numberOfToken, address }) => {
    return new Promise((resolve, reject) => {
      contract.airdropTokens(numberOfToken, address)
        .then((tx) => {
          console.log(`Airdrop ${numberOfToken} tokens ${address}`, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Airdrop error', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled
  })
}

export const useGetAllSalesToken = (contract, account, enabled = true) => {
  return useQuery(
    KEYS.SALES(),
    async () => {
      const tokensForSale = await contract.getAllSaleTokens()
      //  need to filter out any value that is greater than 0
      return tokensForSale.filter((t) => t > 0).map(t => t.toString())
    },
    {
      enabled: !isUndef(contract) && !isUndef(account) && enabled
    }
  )
}

export const useSetKGMutation = (contract, enabled = true) => {
  // adress, wallet address
  // status : boolean
  return useMutation(async ({ tokenId, kg }) => {
    return new Promise((resolve, reject) => {
      contract.setKg(parseInt(tokenId), parseInt(kg))
        .then((tx) => {
          console.log(`Set token #${tokenId} to ${kg} KG `, tx)
          resolve({
            ...tx
          })
        })
        .catch((err) => {
          console.log('Set token kg error ', err)
          reject(err)
        })
    })
  }, {
    enabled: !isUndef(contract) && enabled
  })
}
