import React, { Component} from "react";
import "../css/LandingPage.css";
import Terms from "./Terms.js"
import ForgottenPassword from "./ForgottenPassword"
import Welcome from "./Welcome";
class LandingPageDisplay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        };
        this.updateDisplay = this.updateDisplay.bind(this);
    }

    updateDisplay(str){
        this.props.updateDisplay(str);
    }

    render(){
        return (

            <div className='text-white'>
                {this.props.display==='terms'?
                    <Terms/>
                    :null}
                {this.props.display==='password'?
                    <ForgottenPassword display={this.updateDisplay}/>
                :null}
                {this.props.display==='emailSent'?
                    <div>
                        An email has been sent your email address.
                        Please click the link supplied in the email to reset your password.
                    </div>
                    :null}
                {this.props.display==='home'?
                    <Welcome/>
                    :null}
            </div>
        );
    }
}

export default LandingPageDisplay;