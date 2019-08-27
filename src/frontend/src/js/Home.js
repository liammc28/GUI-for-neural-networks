import React, { Component} from "react";
import Cookies from "universal-cookie";
import {
    Row,
    Col,
    Button,
    Toast,
    ToastBody,
    ToastHeader,
    Jumbotron
} from 'reactstrap';
import AllAccuracy from "./AllAccuracy";
const cookies = new Cookies();

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:{}
        };
    }

    componentDidMount(){
        this.getDashboard();
    }

    getDashboard(){
            let data = cookies.get("user_id");
            fetch('http://localhost:5000/averages?user_id=' + data, {
                crossDomain: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(function (response) {

                return response.json();

            }).then((data) => {
                this.setState({data: data.averages})
            })
    }
    render(){
        const {name} = this.props;
        const {data} = this.state;
        let percentage = data.averageAccuracy;
        let allAcc = data.allAccuracies;
        if(percentage) percentage = percentage.toFixed(2);
        return (
            <Row className="app">
                <Col lg={6} className=''>
                    <Jumbotron className='mx-5 mt-5 home_summary pb-5'>
                        <h1 className="display-3 text-center">Welcome {name}</h1>
                        <p className="lead px-3 text-center">Welcome to the homepage of GUI for Neural networks. On the right you can see a brief summary of your work so far!</p>
                        </Jumbotron>
                    {allAcc ?
                        <div>
                        {allAcc.length > 0 ?
                            <div className='mx-5 mt-3'>
                                <AllAccuracy
                                    accuracys={allAcc}
                                    averageAccuracys={data.allAveragesAccuracies}
                                />
                            </div>
                            : null}
                        </div>
                        :null}
                </Col>
                <Col lg={6}>
                    <div className='m-5'>
                        <Row>
                            <Col lg={5}>
                                <div className="p-3 my-2 home_summary toast_content">
                                    <Toast>
                                        <ToastHeader className='title_text'>
                                           Number of model designs
                                        </ToastHeader>
                                        <ToastBody className='toast_body'>
                                                <div className='numberCircle colour_1'>{data.numOfDesigns}</div>
                                        </ToastBody>
                                    </Toast>
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div className="p-3 my-2 home_summary toast_content">
                                    <Toast className=''>
                                        <ToastHeader className='title_text'>
                                           Number of trained models
                                        </ToastHeader>
                                        <ToastBody className='toast_body'>
                                                <div className='numberCircle colour_2'>{data.numOfTrain}</div>
                                        </ToastBody>
                                    </Toast>
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div className="p-3 my-2 home_summary toast_content ">
                                    <Toast className=''>
                                        <ToastHeader className='title_text'>
                                            Average Accuracy
                                        </ToastHeader>
                                        <ToastBody className='toast_body'>
                                            <Row className='mx-0'>
                                                <div className='numberCircle colour_3'>{percentage}%</div>
                                            </Row>
                                        </ToastBody>
                                    </Toast>
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div className="p-3 my-2 home_summary toast_content ">
                                    <Toast className=''>
                                        <ToastHeader className='title_text'>
                                            Highest Accuracy
                                        </ToastHeader>
                                        <ToastBody className='toast_body'>
                                            <Row className='mx-0'>
                                                <div className='numberCircle colour_4'>{data.bestAccuracy}%</div>
                                            </Row>
                                        </ToastBody>
                                    </Toast>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Home;
