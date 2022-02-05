'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const dao = require('./Daos/dao');
const userDao = require('./Daos/userDao');
const authUserDao = require('./Daos/authUserDao');

const { generationTable } = require('./modules/TableGenerator');

const CheckMatch = require('./modules/CheckMatch');

/* Minimum number of letters need */
const MINLETTERS = 24;


/*** Set up Passport ***/

/* set up the "username and password" login strategy
   by setting a function to verify username and password */
passport.use(new LocalStrategy(
    function (username, password, done) {
        authUserDao.getPlayer(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));

/* serialize and de-serialize the user (user object <-> session)
 we serialize the user id and we store it in the session: the session is very small in this way */
passport.serializeUser((user, done) => {
    done(null, user.idUser);
});

/* starting from the data in the session, we extract the current (logged-in) user */
passport.deserializeUser((id, done) => {
    authUserDao.getPlayerById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

/* init express */
const app = new express();
const path = require('path');
const port = process.env.PORT || 3001;

/**  Set-up the middlewares **/
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("./client/build"));

/* set up the session */
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence for the webapp, not to share with anybody and anywhere, used to sign the session ID cookie, write what you want for example YNXRciWEAtFUG JvUztIPdpzWyGgfEdHWjwlFtLoBfHaAsYlMQ GqwNkGXgQzFzNJldllkG pjaBKOyCmEXaZklVd',
    resave: false,
    saveUninitialized: false
}));

/* init passport */
app.use(passport.initialize());
app.use(passport.session());



/*** Start authUsers APIs ***/


/* Login. POST /sessions */
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            /* display wrong login messages */
            return res.status(401).json(info);
        }
        /* success, perform the login */
        req.login(user, (err) => {
            if (err)
                return next(err);
            /* req.user contains the authenticated user, we send all the user info back
               this is coming from userDao.getUser() */
            return res.json(req.user);
        });
    })(req, res, next);
});

/* Logout. DELETE /sessions/current */
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

/* Check whether the user is logged in or not. GET /sessions/current */
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });
});


/*** Stop authUsers APIs ***/



/*** Start APIs unAuthUser ***/


/* Gets rank of first 5 matches */
app.get('/api/hallOffame', (req, res) => {
    dao.getHallOfFame()
        .then((hf) => res.status(200).json(hf))
        .catch(() => res.status(500).end());
});


/*** Stop APIs unAuthUser ***/



/*** Start APIs for both AuthUser and unAuthUser ***/

/* Function to check validity of a single word  */
function checkValidityThisWord(letters, level, pointsToCheck) {
    return new Promise(async (resolve, reject) => {
        let validity;

        const pointsAndWord = CheckMatch.checkValidityWord(letters, level, pointsToCheck);

        if (pointsAndWord === undefined) {
            validity = {
                validity: false,
                word: "",
                points: pointsToCheck,
                score: 0
            };
        }

        const word = pointsAndWord.w.toLowerCase();
        const coordinates = pointsAndWord.p;
        const score = word.length;

        try {
            const isValid = await dao.getValidityWord(word);

            if (isValid)
                validity = {
                    validity: isValid,
                    letters: letters,
                    level: level,
                    word: word,
                    points: pointsToCheck,
                    confirmedPoints: coordinates,
                    score: score * level
                };
            else
                validity = {
                    validity: isValid,
                    letters: letters,
                    level: level,
                    word: word,
                    points: pointsToCheck,
                    score: 0
                };

            resolve(validity);
        } catch (err) {
            reject(err);
        }
    });
}

/* Check validity of data sent by user before verify a word */
const checkValidityWord = [check('level').isInt({ min: 1, max: 5 }),
check('level').custom((value, { req }) => {
    if (req.body.letters.length === ((value ** 2) * MINLETTERS))
        return true;
    else return false;
}),
check('pointsToCheck').custom((value) => {
    if (value.length !== 2)
        return false;
    else
        return true;
})
];

