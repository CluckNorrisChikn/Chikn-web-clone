import '@fontsource/poppins'
import '@fontsource/poppins/700.css'
import './src/styles/main.scss'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

const getLibrary = (provider) => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

/** N.B. COPY CONTENTS TO GATSBY-SSR.js */

export const wrapRootElement = ({ element }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
      }
    }
  })

  return (<>
    <QueryClientProvider client={queryClient}>

      <Web3ReactProvider getLibrary={getLibrary}>
        {element}
      </Web3ReactProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>)
}
