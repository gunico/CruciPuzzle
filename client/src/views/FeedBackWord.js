import { useContext } from 'react';
import { Row, Container } from 'react-bootstrap';
import { GameOverContext } from '../Components/Contexts';


function FeedBackWord(props) {

    const gameOver = useContext(GameOverContext);

    return (
        <Container>
            <Row>
                {
                    gameOver ? <p><span className="fw-bold"> GAME OVER </span></p> :
                        (props.showWord ? (
                            props.newValidWord ?
                                (<p> <span className="fw-bold">{props.word}</span>
                                    <span style={{ color: 'green' }}> IS A VALID WORD </span> </p>)
                                :
                                (<p><span className="fw-bold">{props.word} </span>
                                    <span style={{ color: 'red' }}> IS NOT A VALID WORD </span></p>)
                        )
                            : (props.alreadyfound ?
                            <p><span style={{ color: 'red' }}> WORD ALREADY FOUND! </span></p>:
                                 
                            <p><span style={{ color: 'white' }}> PLACEHOLDER </span></p>))
                }
            </Row>
        </Container>
    );
}

export default FeedBackWord;