/* Verifiy a word on dictionary and send back validity, word, score */
app.post('/api/match/verifyWord', checkValidityWord, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const letters = req.body.letters;
    const level = req.body.level;
    const pointsToCheck = req.body.pointsToCheck;

    try {
        const validity = await checkValidityThisWord(letters, level, pointsToCheck);
        res.status(200).json(validity);
    } catch (err) {
        res.status(500).end();
    }
});

/* Function to check validity of all single words of match */
function checkValidityThisMatch(letters, level, pointsToCheck) {
    return new Promise(async (resolve, reject) => {
        let confirmedPoints = [];

        try {
            let score = 0;
            let nWords = 0;
            for (let ptc of pointsToCheck) {
                const validity = await checkValidityThisWord(letters, level, ptc);
                if (validity.validity) {
                    confirmedPoints = [...confirmedPoints, ...validity.confirmedPoints];
                    score = score + validity.score;
                    nWords++;
                }
            }
            const resp = {
                letters: letters,
                level: level,
                score: score,
                confirmedPoints: confirmedPoints,
                nWords: nWords
            };
            resolve(resp);

        } catch (err) {
            reject(err);
        }

    });
};

/* Check validity of data sent by user before verify a match */
const checkValidityMatch = [check('level').isInt({ min: 1, max: 5 }),
check('level').custom((value, { req }) => {
    if (req.body.letters.length === ((value ** 2) * MINLETTERS))
        return true;
    else return false;
}),
check('pointsToCheck').custom((value) => {
    for (const p of value) {
        if (p.length !== 2)
            return false;
    }
    return true;
})
];

/* Verifiy a match checking on dictionary and send back validity, word, score */
app.post('/api/match/verifyMatch', checkValidityMatch, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const letters = req.body.letters;
    const level = req.body.level;
    const pointsToCheck = req.body.pointsToCheck;

    /* For authenticated users it is checked if string and level of game that 
    is asked verification is the same of that stored in db, providing to save
    score in personal history of user, otherwise is sent an error */
    if (req.isAuthenticated()) {
        try {
            const valuesOnDB = await userDao.getMatchPlayed(req.user.idUser);

            if (valuesOnDB.letters === letters && valuesOnDB.level == level) {
                const resp = await checkValidityThisMatch(letters, level, pointsToCheck);

                await userDao.saveOnHistory(req.user.idUser, level, resp.nWords, resp.score);
                await userDao.deleteMatchPlayed(req.user.idUser);
                res.status(200).json(resp);
            } else {
                res.status(401).json({ error: "You want valuate a not regularly match!" });
            }
        } catch (err) {
            res.status(500).end();
        }
    }

    else {
        try {
            const resp = await checkValidityThisMatch(letters, level, pointsToCheck);
            res.status(200).json(resp);
        } catch (err) {
            res.status(500).end();
        }
    }
});

/* Gets a new string of letters to start a new match */
app.get('/api/newMatch/', [check('level').isInt({ min: 1, max: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            const level = req.query.level;
            const nLetters = (level ** 2) * MINLETTERS;
            const tableGame = generationTable(nLetters);

            const stringMatch = tableGame.toString().replace(/,/g, '');
            const dataToSend = { letters: stringMatch }

            /* For authenticated user sava in db temporarly level and string
            to verify the correctness of game when it will be asked */
            if (req.isAuthenticated()) {
                try {
                    await userDao.deleteMatchPlayed(req.user.idUser);
                    await userDao.inplayingNewMatch(req.user.idUser, level, stringMatch);
                } catch (err) {
                    res.status(500).end();
                }
            }
            res.status(200).json(dataToSend);
        }
    });


/*** Stop APIs for both AuthUser and unAuthUser ***/



/*** Start APIs for AuthUser ***/


/* Gets rank of user's history  */
app.get('/api/history', (req, res) => {
    if (req.isAuthenticated()) {
        userDao.getHistory(req.user.idUser)
            .then((h) => res.status(200).json(h))
            .catch(() => res.status(500).end());
    } else
        res.status(401).json({ error: 'Unauthenticated user!' });
});


/*** Stop APIs for AuthUser ***/


/* activate the server */
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
