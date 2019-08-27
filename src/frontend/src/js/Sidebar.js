import  React, { Component} from "react"
import "../css/Sidebar.css"
import {
    Button,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input, Row, Toast,
    ToastBody,
    ToastHeader
} from "reactstrap";
class Sidebar extends Component{
    constructor(props) {
        super(props);
        this.state={
            dropdownOpen:false,
            design:''

        };
        this.toggleModelDropdown = this.toggleModelDropdown.bind(this);
        this.handle = this.handle.bind(this);
    }

    toggleModelDropdown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    handle(event){
        event.preventDefault();
        const model = event.target.innerText;
        this.setState({design: model});
        this.props.handleSelection(model);
    }




    render(){
        const {model_selected} = this.props;
        return (
            <div className='sidebar'>
                <div className='sidebar_title'>
                    {this.props.title}
                </div>

                {this.props.model_names ?
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleModelDropdown} direction={"down"}>
                        <DropdownToggle caret>
                            Designs
                        </DropdownToggle>
                        <DropdownMenu className='primary-models'>
                            {this.props.model_names.map((model,index) => {
                                return(
                                    <DropdownItem key={index} onClick={this.handle}>{model}</DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </Dropdown>

                    : null}

                {/*{model_selected!== null?*/}
                    {/*<div className='mt-5'>*/}
                        {/*{model_selected!==''?*/}
                            {/*<Col>*/}
                            {/*<Row className='mx-0'>*/}
                                {/*<h3>{model_selected.training_name}</h3>*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                                {/*Validation accuracy: {model_selected.val_acc}*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                            {/*Batch size: {model_selected.batchSize}*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                            {/*Number of training inputs: {model_selected.sizeOfTrainingInputs}*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                            {/*Number of Epochs: {model_selected.trainEpochs}*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                            {/*Test accuracy: {model_selected.test_acc}*/}
                            {/*</Row>*/}
                            {/*<Row className='mx-0'>*/}
                            {/*Validation Split: {model_selected.validationSplit}*/}
                            {/*</Row>*/}
                            {/*</Col>*/}
                            {/*:null}*/}
                    {/*</div>*/}
                {/*:null}*/}
            </div>
        )

    }
}

export default Sidebar;
