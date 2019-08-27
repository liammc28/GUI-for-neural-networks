import React, { Component} from "react";
import {
    Row,
    Col,
    Button, ButtonGroup
} from 'reactstrap';
import Cookies from 'universal-cookie';
import "../css/Classify.css";
import Sidebar from "./Sidebar";
import * as tf from "@tensorflow/tfjs";
import DesignSummary from "./DesignSummary";
import TrainedSummary from "./TrainedSummary";
import Canvas from "./Canvas";
import Range from "./Range";
import * as colorData from "../ColorData.json";
import Loading from "./Loading";
const cookies = new Cookies;
let classifier;

class Classify extends Component{
    constructor(props) {
        super(props);
        this.state={
            model_name:'',
            prediction:'',
            valB:0,
            valG:0,
            valR:0,
            trained_model:'',
            model_Names: [],
            ismodelTrained:false,
            numberOfModels: 0,
            modelInfo:[],
            model_design:[],
            valAccs:[],
            model:'',
            trained_index:-1,
            dataset:''
        };
        this.handleModuleSelection = this.handleModuleSelection.bind(this);
        this.handleModel = this.handleModel.bind(this);
        this.makePrediction = this.makePrediction.bind(this);
        this.updateR = this.updateR.bind(this);
        this.updateG = this.updateG.bind(this);
        this.updateB = this.updateB.bind(this);
    }

    async componentDidMount(){
        this.loadNames();
    }

    async loadNames(){
        let data = cookies.get("user_id");
        await fetch('http://localhost:5000/modelInfo?stage=trained&user_id=' + data, {
            crossDomain:true,
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {

            return response.json();

        }).then((data) => {
            this.setState({
                model_Names: data.model_names
            })
        });
    }
    async handleModel(index){
        let model_name = this.state.modelInfo[index].training_name;
        this.setState({
            trained_model: model_name,
            trained_index : index
        });
        classifier = await tf.loadLayersModel('http://localhost:5000/training/' + cookies.get("user_id") +'/' + model_name + '/model.json');
    }


    makePrediction(dataGrayscale){
        const dataTensor = tf.tensor(dataGrayscale, [1, 28, 28, 1]);
        const output = classifier.predict(dataTensor);
        const axis = 1;
        const predictions = Array.from(output.argMax(axis).dataSync());
        this.setState({
            prediction: predictions
        })
    }
    predict(){
        const {valG, valB, valR} = this.state;
        tf.tidy(() => {
            const input = tf.tensor2d([
                [valG/255,valB/255,valR/255]
            ]);
            let results = classifier.predict(input);
            let argMax = results.argMax(1);
            let index = argMax.dataSync()[0];
            let label = colorData.labelList[index];
            this.setState({
                prediction: label
            })
        });
    }


    handleModuleSelection(model_name){
        this.setState({
            model_name: model_name,
            modelInfo:[],
            trained_index:-1,
            trained_model:''
        });
        this.loadTraining(model_name);
    }

    loadDesign(model_name){
        fetch('http://localhost:5000/modelInfo?user_id=' + cookies.get("user_id") + '&model_name=' + model_name, {
            crossDomain: true,
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(function (response) {

            return response.json();

        }).then((data)=>{
            let design = data.design.layers;
            this.setState({
                model_design: design,
                dataset:data.design.dataset
            })
        });
    }

    async loadTraining(model_name){
        await fetch('http://localhost:5000/modelTraining?user_id=' + cookies.get("user_id") + '&model_name=' + model_name, {
            crossDomain:true,
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {

            return response.json();

        }).then((data) => {
            let modelInfo=[];
            if(data.trainingInfo===false){
                this.setState({
                    ismodelTrained:false,
                    numberOfModels: 0,
                    modelInfo:modelInfo

                })
            }
            else {
                data.trainingInfo.map((checked, index) => {
                    modelInfo.push({
                        val_acc: checked.epochAccuracy.val_acc[checked.epochAccuracy.val_acc.length-1].toFixed(2),
                        training_name:checked.training_name,
                        batchSize:checked.batchSize,
                        sizeOfTrainingInputs:checked.sizeOfTrainingInputs,
                        validationSplit:checked.validationSplit,
                        trainEpochs:checked.trainEpochs,
                        test_acc:checked.testAccuracy

                    });

                });
                this.setState({
                    numberOfModels: data.trainingInfo.length,
                    modelInfo:modelInfo,
                });
            }
        });
        this.loadDesign(model_name);
    }

    updateR(val) {
        this.setState({
            valR: val
        });
        this.predict()
    }

    updateB(val) {
        this.setState({
            valB: val
        });
        this.predict()

    }

    updateG(val) {
        this.setState({
            valG: val
        });
        this.predict()
    }


    render(){
        const {valG, valB, valR} = this.state;


        return (
            <Row className='mx-0 max_height'>
                <Col lg={2} className='px-0 sidebar_color'>
                    <Sidebar
                        title={'Classify'}
                        model_names={this.state.model_Names}
                        handleSelection={this.handleModuleSelection}
                        model_selected={this.state.trained_index!==-1?this.state.modelInfo[this.state.trained_index]:null}
                    />
                </Col>
                    <Col lg={10} md={5} sm={9}>
                        <div>


                        {this.state.model_name!==''?
                            <div>
                                {this.state.trained_model !== '' ?
                                    <div>
                                        {this.state.dataset === 'mnist' ?
                                            <div>
                                                <canvas ref="canvas"/>
                                                <Canvas
                                                    handlePrediction={this.makePrediction}
                                                    prediction={this.state.prediction}
                                                    clear={() => this.setState({prediction: ''})}
                                                />
                                            </div>
                                            :
                                            <Row>
                                                <Col lg={4}/>
                                                <Col lg={4} className='mt-5'>
                                                    <Row className='mx-auto'>
                                                        <Col>
                                                        <canvas ref="canvas" width="200px" height="200px" style={{
                                                            border:'1px solid #333',
                                                            margin:'20px 0px',
                                                            background: 'rgba(' + valG + ',' + valB + ',' + valR + ',1)'
                                                        }}/>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mx-auto' >
                                                        <Col>
                                                        <Range range={this.state.valG}
                                                               updateRange={this.updateG}
                                                        />
                                                        </Col>
                                                    </Row>
                                                    <Row className='mx-auto' >
                                                        <Col>
                                                        <Range
                                                            range={this.state.valB}
                                                            updateRange={this.updateB}
                                                        />
                                                        </Col>
                                                    </Row>
                                                    <Row className='mx-auto'>
                                                        <Col>
                                                        <Range
                                                            range={this.state.valR}
                                                            updateRange={this.updateR}
                                                        />
                                                        </Col>
                                                    </Row>
                                                    <Row className='mx-auto pl-5'>

                                                        <div className='prediction'>
                                                            {this.state.prediction}
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col lg={4}/>
                                            </Row>
                                        }

                                    </div>
                                    :
                                    <div>
                                        <DesignSummary dataset ={this.state.dataset} model_design={this.state.model_design}/>
                                        {this.state.modelInfo.length > 0 ?
                                            <TrainedSummary
                                                model_infos={this.state.modelInfo}
                                                model_selection={this.handleModel}
                                            />
                                        : null}
                                    </div>
                                }
                            </div>
                        :<Loading/>}
                        </div>


                    </Col>
                </Row>
        );
    }
}

export default Classify;
