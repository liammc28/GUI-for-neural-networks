import React, { Component} from "react";
import {Button, Col, Row} from 'reactstrap';
import LabelInputText from "./LabelInputText";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class NewUser extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event)
    {
        let data = {
            "first_name": document.getElementById('first_name').value,
            "surname": document.getElementById('surname').value,
            "user_id": cookies.get('user_id')
        };
        event.preventDefault();
        fetch('http://localhost:5000/details', {
            crossDomain:true,
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)

        }).then(function(response) {

            return response.json();

        }).then((data) => {
            localStorage.setItem("loggedIn", JSON.stringify(true));
            localStorage.setItem("first_name", document.getElementById('first_name').value);
            this.props.handler('');
        })

    }

    render()
    {
        return (
            <Col lg={12}>
                <Row className='mt-5'>
                    <Col className="border-dark border col-4 offset-4 card_background">
                        <form onSubmit={this.handleSubmit}>
                            <LabelInputText placeholder={"first name"} type={"text"} name={"first_name"}
                                            id={"first_name"} label={"First name"}/>
                            <LabelInputText placeholder={"surname"} type={"text"} name={"surname"}
                                            id={"surname"} label={"Surname"}/>
                            <Button className="offset-3 col-6 my-2 py-2" color="primary">Continue</Button>
                        </form>

                    </Col>
                </Row>
            </Col>
        );
    }
}
export default NewUser;
