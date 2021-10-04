import React from 'react'
import {
  toShort,
  KEYS,
  useStoreWorkingTxQuery
} from '../components/Connect'
import { Toast } from 'react-bootstrap'
import { useQueryClient } from 'react-query'

const TransactionProgress = () => {
  const useTransaction = useStoreWorkingTxQuery()
  const queryClient = useQueryClient()

  const [onShow, setOnShow] = React.useState(false)
  const [title, setTitle] = React.useState('Transaction submitted')
  const transactionRef = React.useRef(null)

  const { data } = useTransaction

  console.log('useTransaction', useTransaction, data)

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
          // queryClient.invalidateQueries(KEYS.CONTRACT()) // Don't invalidate the whole contract, when you only need to update the supply.
          queryClient.invalidateQueries(KEYS.CONTRACT_CURRENTSUPPLY())
        }
      } catch (err) {
        console.error('error checking transaction with blockchain')
      }
    }

    if (data && Object.keys(data).length > 0) {
      transactionRef.current = data
      setTitle('Transaction submitted')
      setOnShow(true)
      checkTransaction(data)
    }
  }, [data, queryClient])

  const backgroundColor = title === 'Transaction submitted' ? '#5bc0de' : (title === 'Transaction failed' ? '#d9534f' : '#5cb85c')

  return (
    <Toast show={onShow} onClose={() => setOnShow(false)} delay={5000}
      style={{
        position: 'fixed',
        marginLeft: 'auto',
        marginRight: 'auto',
        top: 100,
        left: 0
      }}
      autohide={false}
    >
      <Toast.Header style={{ backgroundColor: backgroundColor, color: 'white' }} closeButton={false}>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body style={{
        height: '50px !important',
        maxHeight: '50px !important',
        backgroundColor: 'white'
      }}>{transactionRef.current && toShort(transactionRef.current.hash)}</Toast.Body>
    </Toast>
  )
}

export default TransactionProgress
