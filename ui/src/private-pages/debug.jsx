import { Link } from 'gatsby'
import * as React from 'react'
import { Button } from 'react-bootstrap'
import { useWeb3Contract } from '../components/Connect'

// const isBrowser = typeof window !== 'undefined'

const IndexPage = () => {
  const { active, account, contract } = useWeb3Contract()

  React.useEffect(() => {}, [])

  const fire = () => {
    // console.log('window.gtag', typeof window.gtag)
    console.log('gtag', typeof gtag)
    console.log('ga', typeof ga)
    // console.log('window.dataLayer', typeof window.dataLayer)
    console.log('dataLayer', typeof dataLayer)
  }

  const fire2 = () => {
    // eslint-disable-next-line no-undef
    const dl = dataLayer
    // dl.push({ ecommerce: null }) // Clear the previous ecommerce object.
    dl.push({
      event: 'begin_checkout',
      ecommerce: {
        items: [
          {
            item_name: 'chikn',
            price: 33.75,
            quantity: 12,
          },
        ],
      },
    })
  }

  const fire2b = () => {
    // eslint-disable-next-line no-undef
    const dl = dataLayer
    // dl.push({ ecommerce: null }) // Clear the previous ecommerce object.
    dl.push({
      event: 'purchase',
      ecommerce: {
        // transaction_id: "T12345",
        // affiliation: "Online Store",
        value: 33.75,
        // tax: 4.90,
        // shipping: 5.99,
        currency: 'USD',
        // coupon: "SUMMER_SALE",
        items: [
          {
            item_name: 'chikn',
            price: 33.75,
            quantity: 12,
          },
        ],
      },
    })
  }

  const fire3 = () => {
    // eslint-disable-next-line no-undef
    const dl = dataLayer || []
    dl.push({
      event: 'connect_wallet',
      wallet: 'abcd',
    })
  }

  const fire4 = () => {
    // eslint-disable-next-line no-undef
    const dl = dataLayer || []
    dl.push({
      event: 'disconnect_wallet',
      wallet: null,
    })
  }

  return (
    <div className="p-5">
      <Link to="/">Back</Link>
      <Button onClick={fire} className="d-block my-4">
        Fire
      </Button>
      <Button onClick={fire3} className="d-block my-4">
        Connect Wallet
      </Button>
      <Button onClick={fire4} className="d-block my-4">
        Disconnect Wallet
      </Button>
      <Button onClick={fire2} className="d-block my-4">
        Begin checkout
      </Button>
      <Button onClick={fire2b} className="d-block my-4">
        Purchase
      </Button>
      <pre>active={JSON.stringify(active, null, 2)}</pre>
      <pre>account={JSON.stringify(account, null, 2)}</pre>
      <pre>contract={JSON.stringify(contract, null, 2)}</pre>
      {/* <pre>gtag={JSON.stringify(typeof window.gtag, null, 2)}</pre> */}
    </div>
  )
}

export default IndexPage
