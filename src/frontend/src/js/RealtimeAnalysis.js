import React, { Component} from "react";
import {
    Row,
    Col, Button
} from 'reactstrap';
import "../css/Sidebar.css"
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import EpochAccuracy from "./EpochAccuracy";
import BatchAccuracy from "./BatchAccuracy";
import BatchLoss from "./BatchLoss";
import EpochLoss from "./EpochLoss";

class RealtimeAnalysis extends Component{
    constructor(props) {
        super(props);
        this.state={
            activeTab: '0'
        };
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }


    render(){
        const {training, epochAccuracyData, epochLossData, legacyBatches, currentBatchLoss, currentBatchAcc, started, activateEarlyStopping} = this.props;
        return (
            <Col lg={10} className={'px-0'}>
                <Row className='mx-0 mt-0'>
                    <Col className='analysis_nav px-0'>
                    <Nav tabs>
                        {training ?
                            <NavItem>
                                <NavLink onClick={() => { this.toggleTab('0'); }}>
                                    Current Batch
                                </NavLink>
                            </NavItem>
                            : null }

                        {legacyBatches.map((batch,index) =>{
                            const tab = (index+1).toString();
                            return(
                                <NavItem key={index}>
                                    <NavLink onClick={() => { this.toggleTab(tab); }}>
                                        Epoch {' '+ tab}
                                    </NavLink>
                                </NavItem>
                            )
                        })}
                    </Nav>
                    </Col>
                </Row>
                <Row className='mx-0'>
                    <Col className='mx-auto'>
                    <TabContent activeTab={this.state.activeTab}>
                        {training ?
                            <TabPane tabId={'0'}>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <div className='d-block mr-4'>
                                        <BatchAccuracy
                                            className='batchAccuracy'
                                            data={currentBatchAcc}
                                            title={'Current Epoch Accuracy '}
                                        />
                                    </div>
                                    <div className='d-block'>
                                        <BatchLoss
                                            className='batchAccuracy'
                                            data={currentBatchLoss}
                                            title={'Current Epoch Loss'}
                                        />
                                    </div>
                                </div>
                            </TabPane>
                            : null
                        }
                        {legacyBatches.map((batch,index) =>{
                            const tab = (index +1).toString();
                            return(
                                <TabPane tabId={tab} key={index}>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <div className='d-block mr-4'>
                                            <BatchAccuracy
                                                className={'batchAccuracy'}
                                                data={batch.acc}
                                                title={'Epoch '+ parseInt(index+1) + " Accuracy"}
                                            />
                                        </div>
                                        <div className='d-block'>
                                            <BatchLoss
                                                className={'batchAccuracy'}
                                                data={batch.loss}
                                                title={'Epoch '+ parseInt(index+1) + " Loss"}
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                            )
                        })}
                    </TabContent>
                    </Col>
                </Row>
                {started?
                <Row className='mx-0 mt-4 d-flex justify-content-center align-items-center'>
                    <div className='d-block mr-4'>
                        <EpochAccuracy
                            className='epochAccuracy'
                            data={
                                epochAccuracyData
                            }
                            title={'Epoch Accuracy'}
                        />
                    </div>
                    <div className='d-block'>
                        <EpochLoss
                            className={'epochAccuracy'}
                            data={
                                epochLossData
                            }
                            title={'Epoch Loss'}
                        />
                    </div>
                </Row>
                :null}
            </Col>
        );
    }
}

export default RealtimeAnalysis;
