import React, { Component} from "react";
import "../css/LandingPage.css";
import logo from "../../public/logo.png";
import {Row,Col} from "reactstrap";
class Welcome extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div>

                <Row> <Col lg={{size:8, offset:2}}> <img src={logo} alt="Logo" className='big_logo'/></Col></Row>
                <Row className='mx-0 p-3'>
                        <p>Welcome to GUI for NN</p>
                    <p>Graphical User Interface for Neural Networks</p>
                    <p>Here you can learn about NNs</p>
                    <p>Here you can implement NNs without writing any code!</p>
                </Row>
            </div>
        );
    }
}

export default Welcome;
