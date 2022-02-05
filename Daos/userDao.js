'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

/* Open database */
const db = new sqlite.Database('cruciPuzzle.db', (err) => {
  if (err)
    throw err;
});

/* Memorize id, level and letters temporarly for checking users who want to cheat */
exports.inplayingNewMatch = (idPlayer, level, letters) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO inGame (idPlayer, level, string) VALUES(?, ?, ?);';
    db.run(sql, [idPlayer, level, letters], (err) => {
      if (err)
        reject(err);
      else
        resolve();
    });
  });
};

/* Delete match that has memorazed for checking users who want to cheat */
exports.deleteMatchPlayed = (idPlayer) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM inGame WHERE idPlayer = ?;';
    db.run(sql, [idPlayer], (err) => {
      if (err)
        reject(err);
      else
        resolve(null);
    });
  });
};

/* Get string and level to check from inGame */
exports.getMatchPlayed = (idPlayer) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM inGame WHERE idPlayer = ?;';
    db.get(sql, [idPlayer], (err, row) => {
      if (err)
        reject(err);
      else {
        const matchStored = { idPlayer: row.idPlayer, level: row.level, letters: row.string };
        resolve(matchStored);
      }

    });
  });
};

/* Insert match in history's user */
exports.saveOnHistory = (idPlayer, level, foundWords, score) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO played (idPlayer, level, foundWords, score) VALUES(?, ?, ?, ?);';
    db.run(sql, [idPlayer, level, foundWords, score], (err) => {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });

  });
}

/* Gets history of user */
exports.getHistory = (idUser) => {
  return new Promise((resolve, reject) => {

    const sql = `SELECT pos, foundWords, level, score
                  FROM (SELECT *,
                        rank() OVER ( ORDER BY score DESC) as pos
                        FROM played
                        WHERE idPlayer == ?) as T	
                  ORDER BY score DESC;`;

    db.all(sql, [idUser], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const listHistory = rows.map(r => (
        {
          pos: r.pos,
          nWords: r.foundWords,
          level: r.level,
          score: r.score
        }
      )); 
      resolve(listHistory);
    })
  });
}