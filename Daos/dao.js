"use strict";
/* Data Access Object (DAO) module for accessing database */

const sqlite = require('sqlite3');

/* Open database */
const db = new sqlite.Database('cruciPuzzle.db', (err) => {
  if (err)
    throw err;
});

/* Gets list of best 5 games */
exports.getHallOfFame = () => {
    return new Promise((resolve, reject) => {

        const sql1 = `SELECT name, score                          
                     FROM users, played
                     WHERE idPlayer==idUser
                     ORDER BY score DESC
                     LIMIT 5;`;

        const sql = `SELECT pos, name, score
                     FROM (SELECT *,
                            dense_rank() OVER ( ORDER BY score DESC) as pos
                            FROM users, played
                            WHERE idPlayer==idUser) as T	
                     ORDER BY score DESC
                     LIMIT 5;`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const listHallFame = rows.map(r => (
                {
                    pos: r.pos,
                    name: r.name,
                    score: r.score
                }
            ));
            resolve(listHallFame);
        })
    });
}

/* Verify word */
exports.getValidityWord = (word) => {
    return new Promise((resolve, reject) => {

        const sql = `SELECT count(*) count FROM dictionary WHERE word == ? ;`;

        db.get(sql, [word], (err, row) => {
            if (err) {
                reject(err);
            }  
            if (row.count){ 
                resolve(true);
            }
            else
                resolve(false);
        });

    });
};