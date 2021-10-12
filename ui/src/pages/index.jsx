import moment from 'moment'
import * as React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import ChickenBannerImage from '../components/ChickenBannerImage'
import ChickenCarousel from '../components/ChickenCarousel'
import ChickenKernelImage from '../components/ChickenKernel'
import { AButton, StackCol } from '../components/Common'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import CountdownSectionv2 from '../components/sections/CountdownSectionv2'
import Scratches1WhiteImage from '../images/scratches1.png'

const ScratchesWhite = styled(({ src = null, className = '', ...props }) => (
  <img src={src} className={`d-none d-md-block ${className}`} {...props} />
))`
  height: 200px;
  position: absolute;
  z-index: 999;
`
const ScratchesWhiteRight = styled((props) => (
  <ScratchesWhite src={Scratches1WhiteImage} {...props} />
))`
  width: 150px;
  right: 0;
`
const ScratchesWhiteLeft = styled((props) => (
  <ScratchesWhite src={Scratches1WhiteImage} {...props} />
))`
  width: 200px;
  left: 0;
  transform: rotate(180deg);
`

const releaseDateMoment = moment(siteConfig.releaseDate)

const IndexPage = () => {
  const { active } = useWeb3Contract()

  const enableCountdownAndMinting = false

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
    <Layout pageName="Home" constrainWidth={false} padTop={false}>
      {/* banner */}
      <ChickenBannerImage />

      <StackCol className="gap-8 py-8">
        {/* {enableCountdownAndMinting && (
          <>
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
                <TotalMintedSection />
                {!active && <MintYourOwnWalletNotConnectedSection />}
                {active && <MintYourOwnWalletConnectedSection />}
              </StackCol>
            )}

            {!showCountdown && <RecentActivitySection />}
          </>
        )} */}

        <CountdownSectionv2 date={'2021-10-30T10:00:00+1100'} />

        {/* carousel */}
        <div className="py-5">
          <Container className="pb-5 text-center">
            <h1>
              10,000{' '}
              <span className="text-body">
                algorithmically generated, unique chikn
              </span>
            </h1>
            <h1 className="text-body mt-4 mb-4">{siteConfig.subdescription}</h1>
          </Container>
          <Container className="position-relative">
            <ScratchesWhiteLeft />
            <ScratchesWhiteRight />
            <ChickenCarousel />
          </Container>
        </div>

        {/* welcome to the farm */}

        <Container>
          <Row className="g-5">
            <Col xs={12} sm={4}>
              <ChickenKernelImage />
            </Col>
            <Col xs={12} sm={8}>
              <h1>Welcome to chikn. Bgaarrk!</h1>
              <p>
                <b>chikn</b> is your NFT that lays $egg. <br />
                <b>chikn</b> is an entire ecosystem built around your NFT.{' '}
                <br />
                <b>chikn</b> is the First Tri-Token Economy built on Avalanche,
                extending the utility of Public Minting, Secondary Sales, and
                Farming for emerging NFT+token creators.
              </p>
              <p>
                NFTs have the unique ability to combine revolutionary fintech
                with the power of mimetism. When you can have both, why not have
                both?
                <br />
                It&apos;s simple, really. Everyone knows that chikn lay $egg.
              </p>
            </Col>
          </Row>
        </Container>

        {/* join community */}
        <Container className="worm">
          <h3>Join the community</h3>
          <p>For the latest news, updates and access to pre-release content.</p>
          <AButton
            className="fs-5 btn-primary px-4"
            href={siteConfig.links.discord}
          >
            Join our Discord
          </AButton>
        </Container>
      </StackCol>
    </Layout>
  )
}

export default IndexPage
