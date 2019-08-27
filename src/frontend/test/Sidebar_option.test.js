import React from "react";
import {shallow,render,mount} from "enzyme";
import Sidebar_option from "../src/js/Sidebar_option";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

describe('Sidebar_option',()=>{
    let wrapper;
    let task;

    beforeEach(()=>{
        task = {id:"test1",content:"this is a test"};
        wrapper = mount(
            <DragDropContext onDragStart={()=>{}} onDragUpdate={()=>{}} onDragEnd={()=>{}} >
                <Droppable droppableId={'1'} isDropDisabled={false}>
                    {(provided) => (
                        <div
                             ref={provided.innerRef}
                             {...provided.draggableProps}
                        >

                            <Sidebar_option key={'1'} task={task} index={1} />


                            {provided.placeholder}

                        </div>
                    )}

                </Droppable>
            </DragDropContext>
        );
    });

    it('sidebarOption should contain the content of the option', ()=>{
        expect(wrapper.find('.sidebarOption').text()).toBe(task.content)
    });

    it('sidebarOption should have a className on dragging', ()=>{
        expect(wrapper.find('.sidebarOption').hasClass('sidebar_option')).toBe(true);
    });

});