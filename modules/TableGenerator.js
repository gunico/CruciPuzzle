"use strict";

/* Class to generate a new letters vector for new match */
class TableGenerator {

    constructor(nletters) {
        this.letters = TableGenerator.genTable(nletters);
    }

    /* Static methods */

    /* Generator seed */
    static seedGenerator() {
        /* Array frequency of English letters rounded */
        const letterRank = [{ l: 'E', f: 12 }, { l: 'T', f: 9 }, { l: 'A', f: 8 },
        { l: 'O', f: 7 }, { l: 'I', f: 7 }, { l: 'N', f: 6 },
        { l: 'S', f: 6 }, { l: 'R', f: 6 }, { l: 'H', f: 6 },
        { l: 'D', f: 4 }, { l: 'L', f: 4 }, { l: 'U', f: 3 },
        { l: 'C', f: 3 }, { l: 'M', f: 2 }, { l: 'F', f: 2 },
        { l: 'Y', f: 2 }, { l: 'W', f: 2 }, { l: 'G', f: 2 },
        { l: 'P', f: 2 }, { l: 'B', f: 1 }, { l: 'V', f: 1 },
        { l: 'K', f: 1 }, { l: 'X', f: 1 }, { l: 'Q', f: 1 },
        { l: 'J', f: 1 }, { l: 'Z', f: 1 }];

        /* Array frequency of English letters without any rounding */
        const letterRankPrecise = [{ l: 'E', f: 1200 }, { l: 'T', f: 670 }, { l: 'A', f: 780 },
        { l: 'O', f: 610 }, { l: 'I', f: 640 }, { l: 'N', f: 720 },
        { l: 'S', f: 500 }, { l: 'R', f: 910 }, { l: 'H', f: 410 },
        { l: 'D', f: 380 }, { l: 'L', f: 530 }, { l: 'U', f: 330 },
        { l: 'C', f: 400 }, { l: 'M', f: 270 }, { l: 'F', f: 140 },
        { l: 'Y', f: 160 }, { l: 'W', f: 93 }, { l: 'G', f: 300 },
        { l: 'P', f: 280 }, { l: 'B', f: 200 }, { l: 'V', f: 100 },
        { l: 'K', f: 250 }, { l: 'X', f: 30 }, { l: 'Q', f: 28 },
        { l: 'J', f: 24 }, { l: 'Z', f: 45 }];

        /* Generate an array of 10000 items accordin with lettersRankPrecise array,
        used as seed to generate letters for new game */
        function generateSeedPrecise() {
            const letters = [];
            let index;

            let i = 0;
            while (i < 10000) {
                index = Math.floor(Math.random() * 26); 
                if (letterRankPrecise[index].f !== 0) {
                    letters.push(letterRankPrecise[index].l);
                    letterRankPrecise[index].f--;
                    i++;
                }
            }
            return letters;
        }
        /* Generate an array of 10000 items accordin with lettersRank array, 
        used as seed to generate letters for new game */
        function generateSeed() {
            const letters = [];
            let index;

            let i = 0;
            while (i < 100) {
                index = Math.floor(Math.random() * 26);
                if (letterRank[index].f !== 0) {
                    letters.push(letterRank[index].l);
                    letterRank[index].f--;
                    i++;
                }
            }
            return letters;
        }

        //return generateSeed();
        return generateSeedPrecise();
    }

    /* Generator of letters for new match */
    static genTable = (nLetters) => {
        const seed = TableGenerator.seedGenerator();
        let letters = [];
        for (let i = 0; i < nLetters; i++) {
            /* 100 when gemereteSeed; 10000 when generetSeedPrecise */
            letters.push(seed[Math.floor(Math.random() * 10000)]) 
        }
        return letters;
    }
}

exports.generationTable = (nletters) => {
    return TableGenerator.genTable(nletters);
}
