import { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card, ListGroup, Container } from 'react-bootstrap';
import './css/blog.css';
import image from './images/space.png';


const Blog = () => {

    return (
        <div className='blogPage'>
            <div id="header">
                <h1>Welcome to the Blog</h1>
            </div>

            <div className='post'>
                <a href="" className='blog-link'>
                    <Container>
                        <Row>
                            <Col sm={1}></Col>
                            <Col sm={3}>
                                <div>
                                    <img src={image} alt="" className='thumbnail'/>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Row>
                                    <div>
                                        <h2>Title of post</h2>
                                    </div>
                                </Row>
                                <Row>
                                    <div>
                                        <h6>This is the quick little summary of the post, click on this post
                                            if you would like to be redirected to the rest of the post
                                        </h6>
                                    </div>
                                </Row>
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={2}>
                                <h6>
                                    September 15, 2022
                                </h6>
                            </Col>
                        </Row>
                    </Container>
                </a>
            </div>


            <div className='post'>
                <a href="" className='blog-link'>
                    <Container>
                        <Row>
                            <Col sm={1}></Col>
                            <Col sm={3}>
                                <div>
                                    <img src={image} alt="" className='thumbnail'/>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <Row>
                                    <div>
                                        <h2>Title of post</h2>
                                    </div>
                                </Row>
                                <Row>
                                    <div>
                                        <h6>This is the quick little summary of the post, click on this post
                                            if you would like to be redirected to the rest of the post
                                        </h6>
                                    </div>
                                </Row>
                            </Col>
                            <Col sm={1}></Col>
                            <Col sm={2}>
                                <h6>
                                    September 15, 2022
                                </h6>
                            </Col>
                        </Row>
                    </Container>
                </a>
            </div>





            {/* <div>
                <Row>
                    <Col>
                        <div>
                            <a target = "_blank" href="https://ipfs.io/ipfs/QmThCT36VDMHWnzu34UbpNynfbB6ZfTrUfNmrYaco9BzoZ">
                                <img src='' alt="" />
                                <div>
                                    Litterally first blog post is me Resume
                                </div>
                            </a>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className='text-center'>
                <div>
                    <a target = "_blank" href="https://ipfs.io/ipfs/QmThCT36VDMHWnzu34UbpNynfbB6ZfTrUfNmrYaco9BzoZ">Litterally first blog post is me Resume</a>
                </div>
            </div>
            <div className='text-center'>
                <div>
                    <a target = "_blank" href="https://ipfs.io/ipfs/QmYcut8J5DfULMYkLJRdquZjerEhs7VcZfVFPjSoL61WxH">Buying Things: 9/22/22</a>
                </div>
            </div> */}

        </div>
    )

}

export default Blog;