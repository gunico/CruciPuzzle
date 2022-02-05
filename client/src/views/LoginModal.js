import { Modal } from 'react-bootstrap';

import FormLogin from '../Components/FormLogin'

function LoginModal(props) {  

    return (
      <Modal show={props.show} onHide={props.onHide}
        
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Login User
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>

        <FormLogin logout={props.logout} login={props.login} errmsg={props.errmsg}/>

        </Modal.Body>
        
      </Modal>
    );
  }

  export default LoginModal;