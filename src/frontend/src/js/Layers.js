import  React, { Component} from "react"
import "../css/Sidebar.css"
import "../css/Layer.css"
import {Droppable, scrollDroppable} from "react-beautiful-dnd"
import {
    Col,
    Row,
    Popover,
    Button,
    PopoverHeader,
    PopoverBody
} from "reactstrap";
import {Draggable} from "react-beautiful-dnd";
import maxPool from '../../public/max.gif'
import convolution from '../../public/conv.gif'
import flatten from '../../public/flatten.png'
import dropout from '../../public/dropout.gif'
import dense from '../../public/Dense.png'
import delete_icon from '../../public/delete-icon.png'
class Layers extends Component{
    constructor(props) {
        super(props);
        this.state={
            popoverOpen:[]
        };
        this.isDraggingOver=this.isDraggingOver.bind(this);
        this.isDragging=this.isDragging.bind(this);
        this.toggle=this.toggle.bind(this);
    }

    isDraggingOver(isdraggingOver){
        if(isdraggingOver){
            return'draggingOver'
        }
    }
    isDragging(isDragging){
        if(isDragging) return 'sidebar_option_drag'
    }

    toggle(index){
        let newPops = this.state.popoverOpen;
            newPops[index]=!newPops[index];
            this.setState({popoverOpen: newPops});
    }
    deleteTask(id){
        this.props.deleteTask(id)
    }


