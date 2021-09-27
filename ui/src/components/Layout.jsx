import { Link } from 'gatsby'
import * as React from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import styled from 'styled-components'
import ChickenIconSrc from '../images/chicken-icon.png'
import AvalancheIconSrc from '../images/avalanche-avax-logo-black.svg'
import { ConnectWalletButton } from './ConnectWalletButton'

const AvaxLogoSmall = styled((props) => (
  <img src={AvalancheIconSrc} {...props} />
))`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.2rem;
`

const ChickenIcon = styled((props) => <img src={ChickenIconSrc} {...props} />)`
  width: 4rem;
  height: 4rem;
  margin-right: 0.5rem;
`

const Spacer = styled.div`
  width: 30px;
`

const StackCol = ({ className = '', ...props }) => (
  <div className={`d-flex flex-column ${className}`} {...props} />
)
const StackRow = ({ className = '', ...props }) => (
  <div className={`d-flex flex-row ${className}`} {...props} />
)
const Stack = StackCol

const FullHeight = styled(Stack)`
  height: 100%;
  width: 100%;
`

const NavGatsbyLink = ({ children, disabled, ...props }) => {
  return (
    <Nav.Item>
      <Link
        className={`nav-link px-3 ${disabled ? 'disabled' : ''}`}
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

const HeaderLinks = () => (
  <>
    <NavGatsbyLink to="/">Home</NavGatsbyLink>
    <NavGatsbyLink to="/mint">Mint</NavGatsbyLink>
    <NavGatsbyLink to="/marketplace">Market</NavGatsbyLink>
    <NavGatsbyLink to="/wallet">Wallet</NavGatsbyLink>
  </>
)

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
            <Navbar.Brand href="/">
              <ChickenIcon /> Chikn NFT
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarResponsive" />
            <Navbar.Collapse
              id="navbarResponsive"
              className="justify-content-end"
            >
              <Nav className="align-items-md-center">
                <HeaderLinks />
                <Spacer />
                <Nav.Item>
                  <ConnectWalletButton />
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* main */}
      <main className="flex-grow-1">
        <Container className="my-5">{children}</Container>
      </main>

      {/* footer */}
      <footer className="border-top bg-light">
        <StackCol>
          <Container className="py-5">
            <StackCol className="gap-4 flex-md-row justify-content-between">
              <StackCol className="justify-content-between">
                <StackCol>
                  <h3>
                    <ChickenIcon /> Chikn NFT
                  </h3>
                  <div>8,000 unique chickens who need farmers.</div>
                </StackCol>
                <StackCol>
                  <h5 className="mb-3 mt-5">Join the community</h5>
                  <StackRow className="gap-2">
                    <a className="btn btn-lg btn-outline-primary" href="#">
                      <FaDiscord />
                    </a>
                    <a className="btn btn-lg btn-outline-primary" href="#">
                      <FaTwitter />
                    </a>
                  </StackRow>
                </StackCol>
              </StackCol>
              <Navbar bg="light">
                <Nav className="flex-column">
                  <HeaderLinks />
                  <NavGatsbyLink to="/terms">
                    Terms &amp; Conditions
                  </NavGatsbyLink>
                </Nav>
              </Navbar>
            </StackCol>
          </Container>
          <Container className="border-top p-3">
            <StackRow className="justify-content-between align-items-center">
              <small>&copy; {new Date().getFullYear()} Chikn NFT Inc</small>
              <small>
                Powered by <AvaxLogoSmall />
              </small>
            </StackRow>
          </Container>
        </StackCol>
      </footer>
    </FullHeight>
  )
}

export default Layout
