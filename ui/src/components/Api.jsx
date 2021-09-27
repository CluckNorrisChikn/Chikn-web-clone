import { useQuery, useMutation, useQueryClient } from 'react-query'

let wallet = null

const KEYS = {
  WALLET: () => ['wallet']
}

export const useGetWalletQuery = () => {
  return useQuery(KEYS.WALLET(), async () => {
    return new Promise((resolve) => setTimeout(() => resolve(wallet), 1500))
  })
}

export const useUploadUnitPriceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (arg) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          wallet = { walletAddress: '0xABCDEF' }
          resolve()
        }, 1500)
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(KEYS.WALLET())
      }
    }
  )
}
