import { Link } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaDiscord, FaTwitter } from 'react-icons/fa'
import styled from 'styled-components'
import ChickenIconSrc from '../images/chicken-icon.png'
import AvalancheIconSrc from '../images/avalanche-avax-logo-black.svg'
import { ConnectWalletButton } from './ConnectWalletButton'
import { AButton, StackCol, StackRow, StyleDaChikn } from './Common'
import siteConfig from '../../site-config'
import HelmetMeta from './HelmetMeta'
import { useWeb3React } from '@web3-react/core'
import { useQueryClient } from 'react-query'
import { KEYS } from '../components/Connect'

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

const links = 'home,mint,market,farm,roost,wallet'.split(',')

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
  // add useEffect to monitor change in wallet
  const { library, account, chainId } = useWeb3React()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (!chainId || !account || !library) return
    const update = async () => {
      try {
        // invalidate all wallet related stuff
        queryClient.invalidateQueries(KEYS.CONTRACT())
        queryClient.invalidateQueries(KEYS.WALLET())
      } catch (e) {
        console.log('failed to setup user and contract', e)
      }
    }

    update()
    // eslint-disable-next-line
  }, [chainId, account, library])

  return (
    <FullHeight>
      {/* meta */}
      <HelmetMeta />

      {/* header */}
      <header style={{ postion: 'relative' }}>
        <Navbar
          bg="light"
          expand="md"
          fixed="top"
          className="bg-white border-bottom shadow-sm"
        >
          <Container>
            <Navbar.Brand href="/">
              <ChickenIcon />
              <StyleDaChikn>{siteConfig.title}</StyleDaChikn>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarResponsive" />
            <Navbar.Collapse
              id="navbarResponsive"
              className="justify-content-end"
            >
              {/* links */}
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
                    <StyleDaChikn>{siteConfig.title}</StyleDaChikn>
                  </h3>
                  <div>
                    <StyleDaChikn>{siteConfig.description}</StyleDaChikn>
                  </div>
                </StackCol>

                {/* social */}
                <StackCol>
                  <h6 className="mb-3 mt-5">Join the community</h6>
                  <StackRow className="gap-2">
                    <AButton
                      className="fs-5 btn-lg btn-outline-dark"
                      href={siteConfig.links.discord}
                    >
                      <FaDiscord />
                    </AButton>
                    <AButton
                      className="fs-5 btn-lg btn-outline-dark"
                      href={siteConfig.links.twitter}
                    >
                      <FaTwitter />
                    </AButton>
                  </StackRow>
                </StackCol>
              </StackCol>

              {/* links */}
              <Navbar bg="light">
                <Nav className="flex-column">
                  <HeaderLinks />

                  <Nav.Item>
                    <a
                      className="nav-link px-3 text-capitalize "
                      href={siteConfig.links.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Docs
                    </a>
                  </Nav.Item>
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
                <StyleDaChikn>{siteConfig.title}</StyleDaChikn> Inc
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
