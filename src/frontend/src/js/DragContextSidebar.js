import  React, { Component} from "react"
import Sidebar_option from "./Sidebar_option";
import "../css/Sidebar.css";
import {Droppable} from "react-beautiful-dnd";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import LabelInputText from "./LabelInputText";
class DragContextSidebar extends Component{
    constructor(props) {
        super(props);
        this.state={
            displayOverwrite:false,
            dropdownOpen: false
        };
        this.overwritePermission = this.overwritePermission.bind(this);
        this.saveDesign = this.saveDesign.bind(this);
        this.toggleModelDropdown = this.toggleModelDropdown.bind(this);
    }

    saveDesign(event){
        const model_name = document.getElementById('model_name').value;
        event.preventDefault();
        this.props.handleDesign(model_name);

    }
    overwritePermission(event){
        const model_name = document.getElementById('model_name').value;
        event.preventDefault();
        if(this.props.model_names.includes(model_name)){
            if(this.state.displayOverwrite===false) {
                this.setState({displayOverwrite: true});
            }
        }else{
            if(this.state.displayOverwrite===true) {
                this.setState({displayOverwrite: false})
            }
        }
    }

    toggleModelDropdown() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }


    render(){
        const {dataset}=this.props;
        const Title =  () => {
            if(this.props.disable) return "6 Layers Max";
            return "Add a layer";
        };

        return (
            <div className='sidebar'>
                <div className='sidebar_title'>
                    Design<br/>
                    {dataset===''?null:<div><Title/></div>}
                </div>
                {dataset!==''?
                    <div>

                        {this.props.disable ? null :
                            <Droppable
                                droppableId={this.props.column.id}
                                isDropDisabled={this.props.isDropDisabled}
                            >
                                {(provided) => (
                                    <div className='sidebar_options d-flex'
                                         ref={provided.innerRef}
                                         {...provided.draggableProps}
                                    >

                                        <div>
                                            {this.props.tasks.map((task, index) =>
                                                <Sidebar_option
                                                    key={task.id}
                                                    task={task}
                                                    index={index}/>
                                            )}
                                        </div>


                                        {provided.placeholder}

                                    </div>
                                )}
                            </Droppable>
                        }
                        <form onSubmit={this.saveDesign} onChange={this.overwritePermission}>
                            {this.state.displayOverwrite ? <div className='mt-2 col-10  overwrite' > This model name is already used </div>: null}
                            <LabelInputText className='col-10' placeholder={"Enter model name here"} type={"text"} name={"model_name"} id={"model_name"}
                                            label={"Model Name"}/>
                            <Button className='mx-3' color={'danger'} disabled={this.props.disableSave}>Save</Button>
                        </form>
                    </div>
                    :
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleModelDropdown} direction={"down"}>
                        <DropdownToggle caret>
                            Choose a Dataset
                        </DropdownToggle>
                        <DropdownMenu className='primary-models'>
                                    <DropdownItem onClick={() =>this.props.handleDataset('mnist')}>Numbers</DropdownItem>
                                    <DropdownItem onClick={() =>this.props.handleDataset('color')}>Colors</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                }
            </div>
        )

    }
}

export default DragContextSidebar;
