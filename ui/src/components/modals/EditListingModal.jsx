import React from 'react'
import {
  Form,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  InputGroup,
  Spinner,
  Alert
} from 'react-bootstrap'
import AvaxSVG from '../../images/avalanche-avax-logo-trans.svg'
import {
  KEYS,
  useSetTokenSalePriceMutation,
  useWeb3Contract
} from '../../components/Connect'
import { useQueryClient } from 'react-query'

// LINK -> // ui/src/pages/chikn/[tokenId].jsx (SELL)

const Page = ({
  showModal,
  setShowModal,
  enableListing: enabled = false,
  listingPrice: price = '',
  tokenId = ''
}) => {
  const [enabledListing, setEnabledListing] = React.useState(enabled)
  const [listingPrice, setListingPrice] = React.useState(price) // N.B. this will be a string!

  const { contract, active } = useWeb3Contract()

  const useSetTokenSalePrice = useSetTokenSalePriceMutation(contract, active)
  const queryClient = useQueryClient()

  React.useEffect(() => {
    setEnabledListing(enabled)
    setListingPrice(price)
  }, [enabled, price, showModal])

  const setPrice = (value) => {
    if (
      value === '' ||
      (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))
    ) {
      setListingPrice(value)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSuccessCB = React.useCallback(() => {
    setShowModal()
    useSetTokenSalePrice.reset() // need to reset the query state to prevent infinite loop
    // invalidate token
    queryClient.invalidateQueries(KEYS.CONTRACT_TOKEN(tokenId))
  })

  const submit = () => {
    let price = listingPrice
    if (listingPrice === '') {
      price = '0'
    }
    useSetTokenSalePrice.mutate({
      tokenId,
      newPrice: price,
      isForSale: enabledListing
    })
  }

  const doHide = () => {
    setEnabledListing(false)
    setListingPrice('')
    setShowModal(false)
  }

  React.useEffect(() => {
    if (useSetTokenSalePrice.isSuccess) {
      onSuccessCB()
    }
  }, [useSetTokenSalePrice, onSuccessCB])

  // TODO use react query to do mutation, use loading states for spinners / disabled buttons.
  // Show notification when successful, and close modal.
  // If error, leave modal open and show notification.

  return (
    <Modal show={showModal} onHide={doHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* form */}
        <Form>
          {/* status */}
          <Form.Group className="my-4" controlId="formBasicEmail">
            <Form.Label>Status</Form.Label>
            <div>
              <ToggleButtonGroup
                type="radio"
                name="listingOptions"
                defaultValue={enabledListing}
                className="mb-2 d-flex"
                onChange={(e) => setEnabledListing(e)}
                value={enabledListing}
              >
                <ToggleButton
                  id="tbg-check-2"
                  className={`w-50 ${
                    enabledListing === false ? 'text-white' : ''
                  }`}
                  variant={
                    // enabledListing === false ? 'primary' : 'outline-primary'
                    'outline-secondary'
                  }
                  value={false}
                >
                  Delist for Sale
                </ToggleButton>
                <ToggleButton
                  id="tbg-check-1"
                  className={`w-50 ${
                    enabledListing === true ? 'text-white' : ''
                  }`}
                  variant={
                    // enabledListing === true ? 'success' : 'outline-success'
                    'outline-primary'
                  }
                  value={true}
                >
                  List for Sale
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Form.Text className="text-muted">
              Allows you to toggle whether your chikn is available for sale.
            </Form.Text>
          </Form.Group>

          {/* price - only show if above is true */}
          {enabledListing && (
            <Form.Group className="my-4" controlId="formBasicEmail">
              <Form.Label>Asking Price</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text
                  id="basic-addon1"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <img
                    src={AvaxSVG}
                    style={{ width: '30px', height: '30px' }}
                  />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="0.00"
                  value={listingPrice}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </InputGroup>

              <Form.Text className="text-muted">
                Please enter the price you would like to sell your chikn for.
              </Form.Text>
            </Form.Group>
          )}

          {/* end form */}
        </Form>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <pre>enabledListing={JSON.stringify(enabledListing, null, 2)}</pre>
            <pre>listingPrice={JSON.stringify(listingPrice, null, 2)}</pre>
            <pre>tokenId={JSON.stringify(tokenId, null, 2)}</pre>
          </>
        )}
        {useSetTokenSalePrice.isError && (
          <Alert variant="danger" className="mt-4">
            {useSetTokenSalePrice.error.message}
          </Alert>
        )}
      </Modal.Body>

      {/* buttons */}
      <Modal.Footer className="justify-content-between">
        <Button variant="outline-secondary" className="w-25" onClick={doHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className="w-25"
          onClick={submit}
          disabled={!active || useSetTokenSalePrice.isLoading}
        >
          {useSetTokenSalePrice.isLoading
            ? (
              <Spinner size="sm" animation="border" />
            )
            : (
              'Submit'
            )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Page
