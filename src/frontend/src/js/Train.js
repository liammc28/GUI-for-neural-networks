import React, { Component} from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Row,
    Col
} from 'reactstrap';
import "../css/Sidebar.css"
import Cookies from 'universal-cookie';
import LabelInputText from "./LabelInputText";
import * as tf from "@tensorflow/tfjs"
import {IMAGE_H,IMAGE_W,MnistData} from "./data";
import RealtimeAnalysis from "./RealtimeAnalysis";
import {epochAccuracyData, epochLossData, batchAcc, batchLoss} from "./Chartconfig";
import * as colorData from "../ColorData.json";
import DesignSummary from "./DesignSummary";
import logo from "../../public/logo.png"
import Loading from "./Loading";
import Layers from "./Layers";

const cookies = new Cookies;

class Train extends Component{
    constructor(props) {
        super(props);
        this.state={
            training:false,
            testAcc:0,
            model_Names: [],
            training_id:'',
            model_name:'',
            dropdownOpen: false,
            legacyBatches:[],
            EpochAccuracyData: {},
            EpochLossData: {},
            model_design:[],
            startedTraining:false,
            finished: false,
            currentBatch:{},
            currentBatchLoss:{},
            earlyStop:false,
            dataset:''
        };
        this.toggleModelDropdown = this.toggleModelDropdown.bind(this);
        this.handleModuleSelection = this.handleModuleSelection.bind(this);
        this.earlyStopping= this.earlyStopping.bind(this);
        this.trainModel = this.trainModel.bind(this);
    }
    componentDidMount(){
        this.loadNames();
    }

