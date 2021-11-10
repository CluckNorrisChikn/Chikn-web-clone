/* eslint-disable camelcase */
import moment from 'moment'
import * as React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import { AvaxLogo } from '../components/AvaxLogo'
import ChickenCarousel from '../components/ChickenCarousel'
import { AButton, Section, StackCol, StackRow } from '../components/Common'
import ChickenBannerImage from '../components/images/ChickenBannerImage'
import ChickenColonelImage from '../components/images/ChickenColonel'
import ChickenKernelImage from '../components/images/ChickenSilhouette'
import Corn01Image from '../components/images/Corn01'
import Corn02Image from '../components/images/Corn02'
import Egg01Image from '../components/images/Egg01'
import Egg02Image from '../components/images/Egg02'
import Layout from '../components/Layout'
import CountdownSectionv2 from '../components/sections/CountdownSectionv2'
import TriTokenEcoMainImage from '../images/Illustration_Ecosystem_Simple_01.png'
import SVG_TriToken_Legend_03_blue_eggs from '../images/TriToken_Legend_03_blue_eggs.svg'
import SVG_TriToken_Legend_03_blue_kg from '../images/TriToken_Legend_03_blue_kg.svg'
import SVG_TriToken_Legend_03_blue_pitchfork from '../images/TriToken_Legend_03_blue_pitchfork.svg'
import SVG_TriToken_Legend_03_chicken from '../images/TriToken_Legend_03_chicken.svg'
import SVG_TriToken_Legend_03_egg from '../images/TriToken_Legend_03_egg.svg'
import SVG_TriToken_Legend_03_worm from '../images/TriToken_Legend_03_worm.svg'
import Scratches1WhiteImage from '../images/Web_CarouselEdges_02_var6.png'

// containers

const TriTokenLegendIcon = styled.img`
  width: 100%;
  max-width: 70px;
  max-height: 70px;
`

const TriTokenEcoMain = styled(({ className = '', ...props }) => (
  <img src={TriTokenEcoMainImage} className={`${className} w-100`} />
))`
  object-fit: contain;
`

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
  width: 120px;
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

const IndexPage = () => {
  // const { active } = useWeb3Contract()

  // const enableCountdownAndMinting = false

  // const [showCountdown, setShowCountdown] = React.useState(
  //   releaseDateMoment.isAfter(Date.now())
  // )

  // // watch for when timeout is done...
  // React.useEffect(() => {
  //   let timeout
  //   if (releaseDateMoment.isAfter(Date.now())) {
  //     timeout = setTimeout(
  //       () => setShowCountdown(false),
  //       releaseDateMoment.diff(Date.now())
  //     )
  //   }
  //   return () => clearTimeout(timeout)
  // }, [])

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
          <CountdownSectionv2 />
        </Section>
      </div>

      <StackCol className="gap-7 py-5">
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

        <Container className="text-center">
          <h1>
            Price: 1 AVAX <AvaxLogo size="2.5rem" />
          </h1>
          <small className="text-muted">
            Max {siteConfig.publicMint.maxPerMint} per mint.
            <br />
            Limit {siteConfig.publicMint.limitPerWallet} per wallet.
          </small>
        </Container>

        {/* carousel */}
        <div className="pb-3 pb-md-5">
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
          <Corn01 className="d-none d-xl-block" />
          <Row>
            <Col sm={12} md={4}>
              <ChickenKernelImage />
            </Col>
            <Col sm={12} md={8}>
              <h1>Welcome to chikn. Bgaark!</h1>
              <p>
                <b>chikn</b> are not just NFTs that lay $egg.
                <br />
                <b>chikn</b> is an entire ecosystem built around these NFTs -
                encompassing novel Tri-Token Architecture.
                <br />
                <b>chikn</b> is extending the utility of Public Minting, a
                Marketplace, and Farming for emerging NFT+token creators on
                Avalanche.
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

        {/* tri token ecosystem */}
        <Container>
          <div className="d-block d-md-none pb-5">
            <TriTokenEcoMain />
          </div>
          <h3>Tri-Token Ecosystem</h3>
          <Row className="py-4">
            <Col
              sm={12}
              md={6}
              className="g-3"
              style={{ 'max-width': '600px' }}
            >
              <StackCol className="gap-4">
                <StackRow className="gap-3">
                  <TriTokenLegendIcon src={SVG_TriToken_Legend_03_chicken} />
                  <div>
                    <b>chikn</b>
                    <br />
                    Your upgradeable <b>chikn</b> NFT, that lays <b>$egg</b>
                  </div>
                </StackRow>
                <StackRow className="gap-3">
                  <TriTokenLegendIcon src={SVG_TriToken_Legend_03_egg} />
                  <div>
                    <b>$egg</b>
                    <br />
                    The governance and utility token of the <b>chikn</b>
                    <br className="d-none d-lg-block" /> ecosystem. Hodl, use,
                    or sell on the open market
                  </div>
                </StackRow>
                <StackRow className="gap-3">
                  <TriTokenLegendIcon src={SVG_TriToken_Legend_03_worm} />
                  <div>
                    <b>$feed</b>
                    <br />
                    Harvested at chikn.farm, eaten by <b>chikn</b>,
                    <br className="d-none d-lg-block" /> or sold on the open
                    market
                  </div>
                </StackRow>
                {/* blue */}
                <StackRow className="gap-3">
                  <TriTokenLegendIcon src={SVG_TriToken_Legend_03_blue_eggs} />
                  <div>
                    <b>Lay</b>
                    <br />
                    Roost your <b>chikn</b> and lay <b>$egg</b>.
                    <br className="d-none d-lg-block" /> <i>Biggr</i>{' '}
                    <b>chikn</b> lay more <b>$egg</b>
                  </div>
                </StackRow>
                <StackRow className="gap-3">
                  <TriTokenLegendIcon
                    src={SVG_TriToken_Legend_03_blue_pitchfork}
                  />
                  <div>
                    <b>Farm</b>
                    <br />
                    Received <b>$egg</b> LP tokens are used
                    <br className="d-none d-lg-block" /> to farm <b>$feed</b> at
                    chikn.farm
                  </div>
                </StackRow>
                <StackRow className="gap-3">
                  <TriTokenLegendIcon src={SVG_TriToken_Legend_03_blue_kg} />
                  <div>
                    <b>Size</b> (Kg / KillerGainz)
                    <br />
                    <b>$feed</b> permanently increases the size
                    <br className="d-none d-lg-block" /> of your <b>chikn</b>.
                    It&apos;s written straight to the
                    <br className="d-none d-lg-block" /> metadata of your NFT
                  </div>
                </StackRow>
              </StackCol>
            </Col>
            <Col
              sm={12}
              md={6}
              className="d-flex align-items-center d-none d-md-flex"
            >
              <TriTokenEcoMain />
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
