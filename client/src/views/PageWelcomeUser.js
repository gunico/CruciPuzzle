import { Container, Row, Col } from 'react-bootstrap'

import cruci from './../images/Cruci600.png';

function PageWelcomeUser(props) {
    return (

        <Container>
            <Row>
                <h1 className="text-center" >
                    {`Welcome ${props.name} to CruciPuzzle`}
                </h1>
            </Row>
            <Row className="mb-5"></Row>
            <Row>
                <Col>
                    <img src={cruci} width="600" height="400" alt="logo" />
                </Col>
                <Col>
                    <p className="text-start fs-5">
                    {`${props.name} `} pick a level (from 1 to 5) and
                        start your game. You have one minute to find as many words as possible and you can interrupt
                        the game at any time. At the end of one minute, or when you interrupt it, the system will
                        check the correctness of the game and give you the total score.
                        You can make the words by selecting letters in all directions. To select a word,
                        you click on the first letter of the word and then the last letter. When the
                        word has been selected, the system will check if the word exists. If it is correct,
                        it will give you the number of points. Each letter gives you one point and the sum
                        of the letters found will be multiplied by the level you selected. The score will be
                        registered on your personal history, and you can be part of the hall of fame list.
                        Enjoy!
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default PageWelcomeUser;
