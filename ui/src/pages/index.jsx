import * as React from 'react'
import Layout from '../components/Layout'
import prettyMilliseconds from 'pretty-ms'
import moment from 'moment'
import styled from 'styled-components'
import { Section } from '../components/Common'
import Ticker from 'react-ticker'
import PageVisibility from 'react-page-visibility'
import { Container } from 'react-bootstrap'

const FixedWidth = styled.span`
  font-family: var(--bs-font-monospace);
  display: inline-block !important;
  padding: 1rem 2rem;
  text-align: center;
`

const RELEASE_DATE = new Date(2021, 9, 8, 18, 0, 0)

const CAROUSEL_TICKER = [
  '/images/00acea1f-a4ad-44a1-ae2c-5c655ab904fd.png',
  '/images/1b3820ea-0d36-4eeb-953a-3dbcba57dfc8.png',
  '/images/206f1b89-0d9c-484d-b9b2-4c3b64f2a7c2.png',
  '/images/3fe19ff5-469c-4f90-b760-477b852d2617.png',
  '/images/48de9b30-191f-4ff5-be62-3d1627584cce.png',
  '/images/50d04651-8e51-4828-8d73-f284b5fc8e90.png',
  '/images/aa7b9813-55da-4381-8242-d8315bae056a.png',
  '/images/b8e2eb55-8b6c-4a6a-ac2b-cd4b216fdfea.png',
  '/images/d3053fb4-8dc8-4ff5-930a-62134842c82a.png',
  '/images/f37d652b-dbba-4bb6-aa18-975adbe4d454.png'
]

const prettyDiff = () =>
  prettyMilliseconds(
    parseInt((RELEASE_DATE.getTime() - Date.now()) / 1000) * 1000
  )

const ChiknPortrait = styled.img`
  width: 200px;
  height: 200px;
  margin-right: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
`

// markup
const IndexPage = () => {
  const [timeRemaining, setTimeRemaining] = React.useState(prettyDiff())
  React.useEffect(() => {
    const timer = setInterval(() => setTimeRemaining(prettyDiff()), 1000)
    return () => clearInterval(timer)
  }, [])

  const [pageIsVisible, setPageIsVisible] = React.useState(true)

  return (
    <Layout constrainWidth={false} className="gap-5">
      <Container>
        <Section className="bg-light">
          <h1>
            Countdown: <FixedWidth>{timeRemaining}</FixedWidth>
          </h1>
          <small>{moment.utc(RELEASE_DATE).format('LLLL')} (UTC)</small>
        </Section>
      </Container>

      <PageVisibility onChange={(isVisible) => setPageIsVisible(isVisible)}>
        {pageIsVisible && (
          <Ticker>
            {({ index }) => (
              <ChiknPortrait
                src={CAROUSEL_TICKER[index % CAROUSEL_TICKER.length]}
                alt=""
              />
            )}
          </Ticker>
        )}
      </PageVisibility>
    </Layout>
  )
}

export default IndexPage
