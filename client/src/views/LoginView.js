import { useState } from 'react';

import { IconUser } from '../images/Icons';

import LoginModal from './LoginModal';


function LoginView(props) {
    const [login, setLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const closeModal = () => {
        setShowModal(false);
        setLogin(false);
    }

    const openModal = () => {
        setShowModal(true);
        setLogin(true);
    }

    const stopL = () => {
        setLogin(false);
        props.logout();
    }

    return (
        <>
            {
                props.loggedIn ?
                    <span style={{ cursor: 'pointer' }}
                        onClick={() => stopL()}>
                        {' '}{IconUser}{' Logout'}
                    </span> :                         
                        ( !login ?
                        <span style={{ cursor: 'pointer' }} 
                        onClick={() => openModal()}>
                            {IconUser}{' Login'}
                        </span> :
                        <LoginModal show={showModal} onHide={closeModal}
                            login={props.login}
                            logout={props.logout} errmsg={props.errmsg}
                        />
                    )
            }
        </>
    )
}

export default LoginView;