import  React, { Component} from "react";
import "../css/Layer.css"
import {Draggable} from "react-beautiful-dnd";
import {Col, Row} from "reactstrap";
import LineTo from 'react-lineto'
class Layer extends Component{
    constructor(props) {
        super(props);

    }
    isDragging(isDragging){
        if(isDragging) return 'sidebar_option_drag';
        return ''
    }

    render(){
        let tags=[];
        {[...Array(parseInt(this.props.task.nodes)).keys()].map((i)=> {
            const left = this.props.task.id + '_' + i + '_l';
            const right = this.props.task.id + '_' + i + '_r';
            tags.push({left: left, right: right});
        })};

        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {(provided, snapshot) =>{
                    const { isDragging } = snapshot;
                    return(
                        <div className='px-5'
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >

                            <div>{this.props.task.content}</div>
                            <div>{this.props.task.nodes}</div>

                            {[...Array(parseInt(this.props.task.nodes)).keys()].map((i)=>{
                                const left = this.props.task.id + '_' + i +'_l';
                                const right = this.props.task.id + '_' + i +'_r';
                                return(
                                    <div>
                                        <Row className='mb-5'>
                                            <div
                                                className={'layer mx-3 A ' + this.isDragging(isDragging)}
                                            >
                                                <div className={'layer_left ' + left } />
                                                <div className={'layer_right ' + right}/>
                                            </div>
                                        </Row>

                                    </div>

                                )}
                            )}

                        </div>

                    );
                }}

            </Draggable>
        )

    }
}

export default Layer;
