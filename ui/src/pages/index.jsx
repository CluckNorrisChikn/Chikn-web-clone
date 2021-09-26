import * as React from 'react'
import { Jumbotron } from 'react-bootstrap'
import Layout from '../components/Layout'
import prettyMilliseconds from 'pretty-ms'
import moment from 'moment'
import styled from 'styled-components'

const FixedWidth = styled.span`
  display: inline-block !important;
  width: 350px;
  border: 1px solid black;
  padding: 1rem;
  text-align: left;
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
      <Jumbotron className="p-5 bg-light bg-gradient rounded-pill text-center">
        <h1>
          Countdown: <FixedWidth>{timeRemaining}</FixedWidth>
        </h1>
        <small>{moment.utc(RELEASE_DATE).format('LLLL')} (UTC)</small>
      </Jumbotron>
    </Layout>
  )
}

export default IndexPage
