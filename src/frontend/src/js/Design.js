import  React, { Component} from "react"
import DragContextSidebar from "./DragContextSidebar";
import LabelInputText from "./LabelInputText"
import {DragDropContext} from "react-beautiful-dnd"
import {
    Button,
    Col,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import "../css/Sidebar.css"
import Layers from "./Layers";
import * as tf from "@tensorflow/tfjs"
import {IMAGE_H,IMAGE_W} from "./data";

import Cookies from "universal-cookie";
import Loading from "./Loading";
const cookies = new Cookies();
const startState =  {
    modal: false,
    saveModel:false,
    dataset:'',
    maxTasks:11,
    tasks: {
        'task_1': {
            id: `task_1`,
            content: `Dense`,
            nodes:1,
            activation:'relu'
        },
        'task_2': {
            id: `task_2`,
            content: `Convolutional`,
            nodes:1,
            activation:'relu',
            poolSize: 2,
            kernelSize:3,
            filters:8
        },
        'task_3': {
            id: `task_3`,
            content: `Flatten`,
            nodes:1,

        },
        'task_4': {
            id: `task_4`,
            content: `maxPooling`,
            nodes:1,
        },
        'task_5': {
            id: `task_5`,
            content: `Dropout`,
            nodes:1,
        }
    },
    columns:{
        'column_1': {
            id: 'column_1',
            title: 'Add a layer',
            taskIds:['task_1','task_2', "task_3", "task_4","task_5"]
        },
        'column_2': {
            id: 'column_2',
            title: 'layers',
            taskIds:[]
        }
    },
    columnOrder:['column_1','column_2'],
    taskCount: 5,
    current_task_id: '',
    model_Names:[],
    input:[],
    output: 0,
    validSequence:true,
    validModel:false,
    modalBody:''
};


class Design extends Component{
    constructor(props) {
        super(props);
        this.state= startState;
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleSave = this.toggleSave.bind(this);
        this.toggleValid= this.toggleValid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitConv = this.handleSubmitConv.bind(this);
        this.handleSubmitPool = this.handleSubmitPool.bind(this);
        this.handleSubmitDropout = this.handleSubmitDropout.bind(this);
        this.createModel = this.createModel.bind(this);
        this.handleDataset = this.handleDataset.bind(this);
        this.deleteTask = this.deleteTask.bind(this);

    }

    onDragStart(start){
        const startColumn = this.state.columnOrder.indexOf(start.source.droppableId);
        this.setState({
            startColumn: startColumn
        })
    }

    handleDataset(dataset){
        let input =[];
        let output = 0;
        let tasks ={};
        let columns = {};
        let taskCount = 0;
        if(dataset==='mnist'){
            input = [IMAGE_H , IMAGE_W, 1];
            output = 10;
            taskCount = 5;
            tasks =  {
                'task_1': {
                    id: `task_1`,
                        content: `Dense`,
                        nodes:1,
                        activation:'relu'
                },
                'task_2': {
                    id: `task_2`,
                        content: `Convolutional`,
                        nodes:1,
                        activation:'relu',
                        poolSize: 2,
                        kernelSize:3,
                        filters:8
                },
                'task_3': {
                    id: `task_3`,
                        content: `Flatten`,
                        nodes:1,

                },
                'task_4': {
                    id: `task_4`,
                        content: `maxPooling`,
                        nodes:1,
                },
                'task_5': {
                    id: `task_5`,
                        content: `Dropout`,
                        nodes:1,
                }
            };
            columns = {
                'column_1': {
                    id: 'column_1',
                        title: 'Add a layer',
                        taskIds:['task_1','task_2', "task_3", "task_4","task_5"]
                },
                'column_2': {
                    id: 'column_2',
                        title: 'layers',
                        taskIds:[]
                }
            };
        }
        else {
            input = [3];
            output = 9;

            taskCount = 2;
            tasks =  {
                'task_1': {
                    id: `task_1`,
                    content: `Dense`,
                    nodes:1,
                    activation:'relu'
                },
                'task_2': {
                    id: `task_2`,
                    content: `Dropout`,
                    nodes:1,
                }
            };
            columns = {
                'column_1': {
                    id: 'column_1',
                    title: 'Add a layer',
                    taskIds:['task_1','task_2']
                },
                'column_2': {
                    id: 'column_2',
                    title: 'layers',
                    taskIds:[]
                }
            };
        }
        this.setState({
            dataset: dataset,
            input:input,
            output: output,
            columns:columns,
            tasks:tasks,
            taskCount:taskCount

        });

    }

    handleSubmitPool(){
        let poolSize = document.getElementById('poolSize').value;
        event.preventDefault();

        const newTaskState = {
            ...this.state.tasks[this.state.current_task_id],
            poolSize: poolSize
        };
        const newState ={
            ...this.state,
            tasks:{
                ...this.state.tasks,
                [this.state.current_task_id]: newTaskState
            },
            modal: !this.state.modal
        };
        this.setState(newState);
    }

    onDragEnd(result){
        this.setState({
            startColumn:null
        });
        const { destination, source, draggableId, combine } = result;
        if (!destination) return;

        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ){
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index,0 ,draggableId);
            const  newColumn = {
                ...start,
                taskIds: newTaskIds
            };

            const newState = {
                ...this.state,
                columns:{
                    ...this.state.columns,
                    [newColumn.id]: newColumn
                }
            };
            this.setState(newState);
        }
        else{
            const task = this.state.tasks[draggableId];
            let taskNum = this.state.taskCount;
            let finalTaskNum = taskNum +1;
            const task_id = 'task_' + finalTaskNum;
            const newTaskState = {
                ...task,
                id : task_id
            };
            const finishTaskIds = Array.from(finish.taskIds);
            finishTaskIds.splice(destination.index,0,task_id);
            const finishState = {
                ...finish,
                taskIds: finishTaskIds,
            };
            const newState ={
                ...this.state,
                tasks:{
                    ...this.state.tasks,
                    [task_id]: newTaskState
                },
                columns:{
                    ...this.state.columns,
                    [finishState.id]: finishState
                },
                taskCount: finalTaskNum,
                modal:!this.state.modal,
                current_task_id:task_id,
                layerType:task.content
            };
            this.setState(newState);
        }
    }

    isDropDisabled(index){
        return index < this.state.startColumn;
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleValid() {
        this.setState(prevState => ({
            validModel: !prevState.validModel
        }));
    }

    async toggleSave() {
        await this.setState(startState);
        await this.loadNames();
    }

    handleSubmitConv(event) {
        let activation = document.getElementById('activation').value;
        let kernelSize = document.getElementById('kernelSize').value;
        let filters = document.getElementById('filters').value;
        event.preventDefault();

        const newTaskState = {
            ...this.state.tasks[this.state.current_task_id],
            activation: activation,
            filters: filters,
            kernelSize: kernelSize
        };
        const newState ={
            ...this.state,
            tasks:{
                ...this.state.tasks,
                [this.state.current_task_id]: newTaskState
            },
            modal: !this.state.modal
        };
        this.setState(newState);
    }

    handleSubmitDropout(event) {
        let dropout = document.getElementById('dropout').value/100;
        event.preventDefault();

        const newTaskState = {
            ...this.state.tasks[this.state.current_task_id],
            dropout: dropout
        };
        const newState ={
            ...this.state,
            tasks:{
                ...this.state.tasks,
                [this.state.current_task_id]: newTaskState
            },
            modal: !this.state.modal
        };
        this.setState(newState);
    }

    handleSubmit(event) {
        let node_count = document.getElementById('node').value;
        let activation = document.getElementById('activation').value;
        event.preventDefault();

        const newTaskState = {
            ...this.state.tasks[this.state.current_task_id],
            nodes : node_count,
            activation: activation
        };
        const newState ={
            ...this.state,
            tasks:{
                ...this.state.tasks,
                [this.state.current_task_id]: newTaskState
            },
            modal: !this.state.modal
        };
        this.setState(newState);
    }

    componentDidMount(){
        this.loadNames();
    }

    async loadNames(){
        let data = cookies.get("user_id");
        await fetch('http://localhost:5000/modelInfo?stage=design&user_id=' + data, {
            crossDomain:true,
            method: 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(function(response) {

            return response.json();

        }).then((data) => {

            const newState={
                ...this.state,
                model_Names: data.model_names
            };
            this.setState(newState);
            return data;
        })
    }


    checkValidSequence(){
        let taskListCount = this.state.columns['column_2'].taskIds.length;
        let validSequence = true;
        this.state.columns['column_2'].taskIds.map((task,index)=> {
            if(index+1!==taskListCount) {
                let type = this.state.tasks[task].content;
                let nextType = this.state.tasks[this.state.columns['column_2'].taskIds[index + 1]].content;
                console.log(type + ' is followed by ' + nextType);
                if (type === 'Dense' || type === 'Flatten' || type === 'Dropout') {
                    if (nextType === 'Convolutional' || nextType === 'maxPooling') {
                        let message = "A " + type + " layer can't be followed by a " + nextType + " layer. Please edit you design.";
                        validSequence = false;
                        this.setState({
                            validModel:true,
                            modalBody:message
                        })
                    }
                }
                else {
                    if (nextType === 'Dense' || nextType === 'Dropout') {
                        let message = "A " + type + " layer can't be followed by a " + nextType + " layer. Please edit you design.";
                        validSequence = false;
                        this.setState({
                            validModel:true,
                            modalBody:message
                        })
                    }
                }
            }
        });
        this.setState({
            validSequence:validSequence
        })
    }
    async createModel(model_name) {
        await this.checkValidSequence();
        if (this.state.validSequence) {
            let model = tf.sequential();
            let layers = [];
            this.state.columns['column_2'].taskIds.map((task,index)=>{
                task = this.state.tasks[task];
                let layerType = task.content;
                let nodes = parseInt(task.nodes);
                let activation = task.activation;
                let layerConfig={} ;
                if(this.state.dataset==='mnist') {


                    if (index === 0) {
                        if (layerType === 'Convolutional') {
                            let kernelSize = parseInt(task.kernelSize);
                            let filters = parseInt(task.filters);
                            layerConfig = {
                                inputShape: this.state.input,
                                kernelSize: kernelSize,
                                filters: filters,
                                strides: 1,
                                activation: 'relu',
                                kernelInitializer: 'varianceScaling'
                            };
                            model.add(tf.layers.conv2d(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                        else {
                            layerConfig = {inputShape: this.state.input};
                            model.add(tf.layers.flatten(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }

                    }
                    else {
                        if (layerType === 'Dense') {
                            layerConfig = {
                                units: nodes,
                                activation: activation
                            };
                            model.add(tf.layers.dense(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                        else if (layerType === 'Convolutional') {

                            let kernelSize = parseInt(task.kernelSize);
                            let filters = parseInt(task.filters);
                            layerConfig = {
                                kernelSize: kernelSize,
                                filters: filters,
                                strides: 1,
                                activation: activation,
                                kernelInitializer: 'varianceScaling'
                            };
                            model.add(tf.layers.conv2d(layerConfig));

                            layers.push({type: layerType, layerConfig: layerConfig})

                        }
                        else if (layerType === 'maxPooling') {
                            let poolSize = parseInt(task.poolSize);
                            layerConfig = {
                                poolSize: [poolSize, poolSize],
                                strides: [2, 2]
                            };
                            model.add(tf.layers.maxPooling2d(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                        else if (layerType === 'Flatten') {
                            model.add(tf.layers.flatten());
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                        else if (layerType === 'Dropout') {
                            layerConfig = {rate: task.dropout};
                            model.add(tf.layers.dropout(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                    }
                } else{
                    if (index === 0) {
                        layerConfig = {
                            units: nodes,
                            activation: activation,
                            inputShape: this.state.input
                        };
                        model.add(tf.layers.dense(layerConfig));
                        layers.push({type: layerType, layerConfig: layerConfig})
                    }
                    else {
                        if (layerType === 'Dense') {

                            layerConfig = {
                                units: nodes,
                                activation: activation
                            };
                            model.add(tf.layers.dense(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                        else if (layerType === 'Dropout') {
                            layerConfig = {rate: task.dropout};
                            model.add(tf.layers.dropout(layerConfig));
                            layers.push({type: layerType, layerConfig: layerConfig})
                        }
                    }
                }
            });
            model.add(tf.layers.dense({
                units: this.state.output,
                kernelInitializer: 'varianceScaling',
                activation: 'softmax'
            }));

            let result = model.save('indexeddb://'+model_name);
            model.summary();

            let data = {
                "user_id": cookies.get("user_id"),
                "model_name": model_name,
                "layers": layers,
                "stage": 'design',
                "dataset":this.state.dataset
            };

            await fetch('http://localhost:5000/modelInfo', {
                crossDomain: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),

            });
            await this.setState({saveModel:true});
        }
    }


    deleteTask(index){

        let newTask = this.state.columns['column_2'].taskIds;
        newTask.splice(index,1);

        const column_2 = {
            ...this.state.columns['column_2'],
            taskIds:newTask

        };
        const columns= {
            ...this.state.columns,
            column_2
        };
        let maxTasks=this.state.maxTasks+1;
        const newState ={
            ...this.state,
            columns,
            maxTasks
        };
        this.setState(newState);

    }


    render() {
        let disableSave = true;
        if (this.state.columns['column_2'].taskIds.length !== 0) {
            disableSave = false
        }
        let maxLayer=false;
        if (this.state.taskCount===this.state.maxTasks) {
            maxLayer= true
        }

        return (
                <DragDropContext
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
                >
                        <Row className='mx-0 max_height'>
                            <Col lg={2} className='px-0 sidebar_color'>
                                <DragContextSidebar
                                    isDropDisabled={this.isDropDisabled(0)}
                                    key={this.state.columns[this.state.columnOrder[0]].id}
                                    column={this.state.columns[this.state.columnOrder[0]]}
                                    tasks={this.state.columns[this.state.columnOrder[0]].taskIds.map(taskId => this.state.tasks[taskId])}
                                    model_names={this.state.model_Names}
                                    handleDesign={this.createModel}
                                    disableSave={disableSave}
                                    disable={maxLayer}
                                    dataset={this.state.dataset}
                                    handleDataset={this.handleDataset}
                                />
                            </Col>
                            <Col lg={10} className={'px-0'}>
                                {this.state.dataset!==''?
                                <Layers
                                    dataset={this.state.dataset}
                                    isDropDisabled={this.isDropDisabled(1)}
                                    direction={'horizontal'}
                                    key={this.state.columns[this.state.columnOrder[1]].id}
                                    column={this.state.columns[this.state.columnOrder[1]]}
                                    tasks={this.state.columns[this.state.columnOrder[1]].taskIds.map(taskId => this.state.tasks[taskId])}
                                    className={''}
                                    deleteTask={this.deleteTask}
                                />: <Loading/>}
                            </Col>
                            <Modal isOpen={this.state.modal} backdrop={'static'}  centered={true}>
                                <ModalHeader>{this.state.layerType}</ModalHeader>
                                    {this.state.layerType==='Dense'?
                                        <form onSubmit={this.handleSubmit}>
                                            <ModalBody>

                                                <LabelInputText className='col-8 mx-auto' placeholder={"nodes here"} type={"number"} name={"node"} id={"node"}
                                                                label={"Number of Nodes"}
                                                />
                                                <Label for="activation">Activation Function</Label>
                                                <Input type="select" name="activation" id="activation">
                                                    <option value="sigmoid" >sigmoid</option>
                                                    <option value="relu" >relu</option>
                                                    <option value="softmax" >softmax</option>
                                                    <option value="elu" >elu</option>
                                                    <option value="linear" >linear</option>
                                                    <option value="tanh" >tanh</option>
                                                </Input>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" >Continue</Button>
                                            </ModalFooter>
                                        </form>
                                        :
                                        null
                                    }
                                    {this.state.layerType==='Convolutional'?
                                        <form onSubmit={this.handleSubmitConv}>
                                            <ModalBody>
                                                <LabelInputText className='col-8 mx-auto' placeholder={"eg: 3"} type={"number"} name={"kernelSize"} id={"kernelSize"}
                                                                label={"Kernel size"}
                                                />
                                                <LabelInputText className='col-8 mx-auto' placeholder={"eg: 8"} type={"number"} name={"filters"} id={"filters"}
                                                                label={"Number of filters"}
                                                />
                                                <Label for="activation">Activation Function</Label>
                                                <Input type="select" name="activation" id="activation">
                                                    <option value="sigmoid" >sigmoid</option>
                                                    <option value="relu" >relu</option>
                                                    <option value="softmax" >softmax</option>
                                                    <option value="elu" >elu</option>
                                                    <option value="linear" >linear</option>
                                                    <option value="tanh" >tanh</option>
                                                </Input>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" >Continue</Button>
                                            </ModalFooter>
                                        </form>
                                        : null
                                    }
                                    {this.state.layerType==='Flatten'?
                                        <div>
                                            <ModalBody>
                                                {this.state.layerType}
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button onClick={() => this.toggle()} color="primary" >Continue</Button>
                                            </ModalFooter>
                                        </div>
                                        : null
                                    }
                                    {this.state.layerType==='maxPooling'?
                                        <form onSubmit={this.handleSubmitPool}>
                                            <ModalBody>
                                                <LabelInputText className='col-8 mx-auto' placeholder={"eg: 2 "} type={"number"} name={"poolSize"} id={"poolSize"}
                                                                label={"Pool Size"}
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary"> Continue</Button>
                                            </ModalFooter>
                                        </form>
                                        : null
                                    }
                                    {this.state.layerType==='Dropout'?
                                        <form onSubmit={this.handleSubmitDropout}>
                                            <ModalBody>
                                                <LabelInputText className='col-8 mx-auto' placeholder={"eg: 0.25 "} type={"number"} name={"dropout"} id={"dropout"}
                                                                label={"Dropout Rate"}
                                                />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary"> Continue</Button>
                                            </ModalFooter>
                                        </form>
                                        : null
                                    }
                            </Modal>
                            <Modal isOpen={this.state.saveModel} backdrop={'static'}  centered={true}>
                                    <div>
                                        <ModalBody>
                                            Model Successively saved
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button onClick={() => this.toggleSave()} color="primary" >Continue</Button>
                                        </ModalFooter>
                                    </div>
                            </Modal>
                            <Modal isOpen={this.state.validModel} backdrop={'static'}  centered={true}>
                                <div>
                                    <ModalBody>
                                        Error
                                    </ModalBody>
                                    <ModalBody>{this.state.modalBody}</ModalBody>
                                    <ModalFooter>
                                        <Button onClick={() => this.toggleValid()} color="primary" >Continue</Button>
                                    </ModalFooter>
                                </div>
                            </Modal>
                        </Row>
                </DragDropContext>

        )


    }
}

export default Design;


