import * as React from 'react'
import Layout from '../components/Layout'
import prettyMilliseconds from 'pretty-ms'
import moment from 'moment'
import styled from 'styled-components'
import { Section, StyleDaChikn } from '../components/Common'
import ChickenCarousel from '../components/ChickenCarousel'
import { Button, Container } from 'react-bootstrap'
import SiteConfig from '../../site-config'
import ChickenHead from '../components/ChickenHead'
import FlipDate from '../components/FlipDate'

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

const FixedWidth = styled.span`
  font-family: var(--bs-font-monospace);
  display: inline-block !important;
  padding: 1rem 2rem;
  text-align: center;
`

const RELEASE_DATE = new Date('2021-10-09T00:00:00+10:00')

const prettyDiff = () =>
  prettyMilliseconds(
    parseInt((RELEASE_DATE.getTime() - Date.now()) / 1000) * 1000
  )

// markup
const IndexPage = () => {
  const [timeRemaining, setTimeRemaining] = React.useState(prettyDiff())
  React.useEffect(() => {
    const timer = setInterval(() => setTimeRemaining(prettyDiff()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Layout constrainWidth={false} className="gap-7">
      <Container>
        <Section className="bg-light">
          <h1>
            Countdown: <FixedWidth>{timeRemaining}</FixedWidth>
            {/* <FlipDate value={RELEASE_DATE.toISOString()} /> */}
          </h1>
          <small>{moment.utc(RELEASE_DATE).format('LLLL')} (UTC)</small>
        </Section>
      </Container>

      <div className="py-5">
        <Container className="pb-5 text-center">
          <h1>
            <StyleDaChikn>{SiteConfig.description}</StyleDaChikn>
          </h1>
        </Container>
        <ChickenCarousel />
      </div>

      <div className="bg-light">
        <Container className="position-relative">
          <ChickenHeadImageWrapper />
          <div className="py-5">
            <h3>Join the community</h3>
            <p>
              For the latest news, updates and access to pre-release content.
            </p>
            <Button variant="outline-primary">Join our Discord</Button>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default IndexPage
