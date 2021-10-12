import moment from 'moment-timezone'
import * as React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

const MOCK_DATE = '2021-12-25T00:00:00+1000'

const Component = ({ date = MOCK_DATE }) => {
  const [day, setDay] = React.useState('--')
  const [hrs, setHrs] = React.useState('--')
  const [min, setMin] = React.useState('--')
  const [sec, setSec] = React.useState('--')

  const setTime = (diffms, intervalRef) => {
    const d = new Date(diffms)
    if (diffms < 0) {
      setDay('00')
      setHrs('00')
      setMin('00')
      setSec('00')
      clearInterval(intervalRef)
    } else {
      setDay(String(d.getUTCDate() - 1).padStart(2, '0'))
      setHrs(String(d.getUTCHours()).padStart(2, '0'))
      setMin(String(d.getUTCMinutes()).padStart(2, '0'))
      setSec(String(d.getUTCSeconds()).padStart(2, '0'))
    }
  }

  React.useEffect(() => {
    setTime(moment(date).diff())
    const ref = setInterval(() => setTime(moment(date).diff()), 1000)
    return () => clearInterval(ref)
  }, [date])

  return (
    <>
      <Container className="countdown-monospace">
        <Row>
          <Col xs={3}>
            <h1>{day}</h1>
            <h4>DAY</h4>
          </Col>
          <Col xs={3}>
            <h1>{hrs}</h1>
            <h4>HRS</h4>
          </Col>
          <Col xs={3}>
            <h1>{min}</h1>
            <h4>MIN</h4>
          </Col>
          <Col xs={3}>
            <h1>{sec}</h1>
            <h4>SEC</h4>
          </Col>
        </Row>
        <Button disabled className="w-50 mt-5" size="lg">
          Mint
        </Button>
      </Container>
    </>
  )
}

export default Component
