import React from 'react'
import {
  Form,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from 'react-bootstrap'

// LINK -> // ui/src/pages/chikn/[tokenId].jsx (SELL)

const Page = ({
  showModal,
  setShowModal,
  enabledListing: enabled = false,
  listingPrice: price = ''
}) => {
  const [enabledListing, setEnabledListing] = React.useState(enabled)
  const [listingPrice, setListingPrice] = React.useState(price) // N.B. this will be a string!

  React.useEffect(() => {
    setEnabledListing(enabled)
    setListingPrice(price)
  }, [enabled, price])

  const setPrice = (value) => {
    if (
      value === '' ||
      (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))
    ) {
      setListingPrice(value)
    }
  }

  const doHide = () => {
    setEnabledListing(false)
    setListingPrice('')
    setShowModal(false)
  }

  // TODO use react query to do mutation, use loading states for spinners / disabled buttons.
  // Show notification when successful, and close modal.
  // If error, leave modal open and show notification.

  return (
    <Modal show={showModal} onHide={doHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        List item for sale.
        {/* form */}
        <Form className="py-4">
          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label>Enable / Disable Listing</Form.Label>
            <div>
              <ToggleButtonGroup
                type="radio"
                name="listingOptions"
                defaultValue={enabledListing}
                className="mb-2"
                onChange={(e) => setEnabledListing(e)}
              >
                <ToggleButton
                  id="tbg-check-2"
                  variant={
                    enabledListing === false ? 'primary' : 'outline-primary'
                  }
                  value={false}
                >
                  Delist for Sale
                </ToggleButton>
                <ToggleButton
                  id="tbg-check-1"
                  variant={
                    enabledListing === true ? 'primary' : 'outline-primary'
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

          {/* only show if above is true */}
          {enabledListing && (
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>Asking Price</Form.Label>
              <Form.Control
                type="email"
                placeholder="0.00"
                value={listingPrice}
                onChange={(e) => setPrice(e.target.value)}
              />
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
          </>
        )}
      </Modal.Body>

      {/* buttons */}
      <Modal.Footer className="justify-content-between">
        <Button variant="outline-secondary" onClick={doHide}>
          Cancel
        </Button>
        <Button variant="primary">Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default Page
