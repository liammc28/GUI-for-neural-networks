import React, { Component} from "react";
import {Row, Col, Button} from "reactstrap"
import "../css/LandingPage.css";
import Cookies from "universal-cookie";
import Login from "./Login"
import Signup from "./Signup";
import LandingPageDisplay from "./LandingPageDisplay";
const cookies = new Cookies();

class LandingPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tab:'login',
            display:'home'
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(str){
        this.setState({tab:str})
    }

    display(display){
        this.setState({display:display});
    }

    render(){
        const disableLogin = this.state.tab==='login';
        const disableSignup= this.state.tab==='signup';
        const loginButton = ()=>{if(this.state.tab==='login'){return 'active_button'}else{return'disabled_button'}};
        const signupButton = ()=>{if(this.state.tab==='signup'){return 'active_button'}else{return'disabled_button'}};
        return (

                <Row className='mx-0 py-5 my-5'>
                    <Col lg={2} className=' pt-5'/>
                    <Col lg={8} className='landing_card'>
                        <Row>
                            <Col lg={6} className='p-0 card_info'>
                                <Row className='m-0 p-0 '>
                                    <LandingPageDisplay updateDisplay={()=>this.display('emailSent')} display={this.state.display}/>
                                </Row>
                            </Col>
                            <Col lg={6} className='p-0 card_content'>
                                <Row className='mt-2'>
                                    <Col lg={2}/>
                                    <button className={loginButton() +" col-lg-3 my-2 py-2"}  disabled={disableLogin} onClick={() => this.toggle('login')} >Login</button>
                                    <Col lg={2}/>
                                    <button className={signupButton() +" col-lg-3 my-2 py-2"} color="primary" disabled={disableSignup} onClick={() => this.toggle('signup')}>Signup</button>
                                    <Col lg={2}/>
                                </Row>
                                <Row>
                                    {this.state.tab==='login'? <Login className='col-8 offset-2' forgottenPassword={()=>this.display('password')} handleDisplay={this.props.updateDisplay}/> :null}
                                    {this.state.tab==='signup'? <Signup  className='col-8 offset-2' termsAndConditions={()=>this.display('terms')}/> :null}
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={2} className=' pt-5'/>
                </Row>
        );
    }
}

export default LandingPage;
