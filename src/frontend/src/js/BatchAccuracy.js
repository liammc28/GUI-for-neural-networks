import React, { Component} from "react";
import {Line} from "react-chartjs-2";
import "../css/Chart.css"


class BatchAccuracy extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const {data, className, title} = this.props;
        return (
            <div
                className={className}
            >
                <Line

                    data={data}
                    options={{
                        maintainAspectRatio:false,
                        title:{
                            display: true,
                            text:[title],
                            fontSize: 25,
                            fontColor: '#ccc'
                        },
                        legend:{
                            display:false
                        },
                        scales: {
                            yAxes: [{
                                ticks:{
                                    beginAtZero:true,
                                    min:0,
                                    max:100,
                                    callback: (value, index, values)=> {return value + ' %';}
                                    ,
                                    fontColor: '#ccc'
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'batch',
                                    fontSize: 20,
                                    fontColor: '#ccc',

                                },
                                ticks:{
                                    fontColor: '#ccc'
                                }
                            }],
                        }
                    }}
                />
            </div>
        );
    }
}

export default BatchAccuracy;
