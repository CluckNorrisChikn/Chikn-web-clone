import * as React from 'react'
import Layout from '../components/Layout'
import prettyMilliseconds from 'pretty-ms'
import moment from 'moment'
import styled from 'styled-components'
import { Section } from '../components/Common'

const FixedWidth = styled.span`
  font-family: var(--bs-font-monospace);
  display: inline-block !important;
  padding: 1rem 2rem;
  text-align: center;
`

const RELEASE_DATE = new Date(2021, 9, 8, 18, 0, 0)

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
    <Layout>
      <Section className="bg-light">
        <h1>
          Countdown: <FixedWidth>{timeRemaining}</FixedWidth>
        </h1>
        <small>{moment.utc(RELEASE_DATE).format('LLLL')} (UTC)</small>
      </Section>
    </Layout>
  )
}

export default IndexPage
