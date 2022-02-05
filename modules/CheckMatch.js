"use strict";

const Points = require('./Point');

/* Here we will check all matches when finish and words claimed by player */

class CheckMatch {

    constructor(letters, level) {
        const BASER = 4;
        const BASEC = 6;
        this.nRow = level * BASER;
        this.nCol = level * BASEC;
        this.level = level;
        this.tableGame = CheckMatch.createTable(letters, this.nRow, this.nCol);
    }

    /** Static methods **/

    static createTable(letters, nRow, nCol) {
        const table = [];
        let row = [];
        const lettersV = letters.split('');
        let index = 0;

        for (let i = 0; i < nRow; i++) {
            for (let j = 0; j < nCol; j++)
                row.push(lettersV[index++]);
            table.push(row);
            row = [];
        }
        return table;
    }

    /* Check if start point and end point are into valid limit of game table */
    static checkValidityPoints(pointsWord) {
        const startP = pointsWord.s;
        const endP = pointsWord.e;
        
        if ((startP.i < 0 || startP.i > CheckMatch.nRow || 
            startP.j < 0 || startP.j > CheckMatch.nCol ||
            endP.i < 0 || endP.i > CheckMatch.nRow || 
            endP.j < 0 || endP.j > CheckMatch.nCol) ||
            (startP.i === endP.i && startP.j === endP.j)) {
            return false;
        } else return true;
    }

    static transformInPoint(points){
        const [startP, endP] = points;
        const start = Points.createPointById(startP);
        const end = Points.createPointById(endP);
        const pointsWord = {s: start, e: end};
        return pointsWord;
    }

    static checkValidityWord(letters, level, points){
        const pointsWord = CheckMatch.transformInPoint(points)
        return CheckMatch.checkWord(letters, level, pointsWord);
    }

    /* Check if word is a valid one into dictionary */
    static checkWord(letters, level, pointsWord) {
        const startP = pointsWord.s;
        const endP = pointsWord.e;
        const game = new CheckMatch(letters, level);

        const sw = game.tableGame[startP.i][startP.j] // lettera iniziale
        const ew = game.tableGame[endP.i][endP.j] // lettera finale

        if (!CheckMatch.checkValidityPoints(pointsWord))
            return undefined;

        const lp = CheckMatch.gatherLettersAndPoints(startP, endP, game);

        return lp;
    }

    /* Starting start point gathers all letters untill end point to form a word */
    static gatherLettersAndPoints(startP, endP, game) {

        let wordPoints = {};

        /* If start point is equal end point return "" */
        if (startP.i === endP.i && startP.j === endP.j){
            return undefined;}

        /* Word by coloum */
        if (startP.j === endP.j)
            wordPoints = CheckMatch.gatherVertical(startP, endP, game);

        /* Word by row */
        if (startP.i === endP.i)
            wordPoints = CheckMatch.gatherHorizontal(startP, endP, game);

        /* Word by diagonal */
        if (startP.i !== endP.i && startP.j !== endP.j &&
            (Math.abs(startP.i-endP.i) === Math.abs(startP.j-endP.j)))
            wordPoints = CheckMatch.gatherDiagonal(startP, endP, game);

        return wordPoints;
    }

    /* Starting start point gathers all vertical letters untill end point to form a word */
    static gatherVertical(startP, endP, game) {
        let word = "";
        let points = [];
        if (startP.i < endP.i) {
            for (let i = startP.i; i <= endP.i; i++){
                word = word + game.tableGame[i][startP.j];
                points.push(`${i},${startP.j}`);
            }
        }
        if (startP.i > endP.i) {
            for (let i = startP.i; i >= endP.i; i--){
                word = word + game.tableGame[i][startP.j];
                points.push(`${i},${startP.j}`);
            }
        }
        return {w: word, p: points};
    }

    /* Starting start point gathers all horizontal letters untill end point to form a word */
    static gatherHorizontal(startP, endP, game) {
        let word = "";
        let points = [];
        if (startP.j < endP.j) {
            for (let j = startP.j; j <= endP.j; j++){
                word = word + game.tableGame[startP.i][j];
                points.push(`${startP.i},${j}`);
            }
        }
        if (startP.j > endP.j) {
            for (let j = startP.j; j >= endP.j; j--){
                word = word + game.tableGame[startP.i][j];
                points.push(`${startP.i},${j}`);
            }
        }
        return {w: word, p: points};
    }

    /* Starting start point gathers all diagonal letters untill end point to form a word */
    static gatherDiagonal(startP, endP, game) {

        let word = "";
        let points = [];
        let startPoint;
        if ((endP.i - startP.i) > 0 && (endP.j - startP.j) > 0) {
            startPoint = startP.i;
            for (let j = startP.j; j <= endP.j; j++){ //basso dx 1)
                word = word + game.tableGame[startPoint][j];
                points.push(`${startPoint++},${j}`);
            }
        }
        if ((endP.i - startP.i) > 0 && (endP.j - startP.j) < 0) {
            startPoint = startP.i;
            for (let j = startP.j; j >= endP.j; j--){ //basso sx 4)
                word = word + game.tableGame[startPoint][j];
                points.push(`${startPoint++},${j}`);
            }
        }
        if ((endP.i - startP.i) < 0 && (endP.j - startP.j) < 0) {
            startPoint = startP.i;
            for (let j = startP.j; j >= endP.j; j--){ //alto sx 2)
                word = word + game.tableGame[startPoint][j];
                points.push(`${startPoint--},${j}`);
            }
        }
        if ((endP.i - startP.i) < 0 && (endP.j - startP.j) > 0) {
            startPoint = startP.i;
            for (let j = startP.j; j <= endP.j; j++){ //alto dx 3)
                word = word + game.tableGame[startPoint][j];
                points.push(`${startPoint--},${j}`);
            }
        }
        return {w: word, p: points};
    }

    /* Check if the game is valid and give the right score */
    static checkGame(letters, level, pointWords) {
        const words = [];
        let totalScore = 0;
        let wordsFind = 0;

        for (const p of pointWords)
            words.push(CheckMatch.checkWord(letters, level, p));

        for (const w of words) {
            if (w !== undefined) {
                totalScore += w.length;
                wordsFind++;
            }
        }
        return { words: wordsFind, score: totalScore };
    }

}

module.exports = CheckMatch ;