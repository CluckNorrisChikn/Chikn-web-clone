import { Link } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import styled from 'styled-components'
import ChickenIconSrc from '../images/chicken-icon.png'
import AvalancheIconSrc from '../images/avalanche-avax-logo-black.svg'
import { ConnectWalletButton } from './ConnectWalletButton'
import Helmet from 'react-helmet'
import { ChiknText, StackCol, StackRow, StyleDaChikn } from './Common'
import SiteConfig from '../../site-config'

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

const Stack = StackCol

const FullHeight = styled(Stack)`
  height: 100%;
  width: 100%;
`

const NavGatsbyLink = ({ children, disabled, ...props }) => {
  return (
    <Nav.Item>
      <Link
        className={`nav-link px-3 text-capitalize ${
          disabled ? 'disabled' : ''
        }`}
        activeClassName="active"
        {...props}
      >
        {children}
      </Link>
    </Nav.Item>
  )
}

const links = 'home,mint,market,farm,roost'.split(',')

const HeaderLinks = () =>
  links.map((link, idx) => (
    <NavGatsbyLink key={link} to={idx === 0 ? '/' : `/${link}`}>
      {link}
    </NavGatsbyLink>
  ))

const Layout = ({
  children = [],
  constrainWidth = true,
  className = 'gap-4'
}) => {
  return (
    <FullHeight>
      {/* meta */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>{SiteConfig.title}</title>
        <meta name="description" content={SiteConfig.description} />
        <link rel="canonical" href={SiteConfig.url} />
      </Helmet>

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
              <ChickenIcon />
              <StyleDaChikn>{SiteConfig.title}</StyleDaChikn>
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
        {constrainWidth
          ? (
          <Container className={`${className} my-5 d-flex flex-column`}>
            {children}
          </Container>
            )
          : (
          <div className={`${className} my-5 d-flex flex-column`}>
            {children}
          </div>
            )}
      </main>

      {/* footer */}
      <footer className="border-top bg-light">
        <StackCol>
          <Container className="py-5">
            <StackCol className="gap-4 flex-md-row justify-content-between">
              <StackCol className="justify-content-between">
                <StackCol>
                  <h3>
                    <ChickenIcon />
                    <StyleDaChikn>{SiteConfig.title}</StyleDaChikn>
                  </h3>
                  <div>
                    <StyleDaChikn>{SiteConfig.description}</StyleDaChikn>
                  </div>
                </StackCol>
                <StackCol>
                  <h6 className="mb-3 mt-5">Join the community</h6>
                  <StackRow className="gap-2">
                    <a className="btn btn-lg btn-outline-dark" href="#">
                      <FaDiscord />
                    </a>
                    <a className="btn btn-lg btn-outline-dark" href="#">
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
              <small>
                &copy; {new Date().getFullYear()}{' '}
                <StyleDaChikn>{SiteConfig.title}</StyleDaChikn> Inc
              </small>
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
