import { useEffect, useState, useContext } from 'react';
import { Row } from 'react-bootstrap';

import { LevelContext, GameOverContext } from './Contexts';

import APIGenericUser from '../apis/APIGenericUser';
import Match from '../modules/Match';
import Point from '../modules/Point';

import QGrid from './QGrid';
import QTimeout from './QTimout';
import FeedBackWord from '../views/FeedBackWord';


function QGame(props) {

    const level = useContext(LevelContext);
    /* Here it's stored the match. String generates by server and a matrix
    to generate correctly the cell of game */
    const [match, setMatch] = useState({});

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    /* Here we have the current point selected by user */
    const [currentPoint, setCurrentPoint] = useState("");
    const [newPoint, setNewPoint] = useState(false);
    const [spoint, setSPoint] = useState("");
    const [epoint, setEPoint] = useState("");

    /* selectedpoints contains points just selected */
    const [selectedPoints, setSelectedPoints] = useState([]);
    /* waitedToConfirmPoints contains points has been selected but not 
    confimed by server yet  */
    const [waitedToConfirmPoints, setWaitedToConfirmPoints] = useState([]);
    /* This is a list of confirmed points by server */
    const [confirmedPoints, setConfirmedPoints] = useState([]);
    /* This is a list of array of couple of points found, confirmed that 
    they will be sent to server for check the match when it finisches */
    const [wordsToCheck, setWordsToCheck] = useState([]);
    /* Current score */
    const [score, setScore] = useState(0);

    /* Flag for correct visualizzation */
    const [showWord, setShowWord] = useState(false);
    const [checkedWord, setCheckedWord] = useState("");
    const [newValidWord, setNewValidWord] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [nWordsFound, setNWordsFound] = useState(0);
    const [wordsFound, setWordsFound] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [alreadyFound, setAlreadyFound] = useState(false);

    /* Function to reset a game when user need a new one */
    const resetGame = () => {
        setSPoint("");
        setEPoint("");
        setSelectedPoints([]);
        setWaitedToConfirmPoints([]);
        setConfirmedPoints([]);
        setWordsToCheck([]);
        setScore(0);
        setShowWord(false);
        setCheckedWord("");
        setNewValidWord(false);
        setGameOver(false);
        setNWordsFound(0);
        setWordsFound(false);
        setShowResult(false);
        setAlreadyFound(false);
    }

    useEffect(() => {

        setLoaded(true);
        /* Load a new game, asking to server to generate a new string accordin 
        with a level choosen */
        const loadData = async () => {
            try {

                resetGame(); // reset data for new match

                const l = await APIGenericUser.getNewMatch(level);
                const newMatch = Match.createMatch(l.letters, level);
                setMatch(newMatch);

                setLoaded(true);
                setIsLoading(false);
                props.haveLoad();

            } catch (err) {
                throw err;
            }
        }

        if (props.load && !loaded) {
            //setTimeout(() => { loadData() }, 1000); /// Simula ritardo nel server
            loadData();
            setIsLoading(true);
        }
        if (!props.load) {
            setLoaded(false);
        }

    }, [isLoading, loaded, level, props]);

    const addSPoint = (cp) => {
        setSPoint(cp);
        setSelectedPoints(sp => [...sp, cp]);
    }
    const resetSPoint = (cp) => {
        setSelectedPoints(sp => sp.filter(p => p !== cp));
        setSPoint("");
    }
    const addEPoint = (cp) => {
        setEPoint(cp);
        setSelectedPoints(sp => [...sp, cp]);
    }
    const resetEPoint = (cp) => {
        setSelectedPoints(sp => sp.filter(p => p !== cp));
        setEPoint("");
    }
    const addWaiting = (p) => {
        setWaitedToConfirmPoints(w => [...w, p]);
    }


    useEffect(() => {

        function removeAPoint(points, point) {
            var index = points.indexOf(point);
            if (index > -1) {
                points.splice(index, 1);
            }
            return points;
        }
        function removeListOfPoints(points, pointsToRemove) {
            for (const p of pointsToRemove) {
                removeAPoint(points, p);
            }
        }
        /* Check if a word is already found */
        const isAlreadyAdded = (sp, ep) => {
            return new Promise((resolve, reject) => {
                /* Check before adding to list of waitedToConfirmPoints if that point, 
                i.e. the word has been already added in the past. To avoid that user can
                add a word twice */
                if ((waitedToConfirmPoints[0] === sp && waitedToConfirmPoints[1] === ep) ||
                    (waitedToConfirmPoints[1] === sp && waitedToConfirmPoints[0] === ep)) {
                    resolve(true);
                }
                for (let w of wordsToCheck) {
                    if ((w[0] === sp && w[1] === ep))
                        resolve(true);
                }
                resolve(false);
            });
        }

        /* Add in the correct lists a word and set a current score */
        const showWord = (p) => {
            const pointS = waitedToConfirmPoints;

            if (p.validity) {
                setConfirmedPoints((cp) => [...cp, ...p.confirmedPoints]);
                setWordsToCheck((wtc) => { return [...wtc, [...p.points]] })

                setCheckedWord(() => p.word.toUpperCase());
                //setScore((sc) => { return sc + p.score }); // show total score
                setScore(p.score); // show only the score for that found word
                setNewValidWord(true);
                setShowWord(true);
            } else {
                setCheckedWord(() => p.word.toUpperCase());
                setNewValidWord(false);
                setShowWord(true);
            }
            const pointSel = removeListOfPoints(pointS, p.points);

            if (pointSel !== undefined)
                setWaitedToConfirmPoints(() => { return [...pointSel] });
            else
                setWaitedToConfirmPoints([])
        }

        /* Check asking to server whether a word found is valid or not */
        const checkValidityWord = async (sp, ep) => {
            /* Preparing data to send */
            const pointToValidate = [sp, ep];
            const dataToSend = {
                level: level,
                letters: match.letters,
                pointsToCheck: pointToValidate
            }
            try {
                /* Call to server */
                const validPoints = await APIGenericUser.checkValidityWord(dataToSend);
                if (validPoints.letters === match.letters) {
                    //setTimeout(() => { showWord(validPoints); }, 1000); /// Simula ritardo nel server
                    showWord(validPoints);
                }
            } catch (err) {
                throw err;
            }
        }

        /* When point is clikked it selects it depends if is the first point
        or second point selected to verifiy that points are compatible with 
        vertical line, horizontal line or diagonal. It is doing supporting by
        Point class */
        const select = async (cp) => {
            setAlreadyFound(false);
            setShowWord(false);
            if (spoint === "")
                addSPoint(cp);
            else {
                if (spoint === cp)
                    resetSPoint(cp);
                else {
                    if (epoint === "") {
                        addEPoint(cp);
                        if (Point.compatibilityPointByString(spoint, cp)) {

                            if (!(await isAlreadyAdded(spoint, cp))) {
                                addWaiting(cp);
                                addWaiting(spoint);

                                checkValidityWord(spoint, cp);

                            } else
                                setAlreadyFound(true);

                            resetSPoint(spoint);
                            resetEPoint(cp);
                        } else {
                            resetSPoint(spoint);
                            resetEPoint(cp);
                        }
                    }
                }
            }
            setNewPoint(false);
        };

        if (newPoint)
            select(currentPoint);

    }, [currentPoint, spoint, epoint, confirmedPoints.length, selectedPoints.length, waitedToConfirmPoints,
        newPoint, level, match.letters, wordsToCheck.length, wordsToCheck, waitedToConfirmPoints.length])

    const selection = (p) => {
        setCurrentPoint(p);
        setNewPoint(true);
    }

    const timeOver = () => {
        setGameOver(true);
    }

    useEffect(() => {

        const checkMatch = async () => {

            setShowResult(true);

            const showResults = (resp) => {
                setNWordsFound(resp.nWords)
                setScore(resp.score);
                setConfirmedPoints(() => [...resp.confirmedPoints]);
                setWaitedToConfirmPoints([]);
                setWordsFound(true);
            }

            const temporaryVisualization = () => {
                setScore(0);
                setWaitedToConfirmPoints(() => [...confirmedPoints]);
                setConfirmedPoints([]);
            }
            /* Preparing data to send */
            const dataToSendForCheck = {
                letters: match.letters,
                level: level,
                pointsToCheck: [...wordsToCheck]
            };

            try {
                temporaryVisualization();
                /* Call to server */
                const resp = await APIGenericUser.checkMatch(dataToSendForCheck);
                if (resp.letters === match.letters) {
                    //setTimeout(() => { showResults(resp); }, 10000); /// Simula ritardo nel server
                    showResults(resp);
                }

            } catch (err) {
                throw err;
            }
        };

        if (gameOver && !showResult) {
            checkMatch();
        }

    }, [gameOver, showResult, wordsFound, level, match.letters, wordsToCheck, score, confirmedPoints]);

    return (
        <>
            {!isLoading ?
                <>
                    <Row >
                        <QTimeout haveLoad={props.haveLoad} score={score} timeOver={timeOver} wordsFound={wordsFound} nWordsFound={nWordsFound} />
                    </Row>

                    <GameOverContext.Provider value={gameOver}>
                        <Row>
                            <FeedBackWord showWord={showWord} word={checkedWord} newValidWord={newValidWord} alreadyfound={alreadyFound} />
                        </Row>

                        <Row md="auto">
                            <QGrid loading={isLoading}
                                tableGame={match.tableGame} nRow={match.nRow} nCol={match.nCol}
                                selection={selection} sel={selectedPoints} conf={confirmedPoints}
                                wait={waitedToConfirmPoints} />
                        </Row>
                    </GameOverContext.Provider>
                </> :
                <Row md="auto">
                    <QGrid loading={isLoading} nRow={3} nCol={4} />
                </Row>
            }
        </>
    );
}

export default QGame;