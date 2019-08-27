import React, { Component} from "react";
import {Col , Row , Toast, ToastBody, ToastHeader} from "reactstrap"
import "../css/Chart.css";

class DesignSummary extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const { model_design, dataset} = this.props;
        return (
            <Row className='mx-0 my-0'>
                <div className="p-3 my-2 design_summary">
                    <Toast>
                        <ToastHeader>
                            Design Summary
                        </ToastHeader>
                        <ToastBody>
                            {model_design.map((layer,index)=>{
                                if(index===0){
                                    if(layer.type==='Convolutional'){
                                        return(
                                            <div key={index} >
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer ' + (index + 1) + ': Convolutional, with input shape of ['
                                                + layer.layerConfig.inputShape[0] +',' +
                                                + layer.layerConfig.inputShape[1] +',' +
                                                + layer.layerConfig.inputShape[2] +']' }
                                            </Row>
                                    </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index}  >
                                                <hr className="mb-2 mt-0" />
                                                {dataset === 'color' ?
                                                    <div>
                                                        <Row key={index} className='mx-0'>
                                                            {'Layer ' + (index + 1) + ': Dense, with ' +
                                                            layer.layerConfig.inputShape[0] + ' input nodes,'}
                                                        </Row>
                                                        <Row key={index} className='mx-0'>
                                                            {'followed by a dense layer with ' + layer.layerConfig.units + ' nodes'}
                                                        </Row>
                                                    </div>
                                                    :
                                                    <Row key={index} className='mx-0'>
                                                        {'Layer ' + (index + 1) + ': Dense, with ' +
                                                        (layer.layerConfig.inputShape[0] *
                                                            layer.layerConfig.inputShape[1] *
                                                            layer.layerConfig.inputShape[2]) + ' input nodes'}
                                                    </Row>
                                                }
                                    </div>
                                        )
                                    }

                                }
                                else {
                                    if (layer.type === 'Dense') {
                                        return (
                                            <div key={index}  >
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer ' + (index + 1) + ': Dense, with ' + layer.layerConfig.units + ' nodes'}
                                            </Row>
                                    </div>
                                        )
                                    } else if (layer.type === 'Convolutional') {
                                        return (
                                            <div key={index}  >
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer' + (index + 1) + ': Convolutional'}
                                            </Row>
                                    </div>
                                        )
                                    } else if (layer.type === 'maxPooling') {
                                        return (
                                            <div>
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer' + (index + 1) + ': maxPooling, with pool size of '+ layer.layerConfig.poolSize[0]}
                                            </Row>
                                    </div>
                                        )
                                    } else if (layer.type === 'Flatten') {
                                        return (
                                            <div key={index}  >
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer' + (index + 1) + ': Flatten'}
                                            </Row>
                                    </div>
                                        )
                                    } else if (layer.type === 'Dropout') {
                                        return (
                                            <div key={index}  >
                                                <hr className="mb-2 mt-0" />
                                            <Row key={index} className='mx-0'>
                                                {'Layer' + (index + 1) + ': Dropout, with rate of: ' + layer.layerConfig.rate}
                                            </Row>
                                            </div>
                                        )
                                    }
                                }

                            })}

                        </ToastBody>
                    </Toast>
                </div>
            </Row>
        );
    }
}

export default DesignSummary;
