import '@fontsource/space-grotesk'
import '@fontsource/poppins'
import './src/styles/main.scss'

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

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
       {element}
       <ReactQueryDevtools initialIsOpen={false} />
     </QueryClientProvider>
   </>)
}
