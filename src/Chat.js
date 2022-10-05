import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Form, Button, Card, ListGroup, Container } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Buffer } from 'buffer';
import './css/land.css';

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


const Chat = ({ nftContract }) => {
    const [hasProfile, setHasProfile] = useState(false);
    const [profile, setProfile] = useState({});

    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(true)
    const [imageLink, setImage] = useState('') 
    const [items, setItems] = useState([]);
    const [land, setLand] = useState([]);
    const [nfts, setNfts] = useState([])
    const [approved, setApproval] = useState(false);
    const [account, setAccount] = useState(null);
    const [stakedNft, setStakedNft] = useState({image: null});
    const [posts, setPosts] = useState('');
    const [post, setPost] = useState('');

    //const [landImage, setLandImage] = useState('')

    const loadPosts = async () => {
        let address = await nftContract.signer.getAddress();
        setAddress(address);
        const balance = await nftContract.balanceOf(address);
        setHasProfile(() => balance > 0); //neat trick, remeber this one kyle
        let results = await nftContract.getAllPosts();

        let posts = await Promise.all(results.map(async i => {
            const profileId = await nftContract.profiles(i.author);
            const uri = await nftContract.tokenURI(profileId);
            let response = await fetch(uri);
            const metadataProfile = await response.json();
            let post = {
                id: i.id,
                content: i.hash,
                address: i.author,
                name: metadataProfile.name,
                image: metadataProfile.image
            }
            return post
        }))
        posts = posts.reverse();
        setPosts(posts);
        setLoading(false);
    }

    useEffect(() => {
        if (address.length < 1) {
            loadPosts()
        }
    })


    const uploadPost = async () => {
        if (post.length < 100);
        await (await nftContract.uploadPost(post)).wait
    }


    if (loading) return (
        <div>
            <br />
            <br />
            <div className='text-center'>
                <h3>
                    Still Loading
                </h3>
            </div>
            <h1></h1>
        </div >
    );

    return (
        <div className="container-fluid mt-5">
            {hasProfile ?
                (<div className="row">
                    <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                        <div className="content mx-auto">
                            <Row className="g-4">
                                <div className=''>
                                    <Form.Control onChange={(e) => setPost(e.target.value)} size="lg" required as="textarea" placeholder="Keep it under 100 Chars"/>
                                </div>
                                <div className="d-grid px-0">
                                    <Button onClick={uploadPost} variant="primary" size="lg">
                                        Post!
                                    </Button>
                                </div>
                            </Row>
                        </div>
                    </main>
                </div>)
                :
                (<div className="text-center">
                    <main style={{ padding: "1rem 0" }}>
                        <h2>Must own an NFT to post</h2>
                    </main>
                </div>)
            }

            <p>&nbsp;</p>
            <hr />
            <p className="my-auto">&nbsp;</p>
            {posts.length > 0 ?
                posts.map((post, key) => {
                    return (
                        <div key={key} className="col-lg-12 my-3 mx-auto" style={{ width: '1000px' }}>
                            <Card border="primary">
                                <Card.Header>
                                    <img
                                        className='mr-2'
                                        width='30'
                                        height='30'
                                        src={post.image}
                                    />
                                    <small className="ms-2 me-auto d-inline">
                                        {post.name}
                                    </small>
                                    <small className="mt-1 float-end d-inline">
                                        {post.address}
                                    </small>
                                </Card.Header>
                                <Card.Body color="secondary">
                                    <Card.Title>
                                        {post.content}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </div>)
                })
                : (
                    <div className="text-center">
                        <main style={{ padding: "1rem 0" }}>
                            <h2>No posts yet</h2>
                        </main>
                    </div>
                )}

        </div >
    )
}

export default Chat;