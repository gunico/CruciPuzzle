/* Get a new game from db, it will depend by level you pass*/
async function getNewMatch(level) {
    try {
        const response = await fetch(`/api/newMatch/?level=${level}`);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let type = response.headers.get('Content-Type');
        if (type.split(' ')[0] !== 'application/json;') {
            throw new TypeError(`Expected JSON, got ${type}`);
        }
        const match = await response.json();
        return match;
    } catch (err) {
        console.log(err);
    }
}

/* Get rank of hall of fame */
async function getHallOfFame() {
    try {
        const response = await fetch(`/api/hallOfFame`);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let type = response.headers.get('Content-Type');
        if (type.split(' ')[0] !== 'application/json;') {
            throw new TypeError(`Expected JSON, got ${type}`);
        }
        const hof = await response.json(); 
        return hof;
    } catch (err) {
        console.log(err);
    }
}

/* It checks if two points are of a valid word and return that word */
async function checkValidityWord(data) {
    try {
        const response = await fetch(`/api/match/verifyWord`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let type = response.headers.get('Content-Type');
        if (type.split(' ')[0] !== 'application/json;') {
            throw new TypeError(`Expected JSON, got ${type}`);
        }
        const validity = await response.json();
        return validity;

    } catch (err) {
       console.log(err);
    }
}

/* Check whether a match is valid or not */
async function checkMatch(data) {
    try {
        const response = await fetch(`/api/match/verifyMatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        let type = response.headers.get('Content-Type');
        if (type.split(' ')[0] !== 'application/json;') {
            throw new TypeError(`Expected JSON, got ${type}`);
        }
        const results = await response.json();
        return results;

    } catch (err) {
        console.log(err)
    }
}

const APIGenericUser = { getNewMatch, getHallOfFame, checkValidityWord, checkMatch };
export default APIGenericUser;