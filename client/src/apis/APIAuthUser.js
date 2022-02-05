/* Get rank of own history of user */
async function getHistory() {
    try {
        const response = await fetch(`/api/history`);
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

const APIAuthUser = { getHistory };
export default APIAuthUser;