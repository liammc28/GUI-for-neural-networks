import React, { Component} from "react";
import {Col , Row , Toast, ToastBody, ToastHeader} from "reactstrap"
import "../css/Chart.css";

class TrainedSummary extends Component{
    constructor(props) {
        super(props);
    }

    modelSelection(index){
        this.props.model_selection(index);
    }

    render(){
        const { model_infos} = this.props;
        return (
            <Row className='mx-0 my-5 justify-content-center'>
                {model_infos.map((info,index)=>{
                    return (
                            <Col key={index} lg={4}>
                                <div  onClick={()=>this.modelSelection(index)} className="p-3 my-2 summary">
                                    <Toast>
                                        <ToastHeader>
                                            Model: {info.training_name}
                                        </ToastHeader>
                                        <ToastBody>
                                            <Row className='mx-0'>
                                                Validation accuracy: {info.val_acc}
                                            </Row>
                                            <Row className='mx-0'>
                                                Batch size: {info.batchSize}
                                            </Row>
                                            <Row className='mx-0'>
                                                Number of training inputs: {info.sizeOfTrainingInputs}
                                            </Row>
                                            <Row className='mx-0'>
                                                Number of Epochs: {info.trainEpochs}
                                            </Row>
                                            <Row className='mx-0'>
                                                Test accuracy: {info.test_acc}
                                            </Row>
                                            <Row className='mx-0'>
                                                Validation Split: {info.validationSplit}
                                            </Row>
                                        </ToastBody>
                                    </Toast>
                                </div>
                            </Col>
                    )
                })}

            </Row>
        );
    }
}

export default TrainedSummary;
