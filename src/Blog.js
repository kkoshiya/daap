import { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card, ListGroup, Container } from 'react-bootstrap'

const Blog = () => {

    return (
        <div>
            <Container>
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
        </div>
    )

}

export default Blog;