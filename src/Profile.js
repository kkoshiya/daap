import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button, Card, ListGroup, Col } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer';
import { marketAddress } from './contractsData/market-address.json';
import './css/profile.css'


//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const ipfsClient = require('ipfs-http-client');

const projectId = '2ErURtKagCMdhuyXpeKH3HhuRhb';   // <---------- your Infura Project ID

const projectSecret = '0270ba21357357b3a2ea8a02302cd117';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient.create({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});



const Profile = ({ marketContract, nftContract }) => {
    const [profile, setProfile] = useState('')
    const [nfts, setNfts] = useState([])
    const [nfts2, setNfts2] = useState([])
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true);
    const [price, setPrice] = useState(null);
    const [approved, setApproval] = useState(false);
    const [account, setAccount] = useState(null);
    const [bio, setBio] = useState('default');
    const [newBio, saveBio] = useState('');


    const loadNfts = async () => {

        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //setAccount(accounts[0]);
        const id = await nftContract.profiles(accounts[0]);
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
        await setNfts(nfts);
        const profileId = await nftContract.profiles(accounts[0])
        const profile = nfts.find((i) => i.id.toString() === profileId.toString());
        setProfile(profile);
        const bioText = await nftContract.bios(profile.id);
        setBio(bioText); 
    }

    // const getProfile = async () => {
    //     //const address = await nftContract.signer.getAddress()
    //     console.log('trying to get profile')
    //     let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     //setAccount(accounts[0]);
    //     const id = await nftContract.profiles(accounts[0])
    //     const profile = nfts.find((i) => i.id.toString() === id.toString())
    //     setProfile(profile);
    //     const bioText = await nftContract.bios(profile);
    //     setBio() 
    //     //console.log(profile.name)
    // }



    const uploadToIPFS = async (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                setAvatar(`https://infura-ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
    }

    const switchProfile = async (nft) => {
        setLoading(true);
        await (await nftContract.setProfile(nft.id)).wait();
        //getProfile(nfts)
        loadNfts();
    }

    const updateBio = async(id) => {
        setLoading(true)
        await (await nftContract.changeBio(profile.id, newBio)).wait();
    }

    const list = async (nft) => {
        if (!approved) return
        const id = nft.id;
        // await(await nftContract.setApprovalForAll(marketContract.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await(await marketContract.makeItem(nftContract.address, id, listingPrice)).wait()
    }

    const isApproved = async () => {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        let approved = await nftContract.isApprovedForAll(accounts[0], marketContract.address);
        setApproval(approved)
    }

    const approve = async () => {
        await(await nftContract.setApprovalForAll(marketContract.address, true)).wait()
    }

    useEffect(() => {
        if (nfts.length == 0) {
            //console.log('hit loading')
            loadNfts()
            isApproved()
            //getProfile()

            console.log('why does this keep hitting')
            setLoading(false);
        }
    })
    if (loading) return (
        <div className='text-center'>
            <main style={{ padding: "1rem 0" }}>
                <br />
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div className="mt-4 text-center">
            {approved ? (<div></div>)
            :
            (
            <div> 
                <br />
                <p>Not Approved!!!</p>
                <Button onClick={() => approve()} variant="primary" size="lg">
                    Approve for Marketplace Listing
                </Button>
                <p>&nbsp;</p>
                <hr />
                <p className="my-auto">&nbsp;</p>

            </div>
            )}

            {profile ? (
                <div className="mb-3">
                    <h3 className="mb-3">{profile.name}</h3>
                    <img className="mb-3" style={{ width: '400px' }} src={profile.image} />
                    <div>
                        <h3>Bio</h3>
                        <p>{bio}</p>
                    </div>

                    <div>
                        <Form.Control onChange={(e) => saveBio(e.target.value)} size="lg" placeholder="Write in Bio Here" />
                        <Button onClick={() => updateBio(profile)} variant="primary" size="lg">
                            Update Bio
                        </Button>
                    </div>
                </div>)
                :
                <h4 className="mb-4">No NFT profile, please create one...</h4>} 

            <p>&nbsp;</p>
            <hr />
            <p className="my-auto">&nbsp;</p>


            <div className="px-5 container">
                <Row xs={1} md={2} lg={4} className="g-4 py-5">
                    {nfts.map((nft, idx) => {
                        if (nft.id === profile.id) return
                        return (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Header>
                                        <div className='d-grid'>
                                            <Button onClick={() => switchProfile(nft)} variant="primary" size="lg">
                                                Set Profile
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Img className='card-image' variant="top" src={nft.image} />
                                    <Card.Body color="secondary">
                                        <Card.Title>{nft.name}</Card.Title>
                                    </Card.Body>
                                    <Card.Footer>
                                        <div className='d-grid'>
                                            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in Matic" />
                                            <Button onClick={() => list(nft)} variant="primary" size="lg">
                                                List on Market
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
    );
}

export default Profile;