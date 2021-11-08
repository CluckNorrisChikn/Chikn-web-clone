import { useWeb3React } from '@web3-react/core'
import { Link } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import siteConfig from '../../site-config'
import { KEYS } from '../components/Connect'
import AvalancheIconSrc from '../images/avalanche-avax-logo-black.svg'
import {
  ChickenIcon,
  isProd,
  SocialDiscordButton,
  SocialTwitterButton,
  StackCol,
  StackRow,
  StyleDaChikn
} from './Common'
import { ConnectWalletButton } from './ConnectWalletButton'
import HelmetMeta from './HelmetMeta'

const AvaxLogoSmall = styled((props) => (
  <img src={AvalancheIconSrc} {...props} />
))`
  width: 1.2rem;
  height: 1.2rem;
  margin-left: 0.2rem;
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

const links = isProd
  ? 'home'.split(',') // prod
  : 'home,mint,market,wallet'.split(',') // dev -  ,farm,roost

const HeaderLinks = () =>
  links.map((link, idx) => (
    <NavGatsbyLink key={link} to={idx === 0 ? '/' : `/${link}`}>
      {link}
    </NavGatsbyLink>
  ))

const Layout = ({
  pageName = undefined,
  children = [],
  constrainWidth = true,
  padTop = true,
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
        // queryClient.invalidateQueries(KEYS.CONTRACT()) // Don't invalidate the whole contract, when you only need to update the wallet.
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
      <HelmetMeta pageName={pageName} />

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
              {/* <StyleDaChikn>{siteConfig.title}</StyleDaChikn> */}
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
            <Container
              className={`${className} ${
                padTop ? 'mt-5' : 'mt-0'
              } mb-5 d-flex flex-column`}
            >
              {/* <TransactionProgress intialOnShow={true} /> */}
              {children}
            </Container>
          )
          : (
            <div
              className={`${className} ${
                padTop ? 'mt-5' : 'mt-0'
              } mb-5 d-flex flex-column`}
            >
              {/* <TransactionProgress intialOnShow={false} /> */}
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
                    {/* <StyleDaChikn>{siteConfig.title}</StyleDaChikn> */}
                  </h3>
                  <div>
                    <StyleDaChikn>{siteConfig.description}</StyleDaChikn>
                  </div>
                </StackCol>

                {/* social */}
                <StackCol>
                  <h6 className="mb-3 mt-5">Join the community</h6>
                  <StackRow className="gap-2">
                    <SocialDiscordButton />
                    <SocialTwitterButton />
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
                  {/* TODO Temporarily removed terms and conditions -> Joe */}
                  {/* <NavGatsbyLink to="/terms">
                    Terms &amp; Conditions
                  </NavGatsbyLink> */}
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
