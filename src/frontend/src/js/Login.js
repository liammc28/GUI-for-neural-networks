import React, { Component} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import LabelInputText from "./LabelInputText";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import {handleLogin} from "./Utils"
import "../css/LandingPage.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state ={
            incorrectPassword: false,
            verified: true,
            modalToggle: false,
            modal:{
                title:"",
                body:""
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal(){
        this.setState({modalToggle:!this.state.modalToggle})
    }

    handleSubmit(event) {
        let data = {
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        };
        event.preventDefault();
        fetch('http://localhost:5000/session', {
            crossDomain:true,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),

        }).then(function(response) {

            return response.json();

        }).then((data) => {
            let modal ={};
            if(data.incorrectPassword || data.verified===false){
                if(data.incorrectPassword){
                    modal ={
                        title:"Wrong Password",
                        body:"You have entered an incorrect password, " + "\n" +
                            "please enter the correct password"

                    }
                }
                else{
                    modal ={
                        title:"Email Verification",
                        body:"The email address you have entered has not been verified, " + "\n" +
                            "please click on the link send to this email to verify"
                    }
                }
                    this.setState({
                        verified: data.verified,
                        incorrectPassword: data.incorrectPassword,
                        modalToggle:true,
                        modal:modal

                    })
            }
            if(data.success) {
                localStorage.setItem("first_name", data.first_name);
                cookies.set("user_id", data.user_id);
                this.setState({
                    verified: data.verified,
                    incorrectPassword: data.incorrectPassword
                });

                handleLogin();
                this.props.handleDisplay("");
            }
            if(data.UnrecognisedEmail){
                modal ={
                    title:"Email not recognized",
                    body:"The email address you have entered has not been recognized, " + "\n" +
                        "please correctly enter your email or signup"
                };
                this.setState({
                    modalToggle:true,
                    modal:modal

                })
            }
        });
    }


    render()
    {
        const {className} = this.props;
        return(
            <div className={className + ' pb-3'}>


                <form onSubmit={this.handleSubmit}>
                    <LabelInputText placeholder={"email here ..."} type={"email"} name={"email"} id={"email"}
                                    label={"Email"}/>
                    <LabelInputText placeholder={"password here ..."} type={"password"} name={"password"}
                                    id={"password"} label={"Password"}/>
                    <Button className="col-4 offset-4 my-2 py-2" color="primary">Login</Button>
                </form>


                <button className='secondary_button'   onClick={this.props.forgottenPassword}> Forgotten password? </button>
                <Modal isOpen={this.state.modalToggle} backdrop={'static'}  centered={true}  toggle={this.toggle}>
                    <ModalHeader toggle={this.toggleModal}>{this.state.modal.title}</ModalHeader>
                    <ModalBody>
                        {this.state.modal.body}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => this.toggleModal()} color="primary" >Continue</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}
export default Login;
