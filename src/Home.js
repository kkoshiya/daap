import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Stack, Form, Button, Card, ListGroup } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer';
import logo from './logo.png';
import './css/home.css';

const ipfsClient = require('ipfs-http-client');

const projectId = '2ErURtKagCMdhuyXpeKH3HhuRhb';  
const projectSecret = '0270ba21357357b3a2ea8a02302cd117'; 

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


const Home = ({ resumeContract }) => {
    const [posts, setPosts] = useState('')
    const [hasProfile, setHasProfile] = useState(false)
    const [post, setPost] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    // const loadPosts = async () => {
    //     // Get user's address
    //     let address = await contract.signer.getAddress()
    //     setAddress(address)
    //     // Check if user owns an nft
    //     // and if they do set profile to true
    //     const balance = await contract.balanceOf(address)
    //     setHasProfile(() => balance > 0)
    //     // Get all posts
    //     let results = await contract.getAllPosts()
    //     // Fetch metadata of each post and add that to post object.
    //     let posts = await Promise.all(results.map(async i => {
    //         // use hash to fetch the post's metadata stored on ipfs 
    //         let response = await fetch(`https://infura-ipfs.io/ipfs/${i.hash}`)
    //         const metadataPost = await response.json()
    //         // get authors nft profile
    //         const nftId = await contract.profiles(i.author)
    //         // get uri url of nft profile
    //         const uri = await contract.tokenURI(nftId)
    //         // fetch nft profile metadata
    //         response = await fetch(uri)
    //         const metadataProfile = await response.json()
    //         // define author object
    //         const author = {
    //             address: i.author,
    //             username: metadataProfile.username,
    //             avatar: metadataProfile.avatar
    //         }
    //         // define post object
    //         let post = {
    //             id: i.id,
    //             content: metadataPost.post,
    //             tipAmount: i.tipAmount,
    //             author
    //         }
    //         return post
    //     }))

    //     posts = posts.sort((a, b) => b.tipAmount - a.tipAmount)
    //     // Sort posts from most tipped to least tipped. 
    //     setPosts(posts)
    //     setLoading(false)
    // }
    // useEffect(() => {
    //     if (!posts) {
    //         loadPosts()
    //     }
    // })
    // const uploadPost = async () => {
    //     if (!post) return
    //     let hash
    //     // Upload post to IPFS
    //     try {
    //         const result = await client.add(JSON.stringify({ post }))
    //         setLoading(true)
    //         hash = result.path
    //     } catch (error) {
    //         window.alert("ipfs image upload error: ", error)
    //     }
    //     // upload post to blockchain
    //     await (await contract.uploadPost(hash)).wait()
    //     loadPosts()
    // }
    // const tip = async (post) => {
    //     // tip post owner
    //     await (await contract.tipPostOwner(post.id, { value: ethers.utils.parseEther("0.1") })).wait()
    //     loadPosts()
    // }

    const mintResume = async () => {
        await (await resumeContract.mint("https://ipfs.io/ipfs/QmThCT36VDMHWnzu34UbpNynfbB6ZfTrUfNmrYaco9BzoZ")).wait()
    }

    if (loading) return (
        <div className='text-center'>
            <main style={{ padding: "1rem 0" }}>
                <br />
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div>
            <Stack direction="verticle" gap={5}>
                <Row>
                    <div className='background'>
                        <div className="text-center">
                            <div className='cover-text'>
                                <h1 className='cover-text'>Welcome to the KyleVerse</h1>
                            </div>
                            <div>

                                <Button size="lg" variant="light" onClick={mintResume}>
                                    Mint Resume    
                                </Button> 
                            </div>
                        </div>
                        <br />
                    </div>
                </Row>

                <div className='text-center'>
                    <Row>
                        <Col></Col>
                        <Col xs={10}>
                            <h3>Please excuse my lack of style, but the main purpose of this site is to display my professionacy 
                                with Soldity and React Integration. If you would like more traditional information please feel free to mint 
                                a free Copy of my resume as an NFT. Or press the Logo on the top Left of the Menu bar to be redirected to my Web2 site, there you can
                                downlad a copy of my resume PDF as well as view my other projects. Thank you for your time.
                            </h3>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>

                <div className='text-center'>
                    <Row>
                        <Col></Col>
                        <Col xs={10}>
                            <h3>Sometimes MetaMask has trouble connecting to the Network. You may notice that the pop-up refuses to load the estimated costs for the 
                                transaction. If you minimize the Pop-up window (hit the yellow minimize button) and re-open it, the transactions details 
                                should be fixed, and you will be good to go!
                            </h3>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>

                <p>&nbsp;</p>
                <hr />

                <div className='text-center'>
                    <h2>Instructions</h2>
                </div>


                <Row>
                    <Col></Col>
                    <Col xs={9}>
                        <ol>
                            <Stack gap={3}>
                                <Row>
                                    <li>
                                         Please Connect to The Polygon TestNetwork - Mumbai. If you are having issues please read the exerpt above ^
                                    </li>
                                </Row>
                                <Row>
                                    <li>
                                        Head over to the Mint tab and mint your own NFT. Upload and create as many as you would like. View them on OpenSea if you like
                                    </li>
                                </Row>
                                <Row>
                                    <li>
                                        Go ahead and check out the profile tab next, there you can change your profile and list your creations on the market.
                                    </li>
                                </Row>
                                <Row>
                                    <li>
                                        Please feel free to view your newly listed NFT on the market, or check out if there is are any assets that you would like to purchase
                                    </li>
                                </Row>


                            </Stack>
                        </ol>

                    </Col>
                    <Col></Col>
                </Row>

            </Stack>



            <div className='footer'>
                <p>&nbsp;</p>
                <hr />
                Thank you for your time
            </div>




        </div >
    );
}

export default Home