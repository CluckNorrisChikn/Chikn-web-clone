import { Link } from 'gatsby'
import moment from 'moment-timezone'
import * as React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import siteConfig from '../../../site-config'
import WoodenBannerImage from '../../images/Wooden-Sign-Hanging.png'
import { Section } from '../Common'
import { useGetSupplyQuery, useWeb3Contract } from '../Connect'

const WoodenBanner = (props) => <img src={WoodenBannerImage} {...props} />

const WoodenBannerOverlay = Container

const Component = () => {
  // react-query
  const { data: { gbMintOpen, publicMintOpen } = {} } = useGetSupplyQuery()
  const { active } = useWeb3Contract()

  const [date, setDate] = React.useState(siteConfig.publicMint.releaseDate)
  const [day, setDay] = React.useState('--')
  const [hrs, setHrs] = React.useState('--')
  const [min, setMin] = React.useState('--')
  const [sec, setSec] = React.useState('--')

  // watch the contract, show date based on the open mint...
  React.useEffect(() => {
    if (gbMintOpen && publicMintOpen) {
      setDate(siteConfig.publicMint.releaseDate)
    } else if (!gbMintOpen && publicMintOpen) {
      setDate(siteConfig.publicMint.releaseDate)
    } else if (gbMintOpen && !publicMintOpen) {
      setDate(siteConfig.publicMint.releaseDate)
    } else if (!gbMintOpen && !publicMintOpen) {
      setDate(siteConfig.gbMint.releaseDate) // gbmint date
    }
  }, [gbMintOpen, publicMintOpen])

  const setTime = (diffms, intervalRef) => {
    const d = new Date(diffms)
    if (diffms < 0) {
      setDay('00')
      setHrs('00')
      setMin('00')
      setSec('00')
      clearInterval(intervalRef)
    } else {
      setDay(String(d.getUTCDate() - 1).padStart(2, '0'))
      setHrs(String(d.getUTCHours()).padStart(2, '0'))
      setMin(String(d.getUTCMinutes()).padStart(2, '0'))
      setSec(String(d.getUTCSeconds()).padStart(2, '0'))
    }
  }

  // timer - updates every second...
  React.useEffect(() => {
    setTime(moment(date).diff())
    const ref = setInterval(() => setTime(moment(date).diff()), 1000)
    return () => clearInterval(ref)
  }, [date])

  return (
    <>
      <Section
        pad={false}
        center={false}
        className="d-flex flex-column align-items-center position-relative"
      >
        <WoodenBannerOverlay className="countdown-sizing woodenbanner-sizing text-center">
          <Container className="d-flex flex-row justify-content-center countdown-monospace">
            <Row>
              <h2>Public Mint Now Over!</h2>
            </Row>
          </Container>
          <div className="d-flex flex-row gap-3 justify-content-center">
            <Link
              className={'btn btn-primary px-4'}
              // disabled={!publicMintOpen}
              to="/market"
            >
              Check out the market!
            </Link>
          </div>
        </WoodenBannerOverlay>

        <WoodenBanner className="woodenbanner-sizing" />
      </Section>
      {/* {process.env.NODE_ENV !== 'production' && (
        <pre>data={JSON.stringify({ gbMintOpen, publicMintOpen })}</pre>
      )} */}
    </>
  )
}

export default Component
