import React, { Component} from "react";
import {Row, Col} from 'reactstrap';
import "../css/Sidebar.css"

import logo from "../../public/logo.png"

class Loading extends Component{
    constructor(props) {
        super(props);

    }

    render(){
        return (

                <Row className='rotating_icon'>
                    <Col lg={3}/>
                    <Col className='rotate'>
                        <img className={'anti_rotate'} src={logo} alt="Logo" />
                    </Col>
                    <Col lg={3}/>
                </Row>
        )

    }
}

export default Loading;
