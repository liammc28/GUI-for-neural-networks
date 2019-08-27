import  React, { Component} from "react";
import "../css/Sidebar.css"
import {Draggable} from "react-beautiful-dnd";
class Sidebar_option extends Component{
    constructor(props) {
        super(props);

    }
    isDragging(isDragging){
        if(isDragging) return 'sidebar_option_drag';
        return 'sidebar_option'
    }

    render(){
        return (
            <Draggable draggableId={this.props.task.id} index={this.props.index}>
                {(provided, snapshot) =>{
                    const { isDragging } = snapshot;
                        return (
                            <div
                                className={this.isDragging(isDragging) + ' sidebarOption'}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                            >
                                {this.props.task.content}
                            </div>
                        )
                }}

            </Draggable>
        )

    }
}

export default Sidebar_option;