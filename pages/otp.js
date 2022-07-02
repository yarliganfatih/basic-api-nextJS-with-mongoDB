import React, { Component } from "react";
import auth from "../lib/firebase";
import { Container, Row, Col, Form } from 'react-bootstrap';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default class PhoneLogin extends Component {
    constructor() {
        super();
        console.log(auth)
        this.state = {
            form: true,
                mobile: "5412345678",
                otp: "123456",
            alert: false,
        };
    }

    onChangeHandler = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    setUpRecaptcha = () => {
        console.log(window)
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit();
            }
        }, auth);
    };

    onSignInSubmit = (e) => {
        e.preventDefault();
        this.setUpRecaptcha();
        let phoneNumber = "+90" + this.state.mobile;
        console.log(phoneNumber);
        let appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                // console.log(confirmationResult);
                console.log("OTP is sent");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    onSubmitOtp = (e) => {
        e.preventDefault();
        let otpInput = this.state.otp;
        let optConfirm = window.confirmationResult;
        optConfirm
            .confirm(otpInput)
            .then(function (result) {
                // User signed in successfully.
                let user = result.user;
                console.log(user);
            })
            .catch(function (error) {
                console.log(error);
                alert("Incorrect OTP");
            });
    };

    render() {
        return (
            <div>
                <Container fluid="sm" className="mt-3">
                    <Row className="justify-content-center">
                        <Col xs={12} md={6} lg={5}>
                            <h2 className="mb-3">Login</h2>
                            <Form className="form" onSubmit={this.onSignInSubmit}>
                                <div id="recaptcha-container"></div>
                                <Form.Group>
                                    <Form.Control
                                        type="number"
                                        name="mobile"
                                        placeholder="Mobile Number"
                                        defaultValue={this.state.mobile}
                                        onChange={this.onChangeHandler}
                                        required
                                    />
                                </Form.Group>
                                <button button="Submit" type="submit">Submit</button>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={12} md={6} lg={5}>
                            <h2 className="mb-3">Enter OTP</h2>
                            <Form className="form" onSubmit={this.onSubmitOtp}>
                                <Form.Group>
                                    <Form.Control
                                        id="otp"
                                        type="number"
                                        name="otp"
                                        placeholder="OTP"
                                        defaultValue={this.state.otp}
                                        onChange={this.onChangeHandler}
                                    />
                                </Form.Group>
                                <button button="Submit" type="submit">Submit</button>
                            </Form>
                        </Col>
                    </Row>
                </Container>

            </div>
        );
    }
}