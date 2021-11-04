/* eslint-disable no-unused-vars */
import * as React from 'react'
import { StackCol, StackRow } from '../components/Common'
import Layout from '../components/Layout'
import data from '../components/traits/traits.json'
import siteConfig from '../../site-config'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'

const size = 200

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${size}px ${size}px ${size}px ${size}px ${size}px ${size}px ${size}px ${size}px ${size}px ${size}px;
`
const Image = styled.img`
  width: ${size}px;
  height: ${size}px;
  border: 1px solid #eee;
`

// TODO Remove pre GO-LIVE
const IndexPage = () => {
  const pageSize = 50
  const total = data.length
  const totalPages = total / pageSize
  const [page, setPage] = React.useState(0)
  const from = page * pageSize
  const to = (page + 1) * pageSize
  return (
    <Layout constrainWidth={false} pageName="Parade" className="px-4">
      <StackCol className="justify-content-between">
        <h1>Parade</h1>
        <h5>
          Page {page} / {totalPages}
        </h5>
        <h5>
          (chikns {from.toLocaleString()} - {to.toLocaleString()} of{' '}
          {total.toLocaleString()})
        </h5>
        <div className="d-flex flex-row gap-2 mb-2">
          <Button
            onClick={() => setPage((ps) => Math.min(ps - 10, totalPages))}
          >
            Jump back 10 Pages
          </Button>
          <Button onClick={() => setPage((ps) => Math.max(ps - 1, 0))}>
            Prev Page
          </Button>
          <Button onClick={() => setPage((ps) => Math.min(ps + 1, totalPages))}>
            Next Page
          </Button>
          <Button
            onClick={() => setPage((ps) => Math.min(ps + 10, totalPages))}
          >
            Jump 10 Pages
          </Button>
        </div>

        <Grid>
          {data.slice(from, to).map((d) => (
            <a
              key={d.filename}
              href={siteConfig.cdnUrl + d.filename}
              target="_blank"
              rel="noreferrer"
            >
              <Image src={siteConfig.cdnUrl + d.filename} />
            </a>
          ))}
        </Grid>
      </StackCol>
    </Layout>
  )
}

export default IndexPage
