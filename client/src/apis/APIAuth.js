/* API for checking user credentials */
async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {   
    try {
      //if(response.ok){
      const errDetail = await response.json();
      throw errDetail.message;
      //}else throw "server rotto"
    }
    catch (err) {
      throw err;
    }
  }
}

/* API for logout user */
async function logOut() {
  await fetch('/api/sessions/current', {
    method: 'DELETE'
  });
}

/* API to check whether a user is loggedin or no at the current session */
async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const APIAuth = { logIn, logOut, getUserInfo };
export default APIAuth;


