import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Row, Container } from 'react-bootstrap';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router';

import { useState, useEffect } from 'react';
import { LevelContext } from './Components/Contexts';

import QNavBar from './Components/QNavBar';
import APIAuth from './apis/APIAuth';
import PageNotFound from './views/PageNotFound';
import PageWelcome from './views/PageWelcome';
import PageWelcomeUser from './views/PageWelcomeUser';
import QGame from './Components/QGame';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [player, setPlayer] = useState({});
  const [messages, setMessages] = useState({});
  /* Level of current game available by all children thanks useContex */
  const [level, setLevel] = useState(0); 
  const [changingLevel, setChangingLevel] = useState();
  const [showMatch, setShowMatch] = useState(false);
  const [load, setLoad] = useState(false);



  /* Check if user is loggedin into current session */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const ply = await APIAuth.getUserInfo();
        setLoggedIn(true);
        setPlayer(ply);
        setMessages({ welMsg: `Welcome, ${ply.name}`, type: 'success' });
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, [player.idUser]);


  /* Send to the server credentials for login and set user if loggedin */
  const doLogIn = async (credentials) => {
    try {
      const ply = await APIAuth.logIn(credentials);
      setLoggedIn(true);
      setPlayer(ply);
      setMessages({ welMsg: `Welcome, ${ply.nome}`, type: 'success' });
      setShowMatch(false)
    } catch (err) {
      console.log(err)
      /**/setMessages({ errMsg: err, type: 'danger' });//// crash quando server spento
    }
  }

  /* Delete current session */
  const doLogOut = async () => {
    try {
      await APIAuth.logOut();
      setLoggedIn(false);
      setPlayer({});
      setMessages({});
      setShowMatch(false)
    } catch (err) {
      throw err;
    }
  }

  /* Set a level for new game */
  const playGame = () => {
    setLevel(changingLevel);
    setShowMatch(true);
    setLoad(true);
  }
  /* Set when game is loaded */
  const haveLoad = () => {
    setLoad(false)
  }
  /* Stop current game */
  const stopMatch = () => {
    setShowMatch(false);
    setLoad(false)
  }
  
  const changeLevel = (l) => {
    setChangingLevel(l);
  }

  return (
    <>
      <LevelContext.Provider value={level}>
        <Router>
          <Container className="App bg-light">

            <Row>
              <QNavBar loggedIn={loggedIn} message={messages.welMsg} changeLevel={changeLevel}
                logout={doLogOut} playGame={playGame} stopMatch={stopMatch}
                login={doLogIn} errmsg={messages.errMsg ? messages.errMsg : ''}
                name={player.name}
                />
            </Row>

            <Routes>

              <Route path='/' element={
                <> {loggedIn ? <Navigate to={'/users'} /> : <Navigate to={'/home'} />} </>
              } />

              <Route path='/home' element={
                <> {showMatch ? (loggedIn ? <Navigate to={'/users/newMatch'} /> :
                  <Navigate to={'/newMatch'} />) :
                  (loggedIn ? <Navigate to={'/users'} /> :
                    <PageWelcome />)
                }
                </>
              } />

              <Route path='/users' element={
                <> {showMatch ? (loggedIn ? <Navigate to={'/users/newMatch'} /> :
                  <Navigate to={'/newMatch'} />) :
                  (loggedIn ? <PageWelcomeUser name={player.name} /> :
                    <Navigate to={'/home'} />)}
                </>
              } />

              <Route path='/newMatch/*' element={
                <>{showMatch ? <QGame level={level} load={load} haveLoad={haveLoad} /> : <Navigate to={'/'} />}</>} />

              <Route path='/users/newMatch/*' element={
                <>{showMatch ? <QGame level={level} load={load} haveLoad={haveLoad} /> : <Navigate to={'/'} />}</>} />

              <Route path='*' element={<PageNotFound />} />

            </Routes>

          </Container>

        </Router>
      </LevelContext.Provider>
    </>
  );
}

export default App;
