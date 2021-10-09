import * as React from 'react'
import { ChiknText } from '../../components/Common'
import {
  InputGroup,
  FormControl,
  Button,
  ButtonGroup,
  ToggleButton,
  Spinner
} from 'react-bootstrap'
import Layout from '../../components/Layout'
import ChickenCard from '../../components/ChickenCard'
import siteConfig from '../../../site-config'
import styled from 'styled-components'
import AvaxSvg from '../../images/avalanche-avax-logo.svg'
import TransactionProgress from '../../components/TransactionProgressToast'

import {
  useToggleForSaleMutation,
  useSetTokenSalePriceMutation,
  useWeb3Contract
} from '../../components/Connect'

const AvaxLogo = styled((props) => <img src={AvaxSvg} {...props} />)`
  width: 30px;
  height: 30px;
  margin-left: 5px;
  position: relative;
  top: -2px;
`

const Page = ({ tokenId }) => {
  const [price, setPrice] = React.useState(0)
  const [forSale, setForSale] = React.useState(false)
  // TODO: Nick, also i should actually get the sale value from contract  somehow

  const { contract, active } = useWeb3Contract()

  const useToggleForSale = useToggleForSaleMutation(contract, active)
  const useSetNewSalePrice = useSetTokenSalePriceMutation(contract, active)

  const handlePriceChange = (e) => {
    const value = e.target.value
    setPrice(value)
  }

  const setSalePriceToChain = () => {
    useSetNewSalePrice.mutate({ tokenId, newPrice: price })
    // TODO: Nick, also i should actually get the sale value from contract  somehow
    // TODO: NICK, whats the best way to refesh the token since the key CONTRACT_TOKEN: (tokenId) => ['token', tokenId],
    // i cant pass the token the the received
  }

  const toggleItemForSale = () => {
    setForSale(!forSale)
    useToggleForSale.mutate({ tokenId })
  }
  return (
    <Layout pageName={`${siteConfig.nftName} #${tokenId}`}>
      <TransactionProgress intialOnShow={false} />
      <h1>
        <ChiknText /> #{tokenId}
      </h1>

      <ChickenCard tokenId={tokenId} />
      <div>
        <h1>List item for sale</h1>
        <h2>Price</h2>
        <InputGroup size="lg">
          <InputGroup.Text id="inputGroup-sizing-lg">
            <AvaxLogo />
          </InputGroup.Text>
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            value={price}
            onChange={handlePriceChange}
          />
          <Button
            variant="primary"
            id="setprice-btn"
            disabled={useSetNewSalePrice.isLoading || !active}
            onClick={() => setSalePriceToChain()}
          >
            {useSetNewSalePrice.isLoading
              ? (
                <Spinner animation="border" />
              )
              : (
                'Set Price'
              )}
          </Button>
        </InputGroup>
        <h2>Set for sale?</h2>
        <ButtonGroup>
          <ToggleButton
            id={'radio-yes'}
            type="radio"
            variant={'outline-success'}
            name="radio"
            value={forSale}
            checked={forSale === true}
            onChange={() => toggleItemForSale()}
            // disabled={useToggleForSale.isLoading || !active}
          >
            {useToggleForSale.isLoading
              ? (
                <Spinner animation="border" />
              )
              : (
                'Yes, for sale'
              )}
          </ToggleButton>
          <ToggleButton
            id={'radio-no'}
            type="radio"
            variant={'outline-danger'}
            name="radio"
            value={forSale}
            checked={forSale === false}
            // disabled={useToggleForSale.isLoading || !active}
            onChange={() => toggleItemForSale()}
          >
            {useToggleForSale.isLoading
              ? (
                <Spinner animation="border" />
              )
              : (
                'Not for sale'
              )}
          </ToggleButton>
        </ButtonGroup>
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <pre>useToggleForSale={JSON.stringify(useToggleForSale, null, 2)}</pre>
      )}
    </Layout>
  )
}

export default Page
