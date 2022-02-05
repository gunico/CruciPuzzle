import { Spinner } from 'react-bootstrap';
import './QCell.css';

import { useContext } from 'react';
import { GameOverContext, LevelContext } from './Contexts';


function QCell(props) {
    const BASENAME = "QCell QCellL";

    const level = useContext(LevelContext);
    const gameOver = useContext(GameOverContext);

    /* Select the correct class for a cell, to color them properly.
       It considers, also to disable the cursor when the game is over.
    */
    const selected = () => {
        let className = "";

        if (!props.loading) {
            if (props.conf.includes(props.id))
                className = " confirmed";

            if (props.wait.includes(props.id))
                className = " waitingToConfirm";

            if (props.sel.includes(props.id))
                className = " selected";
        }

        if (gameOver){
            className = className.replace(" selected", "");
            return <div id={props.id}
                className={BASENAME + level + className + " QCellD"} >
                {!props.letter ? <Spinner animation="border" role="status" /> : props.letter}
            </div>
        }else
        return <div id={props.id}
                className={BASENAME + level + className}
            onClick={(e) => props.selection(e.target.id)} >
                {!props.letter ? <Spinner animation="border" role="status" /> : props.letter}
            </div>
    };

    const colored = selected();

    return (
        <>
            {colored}
        </>

    );
}

export default QCell;