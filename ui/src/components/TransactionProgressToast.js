import React from 'react'
import {
  toShort,
  KEYS,
  useStoreWorkingTxQuery
} from '../components/Connect'
import { useQueryClient } from 'react-query'
import GenericToast from './GenericToast'
import {
  AVALANCHE_TESTNET_PARAMS,
  AVALANCHE_MAINNET_PARAMS
} from '../utils/network'

const TransactionProgress = ({ intialOnShow = false }) => {
  const useTransaction = useStoreWorkingTxQuery()
  const queryClient = useQueryClient()

  const [onShow, setOnShow] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState(null)
  const [title, setTitle] = React.useState('Transaction submitted')
  const transactionRef = React.useRef(null)

  const { data } = useTransaction

  const networkExplorer = 1 === 1 ? AVALANCHE_TESTNET_PARAMS : AVALANCHE_MAINNET_PARAMS

  React.useEffect(() => {
    // async function
    const checkTransaction = async (tx) => {
      try {
        const receipt = await tx.wait()
        console.log('receipt', receipt)
        if (receipt.status === 1) {
          setTitle('Transaction completed')
        } else {
          setTitle('Transaction failed')
        }
        setOnShow(true)
        if (receipt.confirmations >= 1) {
          console.log('Invalidate all cache')
          // queryClient.invalidateQueries(KEYS.CONTRACT()) // Don't invalidate the whole contract, when you only need to update the supply.
          queryClient.invalidateQueries(KEYS.CONTRACT_CURRENTSUPPLY())
          queryClient.invalidateQueries(KEYS.RECENT_ACTIVITY())
          queryClient.invalidateQueries(KEYS.WALLET())
          setTimeout(() => {
            queryClient.invalidateQueries(KEYS.MARKET())
            queryClient.invalidateQueries(KEYS.ALLTOKEN())
            queryClient.invalidateQueries(KEYS.CONTRACT_TOKEN())
          }, 2000)
          setTimeout(() => {
            setOnShow(false)
          }, 5000)
        }
      } catch (err) {
        setErrorMessage(err)
        console.error('error checking transaction with blockchain')
      }
    }
    setErrorMessage(null)
    if (data && Object.keys(data).length > 0) {
      transactionRef.current = data
      setTitle('Transaction submitted')
      setOnShow(true)
      checkTransaction(data)
      // clear out the old transaction straightaway
      queryClient.setQueryData(KEYS.TRANSACTION(), {})
    }
  }, [data, queryClient])

  const backgroundColor = title === 'Transaction submitted' ? 'info' : (title === 'Transaction failed' ? 'error' : 'success')

  return (
    <GenericToast
      title={title}
      show={onShow}
      setShow={(show) => setOnShow(show)}
      autoHide={false}
      className={`bg-${backgroundColor} text-white`}
    >
      {errorMessage || (transactionRef.current &&
        <a
          rel="noreferrer noopener"
          target="_blank"
          href={`${networkExplorer.blockExplorerUrls[0]}/tx/${transactionRef.current.hash}`}>
          {toShort(transactionRef.current.hash)}
        </a>)}
    </GenericToast >
  )
}

export default TransactionProgress
