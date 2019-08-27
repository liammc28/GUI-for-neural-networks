import React, { Component} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import LabelInputText from "./LabelInputText";
import "../css/LandingPage.css";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state ={
            success: false,
            modalToggle: false,
            modal:{
                title:"",
                body:""
            }
        };
        this.handleSubmitSignup = this.handleSubmitSignup.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(){
        this.setState({modalToggle:!this.state.modalToggle})
    }
    handleSubmitSignup(event)
    {
        let data = {
            "email": document.getElementById('signup_email').value,
            "password": document.getElementById('signup_password').value
        };
        event.preventDefault();
        fetch('http://localhost:5000/user', {
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
                if(data.success){
                    modal ={
                        title:"Congrats You have offically registered!",
                        body:"To access the application you must follow the" + "\n" +
                            "link send to the email address you provided."  + "\n" +
                            "Please close this tab."

                    }
                }
                else{
                    modal ={
                        title:"This email address is already used",
                        body:"Unfornutately this email address is already registered to a user." + "\n" +
                            "Please try again."
                    }
                }
                this.setState({
                    modalToggle:true,
                    modal:modal,
                    success: data.success

                });
        });


    }

    render()
    {
        const {className} = this.props;
        return(
            <div  className={className + ' pb-3'}>
                <form onSubmit={this.handleSubmitSignup}>
                    <LabelInputText placeholder={"email here..."} type={"email"} name={"signup_email"} id={"signup_email"}
                                    label={"Email"}/>
                    <LabelInputText placeholder={"password here ..."} type={"password"} name={"signup_password"}
                                    id={"signup_password"} label={"Password"}/>
                    <Button className="col-4 offset-4 my-2 py-2" color="primary">Signup</Button>
                </form>
                <button className='secondary_button'   onClick={this.props.termsAndConditions}> Terms and Condtions </button>

                <Modal isOpen={this.state.modalToggle} backdrop={'static'}  centered={true}>
                    <ModalHeader >{this.state.modal.title}</ModalHeader>
                    <ModalBody>
                        {this.state.modal.body}
                    </ModalBody>
                    {this.state.success ? null :
                        <ModalFooter>
                            <Button onClick={() => this.toggleModal()} color="primary">Continue</Button>
                        </ModalFooter>
                    }
                </Modal>
            </div>
        );
    }
}
export default Signup;
