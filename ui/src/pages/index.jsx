import * as React from 'react'
import Layout from '../components/Layout'
import moment from 'moment'
import styled from 'styled-components'
import { AButton, Section, StyleDaChikn } from '../components/Common'
import ChickenCarousel from '../components/ChickenCarousel'
import { Container } from 'react-bootstrap'
import siteConfig from '../../site-config'
import ChickenHead from '../components/ChickenHead'
// import FlipDate from '../components/FlipDate'
import FlipCountdown from '@rumess/react-flip-countdown'

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

const IndexPage = () => {
  return (
    <Layout constrainWidth={false} className="gap-8">
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

      <div className="py-5">
        <Container className="pb-5 text-center">
          <h1>
            <StyleDaChikn>{siteConfig.description}</StyleDaChikn>
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
            <AButton
              className="fs-5 btn-outline-primary px-4"
              href={siteConfig.links.discord}
            >
              Join our Discord
            </AButton>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export default IndexPage
