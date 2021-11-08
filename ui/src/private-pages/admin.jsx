import * as React from 'react'
import {
  useWeb3Contract,
  useIsPublicMintOpenQuery,
  useIsGBMintOpenQuery,
  useToggleOpenForGBMutation,
  useToggleOpenForPublicMutation,
  useGetExcludedMutation,
  useSetExcludedMutation,
  useAirdropMutation,
  useChangeUrlMutation,
  useBaseUrlQuery,
  useGetAllSalesToken,
  useSetKGMutation,
  getErrorMessage,
  useCheckHasGBMutation,
  useWeb3GBContract,
  useGetTokenURIMutation,
  useGetChickenDetailMutation
} from '../components/Connect'
import Layout from '../components/Layout'
import {
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton
} from 'react-bootstrap'

const Admin = () => {
  const { contract, account, active } = useWeb3Contract()
  const { contract: GBContract } = useWeb3GBContract()
  const { isLoading: publicLoading, data: publicStatus } = useIsPublicMintOpenQuery(contract, account, active)
  const { isLoading: gbLoading, data: gbStatus } = useIsGBMintOpenQuery(contract, account, active)
  const { data: currentBaseURL } = useBaseUrlQuery(contract, account, active)
  const { isLoading: tokenForSaleIsLoading, data: tokensforSales } = useGetAllSalesToken(contract, account, active)

  const [address, setAddress] = React.useState('')
  const [freeAddress, setFreeAddress] = React.useState('')
  const [includeInWhiteList, setIncludeInWhiteList] = React.useState(false)
  const [baseUrl, setBaseUrl] = React.useState('')
  const [airdropAddress, setAirdropAddress] = React.useState('')
  const [numberOfAirDrop, setNumberOfAirDrop] = React.useState(1)
  const [tokenId, setTokenId] = React.useState('')
  const [kg, setKg] = React.useState(null)
  const [tokenIdForUrl, setTokenIdForUrl] = React.useState('')
  const [tokenIdForChikn, setTokenIdForChikn] = React.useState('')

  const useToggleGB = useToggleOpenForGBMutation(contract, active)
  const useTogglePublic = useToggleOpenForPublicMutation(contract, active)
  const useGetExcluded = useGetExcludedMutation(contract, active)
  const useSetExclude = useSetExcludedMutation(contract, active)
  const useSendAirdrop = useAirdropMutation(contract, active)
  const useChangeUrl = useChangeUrlMutation(contract, active)
  const useSetKg = useSetKGMutation(contract, active)
  const useHasGB = useCheckHasGBMutation(contract, active)
  const useGetTokenUri = useGetTokenURIMutation(contract, active)
  const useGetChikenDetail = useGetChickenDetailMutation(contract, active)

  const toggleGB = () => {
    useToggleGB.mutate({ isOpen: !gbStatus })
  }

  const togglePublic = () => {
    useTogglePublic.mutate({ isOpen: !publicStatus })
  }

  const checkExclude = () => {
    useGetExcluded.mutate({ address: address })
  }

  const setExclude = () => {
    useSetExclude.mutate({
      address: freeAddress,
      status: includeInWhiteList
    })
  }

  const sendAirdrop = () => {
    useSendAirdrop.mutate({
      numberOfToken: numberOfAirDrop,
      address: airdropAddress
    })
  }

  const updateBaseUrl = () => {
    useChangeUrl.mutate({
      url: baseUrl
    })
  }

  const updateChiknKg = () => {
    useSetKg.mutate({
      tokenId: tokenId,
      kg: kg
    })
  }

  const checkHasGB = () => {
    useHasGB.mutate({ address: account })
  }

  const test = async () => {
    const balance = await GBContract.balanceOf(account)
    console.log('GB Test--', balance.toString())
  }

  const getTokenUri = async () => {
    useGetTokenUri.mutate({ tokenId: tokenIdForUrl })
  }

  const getChiknById = async () => {
    useGetChikenDetail.mutate({ tokenId: tokenIdForChikn })
  }
  return (
    <Layout pageName="Admin">
      <h1>-- Admin --</h1>

      <h2>Opening for market</h2>
      <div>Is GB mint open: <span>{publicLoading
        ? (
          <Spinner animation="border" />
        )
        : `${gbStatus}`} </span>
      <Button
        title="GB Toggle"
        variant="success"
        disabled={!active || useToggleGB.isLoading}
        onClick={toggleGB}>
        {useToggleGB.isLoading ? <Spinner animation="border" /> : 'Toggle'}
      </Button>
      {
        useToggleGB.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useToggleGB.error))}
        </Alert>
      }
      </div>

      <div>Is Public mint open: <span>{gbLoading
        ? (
          <Spinner animation="border" />
        )
        : `${publicStatus}`} </span>
      <Button
        title="Public Toggle"
        variant="success"
        disabled={!active || useTogglePublic.isLoading}
        onClick={togglePublic}>
        {useTogglePublic.isLoading ? <Spinner animation="border" /> : 'Toggle'}
      </Button>
      {
        useTogglePublic.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useTogglePublic.error))}
        </Alert>
      }
      </div>

      <hr />
      <h2>Check have 900 or more GB token</h2>
      <Button
        title="GB Check"
        variant="success"
        disabled={!active || useHasGB.isLoading}
        onClick={checkHasGB}>
        {useHasGB.isLoading ? <Spinner animation="border" /> : 'Check'}
      </Button>
      {
        useHasGB.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useHasGB.data)}
        </Alert>
      }
      {
        useHasGB.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useHasGB.error))}
        </Alert>
      }

      <Button
        title="Test GB"
        variant="success"
        disabled={!active || useTogglePublic.isLoading}
        onClick={test}>
        Call GB contract directly (Check console log)
      </Button>

      <hr />
      {/* AIRDROP */}
      <h2>Airdrop</h2>
      <Form.Group className="my-4" controlId="formBasicEmail">
        <Form.Label>Airdrop free token to the following address</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="0x..."
            value={airdropAddress}
            onChange={(e) => setAirdropAddress(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            type="number"
            placeholder="1"
            value={numberOfAirDrop}
            onChange={(e) => setNumberOfAirDrop(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Button
        title="Send airdrop"
        variant="success"
        disabled={!active || useSendAirdrop.isLoading}
        onClick={sendAirdrop}>
        {useSendAirdrop.isLoading ? <Spinner animation="border" /> : 'Send'}
      </Button>
      {
        useSendAirdrop.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useSendAirdrop.data)}
        </Alert>
      }
      {
        useSendAirdrop.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useSendAirdrop.error))}
        </Alert>
      }

      <hr />
      {/* Change Base URL */}
      <h2>Change Base URL</h2>
      <Form.Group className="my-4" controlId="formBasicEmail">
        <Form.Label>Change base url - {currentBaseURL}</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="https://chikn.farm"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Button
        title="Update base url"
        variant="success"
        disabled={!active || useChangeUrl.isLoading}
        onClick={updateBaseUrl}>
        {useChangeUrl.isLoading ? <Spinner animation="border" /> : 'Update'}
      </Button>
      {
        useChangeUrl.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useChangeUrl.data)}
        </Alert>
      }
      {
        useChangeUrl.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useChangeUrl.error))}
        </Alert>
      }

      <hr />
      <h2>Token for sale</h2>
      {tokenForSaleIsLoading ? <Spinner animation="border" /> : <pre>{JSON.stringify(tokensforSales)}</pre>}

      <hr />
      {/* Check detail token id */}
      <h2>Check chikn detail by Id</h2>
      <div>
        <span></span>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Check chikn detail </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="token id "
              value={tokenIdForChikn}
              onChange={(e) => setTokenIdForChikn(e.target.value)}
            />
            <Button
              title="Check Token uri"
              variant="success"
              disabled={!active || useGetChikenDetail.isLoading}
              onClick={getChiknById}>
              {useGetChikenDetail.isLoading ? <Spinner animation="border" /> : 'Check'}
            </Button>
          </InputGroup>
        </Form.Group>
        {
          useGetChikenDetail.isSuccess && <Alert variant="success" className="mt-4">
            <pre>{JSON.stringify(useGetChikenDetail.data, null, 4)}</pre>
          </Alert>
        }
        {
          useGetChikenDetail.isError && <Alert variant="danger" className="mt-4">
            {JSON.stringify(getErrorMessage(useGetChikenDetail.error))}
          </Alert>
        }
      </div>

      <hr />
      {/* Check token Uri by id */}
      <h2>Check Token Uri by Id</h2>
      <div>
        <span></span>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Check token Uri by token id </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="token id "
              value={tokenIdForUrl}
              onChange={(e) => setTokenIdForUrl(e.target.value)}
            />
            <Button
              title="Check Token uri"
              variant="success"
              disabled={!active || useGetTokenUri.isLoading}
              onClick={getTokenUri}>
              {useGetTokenUri.isLoading ? <Spinner animation="border" /> : 'Check'}
            </Button>
          </InputGroup>
        </Form.Group>
        {
          useGetTokenUri.isSuccess && <Alert variant="success" className="mt-4">
            <pre>{JSON.stringify(useGetTokenUri.data, null, 4)}</pre>
          </Alert>
        }
        {
          useGetTokenUri.isError && <Alert variant="danger" className="mt-4">
            {JSON.stringify(getErrorMessage(useGetTokenUri.error))}
          </Alert>
        }
      </div>

      <hr />
      <h2>Set Chikn KG</h2>
      <Form.Group className="my-4" controlId="formBasicEmail">
        <Form.Label>Set Chikn new KG</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="number"
            placeholder="Token number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            type="number"
            placeholder="set kg"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Button
        title="set chikn new kg"
        variant="success"
        disabled={!active || useSetKg.isLoading}
        onClick={updateChiknKg}>
        {useSetKg.isLoading ? <Spinner animation="border" /> : 'Update'}
      </Button>
      {
        useSetKg.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useSetKg.data)}
        </Alert>
      }
      {
        useSetKg.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(getErrorMessage(useSetKg.error))}
        </Alert>
      }

      <hr />
      {/* Check excluded list */}
      <h2>Check Excluded list</h2>
      <div>
        <span></span>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Check address is in exclude list or not </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button
              title="Public Toggle"
              variant="success"
              disabled={!active || useGetExcluded.isLoading}
              onClick={checkExclude}>
              {useGetExcluded.isLoading ? <Spinner animation="border" /> : 'Check'}
            </Button>
          </InputGroup>
        </Form.Group>
        {
          useGetExcluded.isSuccess && <Alert variant="success" className="mt-4">
            {JSON.stringify(useGetExcluded.data)}
          </Alert>
        }
      </div>

      <hr />
      {/* Free excluding (add / remove) */}
      <h2>Free Excluding (Add/Remove)</h2>
      <div>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Add / remove wallet address to the exclude list (Free minting)</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="0x..."
              value={freeAddress}
              onChange={(e) => setFreeAddress(e.target.value)}
            />
          </InputGroup>

          <ToggleButtonGroup
            type="radio"
            name="excludeList"
            defaultValue={includeInWhiteList}
            className="mb-2 d-flex"
            onChange={(e) => setIncludeInWhiteList(e)}
            value={includeInWhiteList}>
            <ToggleButton
              id="tbg-check-2"
              className={`w-50 ${includeInWhiteList === true ? 'text-white' : ''
              }`}
              variant={
                'outline-success'
              }
              value={true}>
              Add
            </ToggleButton>
            <ToggleButton
              id="tbg-check-1"
              className={`w-50 ${includeInWhiteList === false ? 'text-white' : ''
              }`}
              variant={
                // enabledListing === true ? 'success' : 'outline-success'
                'outline-primary'
              }
              value={false}>
              Remove
            </ToggleButton>
          </ToggleButtonGroup>
        </Form.Group>
        <Button
          title="Update Exclude session"
          variant="success"
          disabled={!active || useSetExclude.isLoading}
          onClick={setExclude}>
          {useSetExclude.isLoading ? <Spinner animation="border" /> : 'Update'}
        </Button>
        {
          useSetExclude.isSuccess && <Alert variant="success" className="mt-4">
            {JSON.stringify(useSetExclude.data)}
          </Alert>
        }
        {
          useSetExclude.isError && <Alert variant="danger" className="mt-4">
            {JSON.stringify(getErrorMessage(useSetExclude.error))}
          </Alert>
        }
      </div>
    </Layout >
  )
}

export default Admin
