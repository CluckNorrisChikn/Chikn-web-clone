import moment from 'moment'
import * as React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import ChickenBannerImage from '../components/images/ChickenBannerImage'
import ChickenCarousel from '../components/ChickenCarousel'
import ChickenKernelImage from '../components/images/ChickenSilhouette'
import ChickenColonelImage from '../components/images/ChickenColonel'
import Egg01Image from '../components/images/Egg01'
import Egg02Image from '../components/images/Egg02'
import Corn01Image from '../components/images/Corn01'
import Corn02Image from '../components/images/Corn02'
import { AButton, Section, StackCol } from '../components/Common'
import { useWeb3Contract } from '../components/Connect'
import Layout from '../components/Layout'
import CountdownSectionv2 from '../components/sections/CountdownSectionv2'
import Scratches1WhiteImage from '../images/Web_CarouselEdges_02_var6.png'

// containers

const LeftContainer = styled.div`
  position: absolute !important;
  left: 0;
  top: 0;
  width: 300px;
  height: 300px;
`
const RightContainer = styled.div`
  position: absolute !important;
  right: 0;
  top: 0;
  width: 300px;
  height: 300px;
`

// right container

const ChickenColonel = styled(ChickenColonelImage)`
  position: absolute !important;
  right: -30px;
  top: -130px;
  width: 130%;
  transform: scaleX(-1);
  z-index: 1003;
`

const Corn02 = styled(Corn02Image)`
  position: absolute !important;
  right: 280px;
  top: 330px;
  width: 100px;
  z-index: 1005;
`

// left container

const Egg01 = styled(Egg01Image)`
  position: absolute !important;
  left: 0;
  top: 130px;
  width: 60%;
  z-index: 1003;
  transform: rotate(320deg);
`

const Egg02 = styled(Egg02Image)`
  position: absolute !important;
  left: 0;
  top: -50px;
  width: 100%;
  z-index: 1002;
  transform: rotate(345deg);
`

// bottom corn

const Corn01 = styled(Corn01Image)`
  position: absolute !important;
  right: 50px;
  bottom: -60px;
  width: 150px;
  transform: rotate(235deg);
`

// scratches

const ScratchesWhite = styled(({ src = null, className = '', ...props }) => (
  <img src={src} className={`d-none d-md-block ${className}`} {...props} />
))`
  height: 202px;
  position: absolute;
  top: -1px;
  z-index: 999;
`
const ScratchesWhiteLeft = styled((props) => (
  <ScratchesWhite src={Scratches1WhiteImage} {...props} />
))`
  width: 200px;
  left: 0;
  transform: rotate(180deg);
`
const ScratchesWhiteRight = styled((props) => (
  <ScratchesWhite src={Scratches1WhiteImage} {...props} />
))`
  width: 200px;
  right: 0;
`

// page

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
    <Layout
      pageName="Home"
      constrainWidth={false}
      padTop={false}
      className="gap-0"
    >
      {/* banner */}
      <ChickenBannerImage />

      <div className="overflowx-hidden">
        {/* countdown */}
        <Section pad={false} className="position-relative">
          <LeftContainer className="d-none d-xxl-block">
            <Egg01 />
            <Egg02 />
          </LeftContainer>
          <RightContainer className="d-none d-xxl-block">
            <Corn02 />
            <ChickenColonel />
          </RightContainer>
          <CountdownSectionv2 date={'2021-01-01T10:00:00+1100'} />
        </Section>
      </div>

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

        {/* carousel */}
        <div className="py-3 py-md-5">
          <Container className="pb-3 pb-md-5 text-center">
            <h1>
              10,000{' '}
              <span className="text-body">
                algorithmically generated, unique chikn
              </span>
            </h1>
            <h1 className="text-body mt-4 mb-4">NFTs that lay $egg</h1>
          </Container>
          <Container className="position-relative">
            <ScratchesWhiteLeft />
            <ScratchesWhiteRight />
            <ChickenCarousel />
          </Container>
        </div>

        {/* welcome to the farm */}

        <Container className="position-relative">
          <Corn01 className="d-none d-lg-block" />
          <Row>
            <Col xs={12} sm={4}>
              <ChickenKernelImage />
            </Col>
            <Col xs={12} sm={8}>
              <h1>Welcome to chikn. Bgaark!</h1>
              <p>
                <b>chikn</b> is an NFT that lays $egg.
                <br />
                <b>chikn</b> is an entire ecosystem built around this NFT.
                <br />
                <b>chikn</b> is Tri-Token Architecture for NFTs on Avalanche,
                extending the utility of Public Minting, a Marketplace, and
                Farming for emerging NFT+token creators.
              </p>
              <p>
                NFTs have the unique ability to combine utility with the power
                of mimetism.
                <br className="d-none d-lg-block" /> When you can have both, why
                not have both?
              </p>
              <p>
                It&apos;s simple, really. Everyone knows that chikn lay $egg.
              </p>
            </Col>
          </Row>
        </Container>

        {/* join community */}
        <Container>
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
