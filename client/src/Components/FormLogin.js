import { Form, Button, Col, Row, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useFormik } from 'formik';


function FormLogin(props) {
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '', 
        }, enableReinitialize: true,
        onSubmit: values => {

            if (!values.username || !values.password) {
                setErrorMessage('Username e/o password needed');
            }
            else {
                const credentials = { username: values.username, password: values.password };
                setErrorMessage('');
               
                props.login(credentials); 
            }
        },
    });

    return (
        <Container className="fluid">
            <Row className="mb-5">
                <Col xs={12}></Col>
            </Row>
            <Row className="mt-5">
                <Col xs={2}></Col>
                <Col xs={8}>
                    <Form onSubmit={formik.handleSubmit}>
                        {(errorMessage || props.errmsg) ?
                            <Alert variant="danger">{errorMessage ? errorMessage : props.errmsg}</Alert> : ""}
                        <Form.Group controlId="username">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"
                                value={formik.values.username}
                                onChange={formik.handleChange} />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange} />
                        </Form.Group>
                        <Row className="mt-4"></Row>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
                <Col xs={2}></Col>
            </Row>
        </Container>
    );
}

export default FormLogin;
