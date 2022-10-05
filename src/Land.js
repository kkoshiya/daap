import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Form, Button, Card, ListGroup, Container } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer';
import './css/land.css';
import landImage from './images/moon.gif';

// const ipfsClient = require('ipfs-http-client');

// const projectId = '2ErURtKagCMdhuyXpeKH3HhuRhb';   // <---------- your Infura Project ID

// const projectSecret = '0270ba21357357b3a2ea8a02302cd117';  // <---------- your Infura Secret
// // (for security concerns, consider saving these values in .env files)

// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// const client = ipfsClient.create({
//     host: 'infura-ipfs.io',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//         authorization: auth,
//     },
// });


const Land = ({ nftContract, landContract }) => {
    const [hasProfile, setHasProfile] = useState(false);
    const [profile, setProfile] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(true)
    const [imageLink, setImage] = useState('') 
    const [items, setItems] = useState([]);
    const [land, setLand] = useState([]);
    const [nfts, setNfts] = useState([])
    const [approved, setApproval] = useState(false);
    const [account, setAccount] = useState(null);
    const [stakedNft, setStakedNft] = useState({image: null});
    const [duration, setDuration] = useState('');

    const isApproved = async () => {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        let approved = await nftContract.isApprovedForAll(accounts[0], landContract.address);
        setApproval(approved)
    }

    const approve = async () => {
        await(await nftContract.setApprovalForAll(landContract.address, true)).wait()
    }

    const loadLand = async () => {
        const results = await landContract.getMyNfts();
        const id = results[0];
        const uri = await landContract.tokenURI(id);
        const response = await fetch(uri);
        const metadata = await response.json();
        const land = {
            id: id,
            image: metadata.image
        }
        setLand(land);
    }

    const loadNfts = async () => {
        const results = await nftContract.getMyNfts();
        let nfts = await Promise.all(results.map(async i => {
            const uri = await nftContract.tokenURI(i);
            const response = await fetch(uri);
            const metadata = await response.json()
            return ({
                id: i,
                image: metadata.image,
                name: metadata.name,
                description: metadata.description
            })
        }))
        setNfts(nfts);
    }

    const stake = async (nft) => {
        if (!approved) return;
        let open = await landContract.open(land.id);
        if (!open) return;
        const id = nft.id;
        await(await landContract.stake(nftContract.address, land.id ,id)).wait()
    }

    const unStake = async () => {
        let nft = await landContract.staked(land.id);
        await(await landContract.unStake(nftContract.address, land.id, nft)).wait()
    }

    const getStaked = async () => {
        let nft = await landContract.staked(land.id);
        let uri = await nftContract.tokenURI(nft);
        const response = await fetch(uri);
        const metadata = await response.json();
        let data = {
            id: nft,
            image: metadata.image
        }
        setStakedNft(data);
        let duration = await landContract.duration(land.id);
        duration = duration.toString();
        setDuration(duration);
    }


    const mintLand = async () => {
        await(await landContract.mint('https://ipfs.io/ipfs/QmWDCG3zHWYNk3H74CSNUqL2jjGzJjrhohF8f6kFfiJjPe')).wait()
    }


    useEffect(() => {
        if (nfts.length == 0) {
            isApproved();
            loadLand();
            loadNfts();
            getStaked();
            setLoading(false);
        }
    })


    if (loading) return (
        <div>
            <div>Loading loading is true</div>
            <div>Loading</div>
            <div>Loading</div>
            <div>Loading</div>
            <div>Loading loading is true</div>
        </div >
    );

    return (
        <div>
            <div className='landPage'>
                {approved ? (<div></div>)
                :
                (
                <div> 
                    <h1>Not Approved!!</h1>
                    <Button onClick={() => approve()} variant="primary" size="lg">
                        Approve
                    </Button>
                </div>
                )}

                {land.length == 0 ? (
                <div>
                    <h1>Mint free land since you don't have one</h1>
                    <Button onClick={() => mintLand()} variant="primary" size="lg">
                        Mint Land
                    </Button>
                </div>)
                :
                (<div> </div>)}

                <div className='land-container'>
                    <div>
                        <h1 className='text-center'>KyleVerse Land</h1>
                    </div>
                    <div className='landImageContainer'></div>
                    <Row>
                        <Col></Col>
                        <Col>
                            <Row>
                                <div>
                                    <img className='land-img' src={landImage} />
                                </div>
                            </Row>
                        </Col> 
                        <Col></Col>
                    </Row>
                </div>


                <div className='stake-container'>
                    <div>

                    </div>


                    {stakedNft.image ? (
                        
                        <div>
                            <Row>
                                <Col></Col>
                                <Col>
                                    <div>
                                        <img src={stakedNft.image} className='staked-image'/>
                                    </div>
                                    <div className>
                                        <Button onClick={() => unStake()} variant="primary" size="lg">
                                            Unstake
                                        </Button>
                                    </div> 
                                    <div>

                                    </div>
                                </Col>
                                <Col>
                                    <div>Staking Time: {duration} seconds</div>
                                </Col>
                            </Row>
                        </div>

                    )
                    :
                    (
                    <div> 
                        <br />
                        <h1>Looks Like you aren't staking</h1>
                    </div>
                    )}
                </div>

                <div>
                    {stakedNft.image ? (<div></div>)
                    :
                    (
                    <div> 
                        <div className="px-5 container">
                            <Row xs={1} md={2} lg={4} className="g-4 py-5">
                                {nfts.map((nft, idx) => {
                                    return (
                                        <Col key={idx} className="overflow-hidden">
                                            <Card>
                                                <Col>
                                                    <div>
                                                        <Card.Img variant="top" className='card-image' src={nft.image} />
                                                    </div>
                                                </Col>
                                                <Card.Body color="secondary">
                                                    <Card.Title>{nft.name}</Card.Title>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <div className='d-grid'>
                                                        <Button onClick={() => stake(nft)} variant="primary" size="lg">
                                                            Stake
                                                        </Button>
                                                    </div>       

                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </div> 
                    </div>
                    )}
                </div>


            </div>
        </div>

    )
}

export default Land