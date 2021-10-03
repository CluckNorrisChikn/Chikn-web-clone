import * as React from 'react'
import { Alert, Card } from 'react-bootstrap'
import { ChiknText } from './Common'
import { useGetTokenQuery } from './Connect'
import styled from 'styled-components'

const Properties = styled.dl`
  display: grid;
  grid-template-columns: 120px auto;
  column-gap: 10px;
  row-gap: 2px;
  margin-bottom: 0px;
  text-transform: capitalize;
  dd {
    margin-bottom: 0px;
  }
  dt {
    font-weight: normal;
  }
`

const ChiknCard = styled(Card)`
  max-width: 500px;
`

const Image = styled((props) => <Card.Img variant="top" {...props} />)`
  max-width: 500px;
  max-height: 500px;
  &.shimmer {
    width: 500px;
    height: 500px;
  }
`

const PropertyColour = ({ children }) => {
  const pv = children.toLowerCase()
  if (pv === 'none') return <span className="text-black-50">{children}</span>
  else return <span>{children}</span>
}

const ChickenCard = ({ tokenId }) => {
  const getTokenQuery = useGetTokenQuery(tokenId)
  const { data } = getTokenQuery

  return (
    <>
      {getTokenQuery.isLoading && (
        <ChiknCard>
          <Image className="shimmer" />
          <Card.Body>
            <h3 className="shimmer w-50">&nbsp;</h3>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
            <label className="shimmer w-75 mb-1">&nbsp;</label>
          </Card.Body>
        </ChiknCard>
      )}
      {getTokenQuery.isError && (
        <Alert variant="danger">
          {getTokenQuery.error.response.data.message}
        </Alert>
      )}
      {getTokenQuery.isSuccess && (
        <>
          <ChiknCard>
            <Image src={data.image} />
            <Card.Body>
              <h5>
                <ChiknText /> #{tokenId}
              </h5>
              <Properties className="fs-6">
                {'background,chicken,headwear,mouth,eyewear,neck,arms,tail,feet'
                  .split(',')
                  .map((property) => {
                    return (
                      <>
                        <dd>{property}</dd>
                        <dt>
                          <PropertyColour>{data[property]}</PropertyColour>
                        </dt>
                      </>
                    )
                  })}
              </Properties>
            </Card.Body>
          </ChiknCard>
        </>
      )}
    </>
  )
}

export default ChickenCard
