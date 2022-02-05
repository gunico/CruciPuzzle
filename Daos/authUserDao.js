'use strict';
/* Data Access Object (DAO) module for accessing database for authentication */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

/* Open database */
const db = new sqlite.Database('cruciPuzzle.db', (err) => {
  if (err)
    throw err;
});

/* Get user by email from users table into database and check whether password hash mathes or not */
exports.getPlayer = (username, password) => {  
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [username], (err, row) => {
      if (err)
        reject(err);

      else if (row === undefined)
        resolve(false);

      else {
        const player = { idUser: row.idUser, name: row.name };
        // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.compare(password, row.pwd).then(result => {
          if (result) {
            resolve(player);
          }
          else
            resolve(false);
        });
      }
    });
  });
};

/* Get user by id from user table into database */
exports.getPlayerById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE idUser = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const player = { idUser: row.idUser, name: row.name };
        resolve(player);
      }
    });
  });
};