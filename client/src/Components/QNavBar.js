import { Navbar, Container, Row, Form, Col, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { IconHome } from './../images/Icons';
import './QNavBar.css';

import HallFame from '../views/HallFame';
import LoginView from './../views/LoginView';
import History from './../views/History'
function QNavBar(props) {

    const [level, setLevel] = useState(1);

    useEffect(() => {
        props.changeLevel(level);
    }, [level, props]);

    return (
        <Container>
            <Row className={"mb-5"}>

                <Navbar variant="light" bg="light">
                    <Col>
                        <Navbar.Brand>
                            <Link className={"decoration"} to={{ pathname: "/" }}
                                onClick={() => { props.stopMatch() }}>
                                {IconHome} CruciPuzzle
                            </Link>
                        </Navbar.Brand>
                    </Col>

                    <Navbar.Toggle />
                    <Col>
                        <Navbar.Text>
                            <HallFame />
                        </Navbar.Text>

                    </Col>

                    <Navbar.Toggle />
                    <Col>

                        <Navbar.Text>
                            { props.loggedIn ? <History name={props.name}/> : " " }
                        </Navbar.Text>
                    </Col>

                    <Col>
                        <Navbar.Text>
                            {"Choose level"}
                        </Navbar.Text>
                    </Col>

                    <Col>
                        <Navbar.Toggle />
                        <Form.Select aria-label="Level game"
                            onChange={e => setLevel(e.target.value)}>
                            {
                                Array.from({ length: 6 }).map((_, l) => {
                                    //if (l !== 0)
                                    return <option key={l}>{l}</option>;
                                }).slice(1)
                            }
                        </Form.Select>
                    </Col>

                    <Col>
                        <Button variant="primary" onClick={() => props.playGame()}>
                            Play
                        </Button>
                    </Col>

                    <Navbar.Collapse className="justify-content-end">
                        <Col>      <Navbar.Text>
                            {props.loggedIn ? `${props.message} ` : " "}
                        </Navbar.Text>
                        </Col>

                        <Col>
                            <Navbar.Text>
                                <LoginView loggedIn={props.loggedIn} login={props.login}
                                    logout={props.logout} errmsg={props.errmsg} />
                            </Navbar.Text>
                        </Col>
                    </Navbar.Collapse>
                </Navbar>
            </Row>
        </Container >
    );
}

export default QNavBar;
