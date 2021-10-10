import FlipCountdown from '@rumess/react-flip-countdown'
import moment from 'moment-timezone'
import * as React from 'react'
import { Container } from 'react-bootstrap'
import { Section } from '../Common'

const MOCK_DATE = '2021-12-25T00:00:00+1000'

// const date = siteConfig.releaseDate
const date = MOCK_DATE

const Component = () => {
  return (
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
            endAt={'2021-12-25T00:00:00+1000'} // Date/Time
          />
        </h1>
        <small>{moment.utc(date).format('LLLL')} (UTC)</small>
      </Section>
    </Container>
  )
}

export default Component
