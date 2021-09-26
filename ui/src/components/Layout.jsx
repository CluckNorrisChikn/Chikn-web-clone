import { Link } from 'gatsby'
import * as React from 'react'
import { Button, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import styled from 'styled-components'

// const Footer = styled.footer`
// background: #1868b7;
// color: #ffffff;
// a {
//   color: #ffffff;
// }
// .btn {
//   border-color: #ffffff;
// }
// `

const Spacer = styled.div`
  width: 30px;
`

const Stack = styled.div`
  display: flex !important;
  flex-direction: column;
`
const StackRow = styled.div`
  display: flex !important;
  flex-direction: row;
`

const FullHeight = styled(Stack)`
  height: 100%;
  width: 100%;
`

const SocialLink = styled(
  ({ className = '', href = '', icon: Icon, ...props }) => {
    return (
      <>
        <Nav.Item>
          <Nav.Link className={`${className}`} href={href}>
            <Icon />
          </Nav.Link>
        </Nav.Item>
      </>
    )
  }
)`
  height: 2.8rem;
  width: 2.8rem;
  display: flex !important;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
`

const NavGatsbyLink = ({ children, disabled, ...props }) => {
  return (
    <Nav.Item>
      <Link
        className={`nav-link px-3 ${disabled && 'disabled'}`}
        activeClassName="active"
        {...props}
      >
        {children}
      </Link>
    </Nav.Item>
  )
}

const NavButton = (props) => {
  return (
    <Nav.Item>
      <Button {...props} />
    </Nav.Item>
  )
}

const Layout = ({ children = [] }) => {
  return (
    <FullHeight>
      {/* header */}
      <header>
        <Navbar
          bg="light"
          expand="md"
          fixed="top"
          className="bg-white border-bottom shadow-sm"
        >
          <Container>
            <Navbar.Brand href="/">Chikn NFT</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarResponsive" />
            <Navbar.Collapse
              id="navbarResponsive"
              className="justify-content-end"
            >
              <Nav>
                <NavGatsbyLink to="/">Home</NavGatsbyLink>
                <NavGatsbyLink to="/mint">Mint</NavGatsbyLink>
                <NavGatsbyLink to="/marketplace">Market</NavGatsbyLink>
                <Spacer />
                <NavButton variant="outline-primary" className="px-3">
                  Connect wallet
                </NavButton>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* main */}
      <main className="pt-5 flex-grow-1">
        <Container className="my-5">{children}</Container>
      </main>

      {/* footer */}
      <footer className="border-top bg-light">
        <Stack>
          <Container className="d-flex justify-content-between py-5">
            <Stack className="justify-content-between">
              <Stack>
                <h3>Chikn NFT</h3>
                <div>8,000 unique chickens who need farmers.</div>
              </Stack>
              <Stack>
                <h5 className="mb-3">Join the community</h5>
                <StackRow className="gap-2">
                  <a className="btn btn-lg btn-outline-primary" href="#">
                    <FaDiscord />
                  </a>
                  <a className="btn btn-lg btn-outline-primary" href="#">
                    <FaTwitter />
                  </a>
                </StackRow>
              </Stack>
            </Stack>
            <Nav defaultActiveKey="/home" className="flex-column">
              <NavGatsbyLink to="/">Home</NavGatsbyLink>
              <NavGatsbyLink to="/mint">Mint</NavGatsbyLink>
              <NavGatsbyLink to="/marketplace">Market</NavGatsbyLink>
              <NavGatsbyLink to="/terms">Wallet</NavGatsbyLink>
              <NavGatsbyLink to="/terms">Terms &amp; Conditions</NavGatsbyLink>
            </Nav>
          </Container>
          <Container className="border-top p-3">
            <small>&copy; {new Date().getFullYear()} Chikn NFT Inc</small>
          </Container>
        </Stack>
      </footer>
    </FullHeight>
  )
}

export default Layout
