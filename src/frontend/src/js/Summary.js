import React, { Component} from "react";
import {Col , Row , Toast, ToastBody, ToastHeader} from "reactstrap"
import "../css/Chart.css";
import DesignSummary from "./DesignSummary";

class   Summary extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        const {labels,trainingSpeed, valAcc, testAcc, model_design, dataset} = this.props;
        return (
            <div>
                <Col className='px-0' >
                        <Toast className="p-3 my-2 basic_summary">
                            <ToastHeader>
                                Fastest Training Time
                            </ToastHeader>
                            <ToastBody>
                                <hr className="mb-2 mt-0" />
                                <Row className='mx-0'>
                                   {labels[trainingSpeed.index]}
                                </Row>
                            </ToastBody>
                        </Toast>
                        <Toast className="p-3 my-2 basic_summary">
                            <ToastHeader>
                                Highest Test Accuracy
                            </ToastHeader>
                            <ToastBody>
                                <hr className="mb-2 mt-0" />
                                <Row className='mx-0'>
                                    {labels[testAcc.index]}
                                </Row>
                            </ToastBody>
                        </Toast>
                        <Toast className="p-3 my-2 basic_summary">
                            <ToastHeader>
                                Highest Validation Accuracy
                            </ToastHeader>
                            <ToastBody>
                                <hr className="mb-2 mt-0" />
                                <Row className='mx-0'>
                                    {labels[valAcc.index]}
                                </Row>
                            </ToastBody>
                        </Toast>
                </Col>
                <DesignSummary
                   dataset ={dataset}
                    model_design={model_design}
                />
            </div>
        );
    }
}

export default Summary;
