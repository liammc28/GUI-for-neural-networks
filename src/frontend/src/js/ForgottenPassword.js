import React, { Component} from "react";
import LabelInputText from "./LabelInputText";
import {Button, Col, Row} from "reactstrap";
import logo from "../../public/logo.png";
class ForgottenPassword extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            text : 1
        });
        //TODO: make endpoint for password reset
        this.props.display();
    }
    render(){
        return (
            <div>
                <Row className='mx-0' ><Col><img src={logo} alt="Logo" className='logo' /> </Col></Row>
                <Row className='mx-0'>
                    <Col lg={{size:10,offset:1}}>
                    Please enter you email address below and we will email you a link to reset your password!
                        <form onSubmit={this.handleSubmit}>
                            <LabelInputText placeholder={"email here"} type={"email"} name={"email"} id={"email"}
                                            label={"Email"}/>
                            <Button className="col-8 offset-2 my-2 py-2" color="primary">Reset Password</Button>
                        </form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ForgottenPassword;