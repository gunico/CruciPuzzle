
import { useEffect, useState } from 'react';
import { ProgressBar, Col, Row, Button, Table, Container, Spinner } from 'react-bootstrap';


function QTimeout(props) {

    const [timer, setTimer] = useState(100);
    const [stop, setStop] = useState(false);

    /* Set timer it needs for ending game and visualization progress bar */
    useEffect(() => {
        let timeOut;
        if (timer > 0 || !stop)
            timeOut = setTimeout(() => setTimer((timer) => timer - 1), 600); //600

        return () => clearTimeout(timeOut); // Need to clean timeOut and avoid leaks

    }, [timer, stop])

    useEffect(() => {
        /* When time is zero rerender the component */
        if (timer === 0) {
            setStop(true);
            /* Time is over */
            props.timeOver();
            props.haveLoad();
        }

    }, [timer, stop, props]);

    /* Set the same varable when the game is interrupt by user */
    const interrupt = () => {
        setStop(true);
        props.timeOver();
        props.haveLoad();
    }

    return (
        <Container>
            <Row md="auto">
                <Col md={8}>
                    {
                        stop ? (props.wordsFound ? <pre>Game has been checked, you have found {props.nWordsFound} words!</pre> :
                            <> <Spinner animation="border" variant="primary" size="md" />
                                <pre> We are checking results</pre> </>) : (<ProgressBar now={timer} label={`${Math.floor(timer / 100 * 60)} seconds`} />)
                    }
                </Col>

                <Col md={2}>
                    <Table striped bordered hover>
                        {
                            stop ?
                                props.wordsFound ?
                                    <tbody>
                                        <tr>
                                            <td>Total Score</td>
                                            <td>{props.score}</td>

                                        </tr>
                                    </tbody> :
                                    <tbody>
                                        <tr>
                                            <td>Score</td>
                                            <td>{props.score}</td>

                                        </tr>
                                    </tbody> :
                                <tbody>
                                    <tr>
                                        <td>Score</td>
                                        <td>{props.score}</td>

                                    </tr>
                                </tbody>
                        }
                    </Table>
                </Col>

                <Col md={2}>
                    {
                        !stop ?
                            <Button onClick={interrupt}>{ /**Callback for new match */}
                                Interrupt
                            </Button> : <p> </p>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default QTimeout;
