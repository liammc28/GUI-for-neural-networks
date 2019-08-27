import React, { Component} from "react";
import {Button} from 'reactstrap';
import LabelInputText from "./LabelInputText";
import Cookies from 'universal-cookie';
import "../css/App.css"
const cookies = new Cookies();

class Verify extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event)
    {
        let data = {
            "password": document.getElementById('password').value,
            "user_id": this.props.match.params.id
        };
        event.preventDefault();
        fetch('http://localhost:5000/user', {
            crossDomain:true,
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)

        }).then(function(response) {

            return response.json();

        }).then((data) => {
            console.log(this.props.match.params.id);
            if(data.successfulVerification){
                localStorage.setItem("loggedIn", JSON.stringify(true));
                console.log(this.props.match.params.id);
                cookies.set("user_id", this.props.match.params.id);
                this.props.handler('newUserDetails');
                this.props.history.push('/');
            }
        })

    }

    render()
    {
        return (
            <div className="border-dark border col-4 offset-4 card_background">
                <form onSubmit={this.handleSubmit}>
                    <LabelInputText placeholder={"password here ..."} type={"password"} name={"password"}
                                    id={"password"} label={"Password"}/>
                    <Button className="offset-3 col-6 my-2 py-2" color="primary">Continue</Button>
                </form>

            </div>
        );
    }
}
export default Verify;
