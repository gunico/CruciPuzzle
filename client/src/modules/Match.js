/* Here we will check all matches when finish and words claimed by player */

class Match {

    constructor(letters, level) {
        const BASER = 4;
        const BASEC = 6;
        this.nRow = level * BASER;
        this.nCol = level * BASEC;
        this.level = level;
        this.letters = letters;
        this.tableGame = Match.createTable(letters, this.nRow, this.nCol);
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

    static createMatch(letters, level){
        return new Match(letters, level)
    }

    /* Check if start point and end point are into valid limit of game table */
    static checkValidityPoints(pointsWord) {
        const startP = pointsWord.s;
        const endP = pointsWord.e;
        if ((startP.i < 0 || startP.i > Match.nRow || startP.j < 0 || startP.j > Match.nCol ||
            endP.i < 0 || endP.i > Match.nRow || endP.j < 0 || endP.j > Match.nCol) ||
            (startP.i === endP.i && startP.j === endP.j)) {

            return false;
        } else return true;
    }

    /* Check if word is a valid one into dictionary */
    static checkWord(letters, level, pointsWord) {
        const startP = pointsWord.s;
        const endP = pointsWord.e;
        const game = new Match(letters, level);

        if (!Match.checkValidityPoints(pointsWord))
            return undefined;

        const word = Match.gatherLetters(startP, endP, game);

        return word;
    }

    /* Check if the game is valid and give the right score */
    static checkGame(letters, level, pointWords) {
        const words = [];
        let totalScore = 0;
        let wordsFind = 0;

        for (const p of pointWords)
            words.push(Match.checkWord(letters, level, p));

        for (const w of words) {
            if (w !== undefined) {
                totalScore += w.length;
                wordsFind++;
            }
        }
        return { words: wordsFind, score: totalScore };
    }


}

export default Match;