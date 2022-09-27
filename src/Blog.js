import { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card, ListGroup, Container } from 'react-bootstrap'

const Blog = () => {

    return (
        <div>
            <Container>
                <br />
                <br />
                <Row className="justify-content-md-center">
                    <Col xs={4}></Col>
                    <Col xs={6}>
                        <h1>
                            Welcome to the Blog
                        </h1>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </Container>

            <div className='text-center'>
                <div>
                    <a target = "_blank" href="https://ipfs.io/ipfs/QmThCT36VDMHWnzu34UbpNynfbB6ZfTrUfNmrYaco9BzoZ">Litterally first blog post is me Resume</a>
                </div>
            </div>
            <div className='text-center'>
                <div>
                    <a target = "_blank" href="https://ipfs.io/ipfs/QmYcut8J5DfULMYkLJRdquZjerEhs7VcZfVFPjSoL61WxH">Buying Things: 9/22/22</a>
                </div>
            </div>

        </div>
    )

}

export default Blog;