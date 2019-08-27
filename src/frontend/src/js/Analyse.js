import React, { Component} from "react";
import {
    Col, Nav, NavItem, NavLink,
    Row, TabContent, TabPane
} from "reactstrap";
import Cookies from 'universal-cookie';
import Sidebar from "./Sidebar";
import {epochAccuracyData, epochLossData, selectColor} from "./Chartconfig";
import EpochAccuracy from "./EpochAccuracy";
import EpochLoss from "./EpochLoss";
import TrainingTimes from "./TrainingTimes";
import TestAccuracy from "./TestAccuracy";
import Summary from "./Summary";
import Loading from "./Loading";
const cookies = new Cookies;
import "../css/Chart.css"

class Analyse extends Component{
    constructor(props) {
        super(props);
        this.state = {
            model_name: '',
            model_Names: [],
            trainingInfo:[],
            trainingTimes:[],
            valAccs:[],
            models:[],
            epochAcc: epochAccuracyData(),
            epochLoss: epochLossData(),
            epochAccDefault: epochAccuracyData(),
            epochLossDefault: epochLossData(),
            modelTrained:true,
            activeTab:'0',
            numberOfModels:0,
            model_labels:[],
            trainingSpeed:{},
            valAcc:{},
            testAcc:[],
            model_design:[],
            dataset:''
        };
        this.handleModuleSelection = this.handleModuleSelection.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    componentDidMount(){
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
            let accuracyDatasets=[];
            let lossDatasets=[];
            let trainingTimes=[];
            let testAccs=[];
            let valAccs=[];
            let labels=[];
            let names=[];
            if(data.trainingInfo===false){
                this.setState({modelTrained:false})
            }
            else {
                data.trainingInfo.map((checked, index) => {
                    let lossColor = selectColor();
                    let accColor = selectColor();
                    let labelsLength = labels.length;
                    let trainingTime = Math.round(checked.trainingTime/1000);
                    let testAcc = checked.testAccuracy.toFixed(2);
                    trainingTimes.push(trainingTime);
                    valAccs.push(checked.epochAccuracy.val_acc[checked.epochAccuracy.val_acc.length-1].toFixed(2));
                    testAccs.push(testAcc);
                    names.push(checked.training_name);
                    if (data.trainingInfo[index].epochLoss.label.length > labelsLength) labels = data.trainingInfo[index].epochLoss.label;
                    lossDatasets.push(
                        {
                            ...this.state.epochLossDefault.datasets[0],
                            label: 'Validation Accuracy ' + parseInt(index),
                            data: data.trainingInfo[index].epochLoss.val_loss,
                            backgroundColor: lossColor,
                            borderColor: lossColor,
                        }
                    );
                    accuracyDatasets.push(
                        {
                            ...this.state.epochAccDefault.datasets[0],
                            label: 'Validation Accuracy ' + parseInt(index),
                            data: data.trainingInfo[index].epochAccuracy.val_acc,
                            backgroundColor: accColor,
                            borderColor: accColor,
                        }
                    )
                });
                const epochLoss = {
                    labels: labels,
                    datasets: lossDatasets
                };
                const epochAcc = {
                    labels: labels,
                    datasets: accuracyDatasets
                };
                this.setState({
                    epochAcc: epochAcc,
                    epochLoss: epochLoss,
                    modelTrained: true,
                    trainingTimes:trainingTimes,
                    testAccs:testAccs,
                    numberOfModels: data.trainingInfo.length,
                    model_labels: names,
                    valAccs:valAccs,
                    model_name: model_name
                });
                this.summary();
            }
        });
    }
    handleModuleSelection(model){
        this.loadTraining(model);
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

    summary(){
        let valAcc = this.state.valAccs;
        let testAcc = this.state.testAccs;
        let times = this.state.trainingTimes;
        let labels = this.state.model_labels;
        let model = this.state.model_name;
        let fastest = {value:10000000000,index:0};
        times.map((time,index)=>{
            if(time<fastest.value) fastest={value:time,index:index}
        });
        let bestTestAcc = {value:0,index:0};
        testAcc.map((test,index)=>{
            if(parseFloat(test)>bestTestAcc.value) bestTestAcc={value:parseFloat(test),index:index}
        });
        let bestValAcc = {value:0,index:0};
        valAcc.map((val,index)=>{
            if(parseFloat(val)>bestValAcc.value) bestValAcc={value:parseFloat(val),index:index}
        });
        this.setState({
            trainingSpeed: fastest,
            valAcc:bestValAcc,
            testAcc:bestTestAcc
        });
        this.loadDesign(model);
    }


    render(){
        return (
            <Row className='mx-0 max_height'>
                <Col lg={2} className='px-0 sidebar_color'>
                    <Sidebar
                        model_names={this.state.model_Names}
                        handleSelection={this.handleModuleSelection}
                        title={'Analyse'}
                        model_selected={null}

                    />
                </Col>


                <Col lg={10} className={'px-0'}>
                    {this.state.modelTrained?null:
                        <div>
                            <h4>Sorry but there is no training information on model: {this.state.model_name} </h4>
                        </div>
                    }
                    {this.state.model_name===''?
                        <Loading/>
                        :
                        <div>
                            {this.state.epochAcc.datasets[0].data.length < 1 ? null :
                                <Row className='mx-0'>
                                    <Col lg={12} className='px-0'>
                                        <Row className='mx-0'>
                                            <Col lg={12} className='analysis_nav px-0'>
                                                <Nav tabs>
                                                    <NavItem>
                                                        <NavLink onClick={() => { this.toggleTab('0'); }}>
                                                            Epoch Accuracy
                                                        </NavLink>
                                                    </NavItem>

                                                    <NavItem>
                                                        <NavLink onClick={() => { this.toggleTab('1'); }}>
                                                            Epoch Loss
                                                        </NavLink>
                                                    </NavItem>

                                                    <NavItem>
                                                        <NavLink onClick={() => { this.toggleTab('2'); }}>
                                                            Training Times
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink onClick={() => { this.toggleTab('3'); }}>
                                                            Test Accuracy
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink onClick={() => { this.toggleTab('4'); }}>
                                                            Validation Accuracy
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </Col>
                                        </Row>

                                        <Row className='mx-0'>
                                            <Col lg={9}>
                                                <TabContent activeTab={this.state.activeTab}>
                                                    <TabPane tabId={'0'}>
                                                        <Row className='mx-0'>
                                                            <Col className='px-0'>
                                                                <EpochAccuracy
                                                                    className='analysisAccuracy d-block'
                                                                    data={this.state.epochAcc}
                                                                    title={'Epoch Accuracy'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                    <TabPane tabId={'1'}>
                                                        <Row className='mx-0'>
                                                            <Col className='px-0'>
                                                                <EpochLoss
                                                                    className={'analysisAccuracy d-block'}
                                                                    data={this.state.epochLoss}
                                                                    title={'Epoch Loss'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                    <TabPane tabId={'2'}>
                                                        <Row className='mx-0'>
                                                            <Col className='px-0'>
                                                                <TrainingTimes
                                                                    className={'analysisAccuracy d-block'}
                                                                    times={this.state.trainingTimes}
                                                                    labels={this.state.model_labels}
                                                                    title={'Training Times'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                    <TabPane tabId={'3'}>
                                                        <Row className='mx-0'>
                                                            <Col className='px-0'>
                                                                <TestAccuracy
                                                                    className={'analysisAccuracy d-block'}
                                                                    accuracies={this.state.testAccs}
                                                                    labels={this.state.model_labels}
                                                                    title={'Test Accuracy'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                    <TabPane tabId={'4'}>
                                                        <Row className='mx-0'>
                                                            <Col className='px-0'>
                                                                <TestAccuracy
                                                                    className='analysisAccuracy d-block'
                                                                    accuracies={this.state.valAccs}
                                                                    labels={this.state.model_labels}
                                                                    title={'Validation Accuracy'}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </TabPane>
                                                </TabContent>
                                            </Col>
                                            <Col lg={2} className='px-0'>
                                                <Summary
                                                    trainingSpeed={this.state.trainingSpeed}
                                                    valAcc={this.state.valAcc}
                                                    testAcc={this.state.testAcc}
                                                    model_design = {this.state.model_design}
                                                    labels = {this.state.model_labels}
                                                    dataset = {this.state.dataset}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            }
                        </div>
                    }
                </Col>
            </Row>
        );
    }
}

export default Analyse;
