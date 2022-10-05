import {
  Link,
  BrowserRouter,
  HashRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
//import DecentratwitterAbi from './contractsData/decentratwitter.json'
import DecentratwitterAbi from './contractsData/remix.json'
//import DecentratwitterAddress from './contractsData/decentratwitter-address.json'
import DecentratwitterAddress from './contractsData/remix-address.json'
import ResumeAddress from './contractsData/resume-address.json'
import ResumeAbi from './contractsData/resume.json'
import MarketAddress from './contractsData/market-address.json'
import MarketAbi from './contractsData/market.json'
import NftAddress from './contractsData/nft-address.json'
import NftAbi from './contractsData/nft.json';
import LandAddress from './contractsData/land-address.json';
import LandAbi from './contractsData/land.json';
import { Spinner, Navbar, Nav, Button, Container } from 'react-bootstrap'
import logo from './logo.png'
import Home from './Home.js'
import Profile from './Profile.js'
import Room from './Room.js'
import Market from './Market.js'
import Blog from './Blog';
import Land from './Land';
import Chat from './Chat';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState({});
  const [resumeContract, setResumeContract] = useState({});
  const [marketContract, setMarketContract] = useState({});
  const [nftContract, setNftContract] = useState({});
  const [landContract, setLandContract] = useState({});

  const web3Handler = async () => {
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    // Setup event listeners for metamask
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })
    window.ethereum.on('accountsChanged', async () => {
      setLoading(true)
      web3Handler()
    })
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Get signer
    const signer = provider.getSigner()
    loadContract(signer)
  }

  useEffect(() => {
    //so you don't need to connect each time you refresh
    web3Handler();
  })

  const loadContract = async (signer) => {

    // Get deployed copy of Decentratwitter contract
    //const contract = new ethers.Contract(DecentratwitterAddress.address, DecentratwitterAbi.abi, signer)
    //const contract = new ethers.Contract(DecentratwitterAddress.address, DecentratwitterAbi, signer)
    const resumeContract = new ethers.Contract(ResumeAddress.address, ResumeAbi, signer)
    const marketContract = new ethers.Contract(MarketAddress.address, MarketAbi, signer)
    const nftContract = new ethers.Contract(NftAddress.address, NftAbi, signer)
    const landContract = new ethers.Contract(LandAddress.address, LandAbi, signer)


    setContract(contract)
    setResumeContract(resumeContract)
    setMarketContract(marketContract)
    setNftContract(nftContract)
    setLandContract(landContract)
    setLoading(false)
  }
  return (
    <HashRouter>
      <div className="App">
        <>
        <div className="nav-bar">
          <Navbar expand="lg" bg="secondary" variant="dark" >
            <Container>
              <Navbar.Brand href="http://www.kylekoshiyama.me" target="_blank">
                <img src={logo} width="40" height="40" className="logo" alt="" />
                &nbsp; KyleVerse
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/room">Mint</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/market">Market</Nav.Link>
                  <Nav.Link as={Link} to="/land">Land</Nav.Link>
                  <Nav.Link as={Link} to="/chat">Chat</Nav.Link>
                  <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
                </Nav>
                <Nav>
                  {account ? (
                    <Nav.Link
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button nav-button btn-sm mx-4">
                      <Button variant="outline-light">
                        {account.slice(0, 5) + '...' + account.slice(38, 42)}
                      </Button>

                    </Nav.Link>
                  ) : (
                    <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
        </>
        <div className="app-body">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home resumeContract={resumeContract} />
              } />
              <Route path="/profile" element={
                <Profile marketContract={marketContract} nftContract={nftContract} />
              } />
              <Route path="/room" element={
                <Room resumeContract={resumeContract} marketContract={marketContract} nftContract={nftContract} />
              } />
              <Route path="/market" element={
                <Market resumeContract={resumeContract} marketContract={marketContract} nftContract={nftContract} />
              } />
              <Route path="/land" element={
                <Land nftContract={nftContract} landContract={landContract} />
              } />
              <Route path="/chat" element={
                <Chat nftContract={nftContract} />
              } />
              <Route path="/Blog" element={
                <Blog  />
              } />
            </Routes>
          )}
        </div>
      </div>

    </HashRouter>

  );
}

export default App;