    toggleModelDropdown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    loadNames(){
        fetch('http://localhost:5000/modelInfo?stage=design&user_id=' + cookies.get("user_id"), {
            crossDomain: true,
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        }).then(function (response) {

            return response.json();

        }).then((data)=>{
            this.setState({
                model_Names: data.model_names
            })
        });
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
                dataset: data.design.dataset
            })
        });
    }

    async handleModel(model_name){
        this.setState({trained_model: model_name});
        const model = await tf.loadLayersModel('http://localhost:5000/training/' + cookies.get("user_id") +'/' + model_name + '/model.json');
        model.summary();
    }



    async trainModel(event){
        let startTime;
        let endTime;
        let trainingTime = 1;
        event.preventDefault();
        await this.setState({
            training:true
        });
        let model = await tf.loadLayersModel('indexeddb://' + this.state.model_name);
        let data = new MnistData();
        await data.load();
        const optimizer = 'rmsprop';
        model.compile({
            optimizer:optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });
        if(this.state.dataset==='mnist') {
            const batchSize = parseInt(document.getElementById('batchSize').value);
            const trainEpochs = document.getElementById('epochs').value;
            let sizeOfTrainingInputs = document.getElementById('inputExamples').value;
            let validationSplit = document.getElementById('validationSplit').value;
            if (sizeOfTrainingInputs > 55000 || sizeOfTrainingInputs < 0) sizeOfTrainingInputs = 55000;
            if (validationSplit > 100 || validationSplit < 0) validationSplit = 15;
            validationSplit = validationSplit * .01;

            const trainData = data.getTrainData(sizeOfTrainingInputs);

            const testData = data.getTestData();

            console.log('error in minsts');

           let history = model.fit(trainData.xs, trainData.labels, {
                batchSize,
                validationSplit,
                epochs: trainEpochs,
                callbacks: {

                    onEpochEnd: async (epoch, logs) => {

                        let labelsAcc = this.state.EpochAccuracyData.labels;
                        const oldDatasetsValAcc = this.state.EpochAccuracyData.datasets[0];
                        const newDatasetsValAcc = {
                            ...oldDatasetsValAcc,
                            data: oldDatasetsValAcc.data.concat(logs.val_acc * 100)
                        };
                        const oldDatasetsAcc = this.state.EpochAccuracyData.datasets[1];
                        const newDatasetsAcc = {
                            ...oldDatasetsAcc,
                            data: oldDatasetsAcc.data.concat(logs.acc * 100)
                        };

                        let labelsLoss = this.state.EpochLossData.labels;
                        const oldDatasetsValLoss = this.state.EpochLossData.datasets[0];
                        const newDatasetsValLoss = {
                            ...oldDatasetsValLoss,
                            data: oldDatasetsValLoss.data.concat(logs.val_loss * 100)
                        };
                        const oldDatasetsLoss = this.state.EpochLossData.datasets[1];
                        const newDatasetsLoss = {
                            ...oldDatasetsLoss,
                            data: oldDatasetsLoss.data.concat(logs.loss * 100)
                        };


                        let batches = this.state.legacyBatches;

                        const newLegacy = {
                            loss: this.state.currentBatchLoss,
                            acc: this.state.currentBatch
                        };
                        this.setState({
                            EpochAccuracyData: {
                                datasets: [newDatasetsValAcc, newDatasetsAcc],
                                labels: labelsAcc.concat(parseInt(epoch) + 1)
                            },
                            EpochLossData: {
                                datasets: [newDatasetsValLoss, newDatasetsLoss],
                                labels: labelsAcc.concat(parseInt(epoch) + 1)
                            },
                            legacyBatches: batches.concat(newLegacy)
                        });
                        if(this.state.earlyStop){
                            model.stopTraining = true;
                        }

                    },
                    onEpochBegin: async (epoch, logs) => {
                        const oldBatchDatasets = this.state.currentBatch.datasets[0];
                        const newBatchDatasets = {
                            ...oldBatchDatasets,
                            data: []
                        };
                        const batches = {
                            datasets: [newBatchDatasets],
                            labels: []
                        };
                        const oldBatchDatasetsLoss = this.state.currentBatchLoss.datasets[0];
                        const newBatchDatasetsLoss = {
                            ...oldBatchDatasetsLoss,
                            data: []
                        };
                        const batchesLoss = {
                            datasets: [newBatchDatasetsLoss],
                            labels: []
                        };
                        this.setState({
                            currentBatch: batches,
                            currentBatchLoss: batchesLoss
                        });

                    },
                    onBatchEnd: async (batch, logs) => {
                        let labels = this.state.currentBatch.labels;
                        const oldDatasets = this.state.currentBatch.datasets[0];
                        const newDatasets = {
                            ...oldDatasets,
                            data: oldDatasets.data.concat(logs.acc * 100)
                        };
                        const batchs = {
                            datasets: [newDatasets],
                            labels: labels.concat(parseInt(batch) + 1)
                        };
                        let labelsLoss = this.state.currentBatchLoss.labels;
                        const oldDatasetsLoss = this.state.currentBatchLoss.datasets[0];
                        const newDatasetsLoss = {
                            ...oldDatasetsLoss,
                            data: oldDatasetsLoss.data.concat(logs.loss * 100)
                        };
                        const batchsLoss = {
                            datasets: [newDatasetsLoss],
                            labels: labelsLoss.concat(parseInt(batch) + 1)
                        };
                        this.setState({
                            currentBatchLoss: batchsLoss,
                            currentBatch: batchs
                        });
                    },
                    onTrainEnd: async (logs) => {
                        document.getElementById('batchSize').value = undefined;
                        document.getElementById('epochs').value = null;
                        document.getElementById('inputExamples').value = null;
                        document.getElementById('validationSplit').value = null;
                        await this.setState({
                            training: false,
                            finished: true
                        });

                        endTime = performance.now();
                        trainingTime = (endTime - startTime);
                    },
                    onTrainBegin: async (logs) => {

                        console.log('error in onTrainBegin');
                        startTime = performance.now();
                        this.setState({
                            startedTraining: true,
                            EpochAccuracyData: epochAccuracyData(),
                            EpochLossData: epochLossData(),
                            legacyBatches: [],
                            currentBatch: batchAcc(),
                            currentBatchLoss: batchLoss(),
                        });

                    }
                }

            });
           console.log(history);


            const testResult = model.evaluate(testData.xs, testData.labels);
            const testAccPercent = testResult[1].dataSync()[0] * 100;
            this.setState({testAcc: testAccPercent, trainingTime: trainingTime});
            await this.sendData(trainingTime, testAccPercent, trainEpochs, batchSize, sizeOfTrainingInputs, validationSplit);
            await model.save(tf.io.browserHTTPRequest(
                'http://localhost:5000/train',
                {
                    requestInit: {
                        method: 'POST',
                        headers:
                            {
                                'model_id': this.state.training_id,
                                "user_id": cookies.get("user_id")
                            }
                    }
                })
            )


        }
        else{
            const batchSize = parseInt(document.getElementById('batchSize').value);
            const trainEpochs = document.getElementById('epochs').value;
            let sizeOfTrainingInputs = document.getElementById('inputExamples').value;
            if (sizeOfTrainingInputs > 5000 || sizeOfTrainingInputs < 0) sizeOfTrainingInputs = 4999;
            let validationSplit = document.getElementById('validationSplit').value;
            let colors = [];
            let labels = [];
            let testColors = [];
            let testLabels = [];
            console.log(colorData.entries.length);
            for(let i =0;i<sizeOfTrainingInputs;i++){
                let record = colorData.entries[i];
                let col = [record.r / 255, record.g / 255, record.b / 255];
                colors.push(col);
                labels.push(colorData.labelList.indexOf(record.label));
            }
            let xs = tf.tensor2d(colors);
            let labelsTensor = tf.tensor1d(labels, 'int32');

            let ys = tf.oneHot(labelsTensor, 9).cast('float32');
            labelsTensor.dispose();
            for(let j =5642;j>5000;j--){
                let record = colorData.entries[j];
                let col = [record.r / 255, record.g / 255, record.b / 255];
                testColors.push(col);
                testLabels.push(colorData.labelList.indexOf(record.label));
            }

            let testXs = tf.tensor2d(testColors);
            let testLabelsTensor = tf.tensor1d(testLabels, 'int32');

            let testYs = tf.oneHot(testLabelsTensor, 9).cast('float32');
            testLabelsTensor.dispose();

            await model.fit(xs, ys, {
                batchSize:batchSize,
                validationSplit:validationSplit * .01,
                epochs: trainEpochs,
                callbacks: {

                    onEpochEnd: async (epoch, logs) => {

                        let labelsAcc = this.state.EpochAccuracyData.labels;
                        const oldDatasetsValAcc = this.state.EpochAccuracyData.datasets[0];
                        const newDatasetsValAcc = {
                            ...oldDatasetsValAcc,
                            data: oldDatasetsValAcc.data.concat(logs.val_acc * 100)
                        };
                        const oldDatasetsAcc = this.state.EpochAccuracyData.datasets[1];
                        const newDatasetsAcc = {
                            ...oldDatasetsAcc,
                            data: oldDatasetsAcc.data.concat(logs.acc * 100)
                        };

                        let labelsLoss = this.state.EpochLossData.labels;
                        const oldDatasetsValLoss = this.state.EpochLossData.datasets[0];
                        const newDatasetsValLoss = {
                            ...oldDatasetsValLoss,
                            data: oldDatasetsValLoss.data.concat(logs.val_loss * 100)
                        };
                        const oldDatasetsLoss = this.state.EpochLossData.datasets[1];
                        const newDatasetsLoss = {
                            ...oldDatasetsLoss,
                            data: oldDatasetsLoss.data.concat(logs.loss * 100)
                        };


                        let batches = this.state.legacyBatches;

                        const newLegacy = {
                            loss: this.state.currentBatchLoss,
                            acc: this.state.currentBatch
                        };
                        this.setState({
                            EpochAccuracyData: {
                                datasets: [newDatasetsValAcc, newDatasetsAcc],
                                labels: labelsAcc.concat(parseInt(epoch) + 1)
                            },
                            EpochLossData: {
                                datasets: [newDatasetsValLoss, newDatasetsLoss],
                                labels: labelsAcc.concat(parseInt(epoch) + 1)
                            },
                            legacyBatches: batches.concat(newLegacy)
                        });
                        if(this.state.earlyStop){
                            model.stopTraining = true;
                        }


                    },
                    onEpochBegin: async (epoch, logs) => {
                        const oldBatchDatasets = this.state.currentBatch.datasets[0];
                        const newBatchDatasets = {
                            ...oldBatchDatasets,
                            data: []
                        };
                        const batches = {
                            datasets: [newBatchDatasets],
                            labels: []
                        };
                        const oldBatchDatasetsLoss = this.state.currentBatchLoss.datasets[0];
                        const newBatchDatasetsLoss = {
                            ...oldBatchDatasetsLoss,
                            data: []
                        };
                        const batchesLoss = {
                            datasets: [newBatchDatasetsLoss],
                            labels: []
                        };
                        this.setState({
                            currentBatch: batches,
                            currentBatchLoss: batchesLoss
                        });

                    },
                    onBatchEnd: async (batch, logs) => {
                        let labels = this.state.currentBatch.labels;
                        const oldDatasets = this.state.currentBatch.datasets[0];
                        const newDatasets = {
                            ...oldDatasets,
                            data: oldDatasets.data.concat(logs.acc * 100)
                        };
                        const batchs = {
                            datasets: [newDatasets],
                            labels: labels.concat(parseInt(batch) + 1)
                        };
                        let labelsLoss = this.state.currentBatchLoss.labels;
                        const oldDatasetsLoss = this.state.currentBatchLoss.datasets[0];
                        const newDatasetsLoss = {
                            ...oldDatasetsLoss,
                            data: oldDatasetsLoss.data.concat(logs.loss * 100)
                        };
                        const batchsLoss = {
                            datasets: [newDatasetsLoss],
                            labels: labelsLoss.concat(parseInt(batch) + 1)
                        };
                        this.setState({
                            currentBatchLoss: batchsLoss,
                            currentBatch: batchs
                        });
                    },
                    onTrainEnd: async (logs) => {
                        document.getElementById('batchSize').value = undefined;
                        document.getElementById('epochs').value = null;
                        document.getElementById('inputExamples').value = null;
                        document.getElementById('validationSplit').value = null;
                        await this.setState({
                            training: false,
                            finished: true
                        });

                        endTime = performance.now();
                        trainingTime = (endTime - startTime);
                    },
                    onTrainBegin: async (logs) => {
                        startTime = performance.now();
                        this.setState({
                            startedTraining: true,
                            EpochAccuracyData: epochAccuracyData(),
                            EpochLossData: epochLossData(),
                            legacyBatches: [],
                            currentBatch: batchAcc(),
                            currentBatchLoss: batchLoss(),
                        });

                    }
                }
            });
            const testResult = model.evaluate(testXs, testYs);
            const testAccPercent = testResult[1].dataSync()[0] * 100;
            await this.sendData(trainingTime, testAccPercent, trainEpochs, batchSize, sizeOfTrainingInputs, validationSplit);
            await model.save(tf.io.browserHTTPRequest(
                'http://localhost:5000/train',
                {
                    requestInit: {
                        method: 'POST',
                        headers:
                            {
                                'model_id': this.state.training_id,
                                "user_id": cookies.get("user_id")
                            }
                    }
                })
            );

            tf.tidy(() => {
                const input = tf.tensor2d([
                    [30/255,30/255,30/255]
                ]);
                let results = model.predict(input);
                let argMax = results.argMax(1);
                let index = argMax.dataSync()[0];
                let label = colorData.labelList[index];
            });
        }
    }
    async sendData(trainingTime,testAccPercent, trainEpochs, batchSize,sizeOfTrainingInputs,validationSplit){
        const accuracy = {
            label:this.state.EpochAccuracyData.labels,
            val_acc:this.state.EpochAccuracyData.datasets[0].data,
            acc:this.state.EpochAccuracyData.datasets[1].data
        };
        const loss = {
            label:this.state.EpochLossData.labels,
            val_loss:this.state.EpochLossData.datasets[0].data,
            loss:this.state.EpochLossData.datasets[1].data
        };
        let data = {
            "user_id": cookies.get("user_id"),
            "model_name": this.state.model_name,
            "epochAccuracy": accuracy,
            "epochLoss": loss,
            "trainingTime": trainingTime,
            "testAccuracy": testAccPercent,
            "stage": 'training',
            'validationSplit' : validationSplit,
            'sizeOfTrainingInputs' : sizeOfTrainingInputs,
            'trainEpochs': trainEpochs,
            'batchSize' : batchSize
        };
        await fetch('http://localhost:5000/modelInfo', {
            crossDomain: true,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),

        }).then(function(response) {
            return response.json();
        }).then((data) => {
            this.setState({
                training_id: data.model_id
            })
        })
    };

    handleModuleSelection(event){
        event.preventDefault();
        let model_name = event.target.innerText;
        this.setState({
            model_name: model_name
        });
        this.loadDesign(model_name);
    }

    earlyStopping(){
        this.setState({
            earlyStop: true
        });
    }
    dataset(){
        if(this.state.dataset==='color') return'5000';
        return '55000';
    }
    render(){
        return (
            <Row className='mx-0 max_height '>
                <Col lg={2} className='px-0 sidebar_color '>
                    <div className='sidebar'>
                        <div className='sidebar_title'>Train</div>
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleModelDropdown} direction={"down"}>
                            <DropdownToggle caret>
                                Models
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.model_Names.map((model,index) => {
                                    return(
                                        <DropdownItem key={index} onClick={this.handleModuleSelection}>{model}</DropdownItem>
                                    )
                                })}

                            </DropdownMenu>
                        </Dropdown>
                        {this.state.model_name === '' ? null :
                            <form onSubmit={this.trainModel}>
                                <LabelInputText placeholder={"Number of epochs"} type={"number"} name={"epochs"}
                                                id={"epochs"}
                                                label={"Number of epochs"}/>
                                <LabelInputText placeholder={"Size of batches"} type={"number"} name={"batchSize"}
                                                id={"batchSize"}
                                                label={"Size of batches"}/>
                                <LabelInputText placeholder={"Number of Inputs"} type={"number"} name={"inputExamples"}
                                                id={"inputExamples"}
                                                label={"Number of Inputs: 1 -" + this.dataset() }/>
                                <LabelInputText placeholder={"Validation Split"} type={"number"}
                                                name={"validationSplit"} id={"validationSplit"}
                                                label={"Validation Split: 0 - 100"}/>
                                <Button disabled={this.state.training}> Train Model {this.state.model_name}</Button>
                            </form>
                        }
                        {this.state.training?
                            <div className='mt-2 ml-2'>
                                <Button onClick={this.earlyStopping}>Early Stop</Button>
                            </div>
                            :null}
                        </div>
                </Col>
                {this.state.startedTraining && this.state.model_design!==[]?

                    <RealtimeAnalysis
                        started={this.state.startedTraining}
                        training={this.state.training}
                        epochAccuracyData={this.state.EpochAccuracyData}
                        epochLossData={this.state.EpochLossData}
                        legacyBatches={this.state.legacyBatches}
                        currentBatchLoss={this.state.currentBatchLoss}
                        currentBatchAcc={this.state.currentBatch}
                    />
                    :
                    <Col lg={10} className={'px-0'}>
                        {this.state.model_design.length>0?
                        <DesignSummary
                            dataset ={this.state.dataset}
                        model_design={this.state.model_design}/>

                            :
                            <Col lg={10} className={'px-0'}>
                                <Loading/>
                            </Col>
                        }
                    </Col>
                }

            </Row>
        );
    }
}

export default Train;
