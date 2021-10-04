import * as React from 'react'
import Layout from '../components/Layout'
import moment from 'moment'
import styled from 'styled-components'
import { Container } from 'react-bootstrap'
import FlipCountdown from '@rumess/react-flip-countdown'
import { AButton, Section, StackCol, StyleDaChikn } from '../components/Common'
import ChickenCarousel from '../components/ChickenCarousel'
import siteConfig from '../../site-config'
import ChickenHead from '../components/ChickenHeadImage'
import TotalMintedSection from '../components/sections/TotalMintedSection'
import MintYourOwnWalletNotConnected from '../components/sections/MintYourOwnWalletNotConnected'
import MintYourOwnWalletConnected from '../components/sections/MintYourOwnWalletConnected'
import { useWeb3Contract } from '../components/Connect'

const ChickenHeadImageWrapper = styled(({ className = '', ...props }) => (
  <div className={`${className} d-none d-lg-block`} {...props}>
    <ChickenHead />
  </div>
))`
  position: absolute;
  right: 200px;
  bottom: 0;
  opacity: 0.5;
  > .gatsby-image-wrapper {
    display: block !important;
  }
`

const releaseDateMoment = moment(siteConfig.releaseDate)

const IndexPage = () => {
  const { active } = useWeb3Contract()
  const [showCountdown, setShowCountdown] = React.useState(
    releaseDateMoment.isAfter(Date.now())
  )

  // watch for when timeout is done...
  React.useEffect(() => {
    let timeout
    if (releaseDateMoment.isAfter(Date.now())) {
      timeout = setTimeout(
        () => setShowCountdown(false),
        releaseDateMoment.diff(Date.now())
      )
    }
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Layout constrainWidth={false} className="gap-8">
      {/* countdown */}
      {showCountdown && (
        <Container>
          <Section className="bg-light">
            <h3>Countdown to release:</h3>
            <h1 className="py-4">
              <FlipCountdown
                hideYear
                hideMonth
                dayTitle="Days"
                hourTitle="Hours"
                minuteTitle="Minutes"
                secondTitle="Seconds"
                endAtZero
                size="medium"
                titlePosition="bottom"
                endAt={siteConfig.releaseDate} // Date/Time
              />
            </h1>
            <small>
              {moment.utc(siteConfig.releaseDate).format('LLLL')} (UTC)
            </small>
          </Section>
        </Container>
      )}

      {!showCountdown && (
        <StackCol className="gap-3">
          {/* minting summary */}
          <TotalMintedSection />
          {/* mint your own - not connected */}
          {!active && <MintYourOwnWalletNotConnected />}
          {/* mint your own - connected */}
          {active && <MintYourOwnWalletConnected />}
        </StackCol>
      )}

      {/* carousel */}
      <div className="py-5">
        <Container className="pb-5 text-center">
          <h1>
            <StyleDaChikn>{siteConfig.description}</StyleDaChikn>
          </h1>
        </Container>
        <ChickenCarousel />
      </div>

      {/* join community */}
      <div className="mb-5">
        <div className="bg-light mb-5">
          <Container className="position-relative">
            <ChickenHeadImageWrapper />
            <div className="py-5">
              <div className="py-5">
                <h3>Join the community</h3>
                <p>
                  For the latest news, updates and access to pre-release
                  content.
                </p>
                <AButton
                  className="fs-5 btn-outline-primary px-4"
                  href={siteConfig.links.discord}
                >
                  Join our Discord
                </AButton>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