    render(){
        const {direction } = this.props;
        let newPops = this.state.popoverOpen;
        if (this.props.tasks.length >newPops.length) {
            newPops.push(false);
            this.setState({popoverOpen: newPops});
        }
        let inputs = 784;
        if(this.props.dataset==='color') inputs = 3;
        return (
            <Row className='mx-0 max_height'>
                <Col lg={1} className='px-0 mx-0 max_height'>
                    <div className='input_layer max_height '>
                            Input Layer
                        <div className='max_height d-flex'>
                            <div className='align-self-center'>
                                <Row className='mb-5 mx-0'>
                                    <div className = 'mx-3'>{inputs} input nodes</div>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col lg={10} className='px-0 mx-0 max_height'>
                    <div className='hidden_layer max_height position-relative'>
                        <Droppable
                            droppableId={this.props.column.id}
                            isDropDisabled={this.props.isDropDisabled}
                            direction={direction}

                        >
                            {(provided,snapshot)=>(
                                <div className={'layers_height max_height ' + this.isDraggingOver(snapshot.isDraggingOver)}
                                     ref={provided.innerRef}
                                     {...provided.draggableProps}
                                >
                                    <Row className='mx-0 px-2 max_height'>

                                        {this.props.tasks.map((task,index) => {
                                            return(
                                                <Draggable draggableId={task.id} index={index} key={index}>
                                                    {(provided, snapshot) =>{
                                                        const { isDragging } = snapshot;

                                                        return(
                                                            <div className='px-5  max_height'
                                                                 {...provided.draggableProps}
                                                                 {...provided.dragHandleProps}
                                                                 ref={provided.innerRef}
                                                            >
                                                                <div className='d-flex max_height'>
                                                                <div className='align-self-center'>
                                                                    <Row className='mb-5' key={index}>
                                                                        {task.content !== 'Dense'? null :

                                                                            <div className='delete_wrap'>
                                                                                <Popover placement="bottom" isOpen={this.state.popoverOpen[index]} target={'Popover_' + index} toggle={()=>this.toggle(index)}>
                                                                                    <PopoverHeader><div>{task.content}</div></PopoverHeader>
                                                                                    <PopoverBody>There are {task.nodes} nodes with the activation function '{task.activation}' in this layer.</PopoverBody>
                                                                                </Popover>
                                                                                <img onClick={()=>this.deleteTask(index)} className='close' src={delete_icon}/>
                                                                                <img onClick={()=>this.toggle(index)}
                                                                                     id={'Popover_' + index}
                                                                                    className={' dense mx-3 ' + this.isDragging(isDragging)}
                                                                                    src={dense} alt={'conv layer'}/>
                                                                            </div>

                                                                        }
                                                                        {task.content !== 'Convolutional'? null :
                                                                            <div className='delete_wrap'>
                                                                                <Popover placement="bottom" isOpen={this.state.popoverOpen[index]} target={'Popover_' + index} toggle={()=>this.toggle(index)}>
                                                                                    <PopoverHeader><div>{task.content}</div></PopoverHeader>
                                                                                    <PopoverBody>There are {task.filters} filters with the activation function '{task.activation}' and the kernel is a {task.kernelSize} by {task.kernelSize} grid in this layer.</PopoverBody>
                                                                                </Popover>
                                                                                <img onClick={()=>this.deleteTask(index)} className='close' src={delete_icon}/>
                                                                                <img
                                                                                    id={'Popover_' + index}
                                                                                    className={' conv mx-3 ' + this.isDragging(isDragging)}
                                                                                    src={convolution} alt={'conv layer'}/>
                                                                            </div>
                                                                        }
                                                                        {task.content !== 'Flatten'? null :
                                                                            <div className='delete_wrap'>
                                                                                <Popover placement="bottom" isOpen={this.state.popoverOpen[index]} target={'Popover_' + index} toggle={()=>this.toggle(index)}>
                                                                                    <PopoverHeader><div>{task.content}</div></PopoverHeader>
                                                                                    <PopoverBody> No configuration for this layer</PopoverBody>
                                                                                </Popover>
                                                                                <img onClick={()=>this.deleteTask(index)} className='close' src={delete_icon}/>
                                                                            <img
                                                                                id={'Popover_' + index}
                                                                                className={' conv mx-3 ' + this.isDragging(isDragging)}
                                                                                src={flatten} alt={'conv layer'}/>

                                                                            </div>
                                                                        }
                                                                        {task.content !== 'Dropout'? null :
                                                                            <div className='delete_wrap'>
                                                                                <Popover placement="bottom" isOpen={this.state.popoverOpen[index]} target={'Popover_' + index} toggle={()=>this.toggle(index)}>
                                                                                    <PopoverHeader><div>{task.content}</div></PopoverHeader>
                                                                                    <PopoverBody>The dropout rate is {task.dropout}</PopoverBody>
                                                                                </Popover>
                                                                                <img onClick={()=>this.deleteTask(index)} className='close' src={delete_icon}/>
                                                                                <img
                                                                                    id={'Popover_' + index}
                                                                                    className={' conv mx-3 ' + this.isDragging(isDragging)}
                                                                                    src={dropout} alt={'conv layer'}/>
                                                                            </div>
                                                                        }
                                                                        {task.content !== 'maxPooling'? null :
                                                                            <div className='delete_wrap'>
                                                                                <Popover placement="bottom" isOpen={this.state.popoverOpen[index]} target={'Popover_' + index} toggle={()=>this.toggle(index)}>
                                                                                    <PopoverHeader><div>{task.content}</div></PopoverHeader>
                                                                                    <PopoverBody>The pool is a {task.poolSize} by {task.poolSize} grid</PopoverBody>
                                                                                </Popover>
                                                                                <img onClick={()=>this.deleteTask(index)} className='close' src={delete_icon}/>
                                                                            <img
                                                                                id={'Popover_' + index}
                                                                                className={' conv mx-3 ' + this.isDragging(isDragging)}
                                                                                src={maxPool} alt={'conv layer'}/>
                                                                            </div>
                                                                        }
                                                                    </Row>

                                                                </div>
                                                                </div>
                                                            </div>

                                                        );
                                                    }}

                                                </Draggable>
                                            )
                                        })}
                                    </Row>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <div className='position-absolute bin'>
                        </div>

                    </div>
                </Col>

                <Col lg={1} className='px-0 mx-0 max_height'>
                    <div className='output_layer max_height'>
                        Output Layer
                        <div className='max_height d-flex'>
                            <div className='align-self-center'>
                                <Row className='mb-5 mx-0'>
                                    <div className = 'mx-3'>10 output nodes</div>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        )

    }
}

export default Layers;
