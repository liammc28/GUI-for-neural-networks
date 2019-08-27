import React, { Component} from "react";
import {Line} from "react-chartjs-2";
import "../css/Chart.css"


class AllAccuracy extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const {accuracys, averageAccuracys} = this.props;
        let labels =[];
        if(accuracys) labels = Array.from({length: accuracys.length}, (v, k) => k+1);
        const data = {
            labels:labels,
            datasets: [
                {
                    label: 'Accuracy',
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: accuracys,
                    lineTension:0,
                    borderWidth:2,
                    pointRadius:2,
                    backgroundColor: '#6119d0',
                    borderColor: '#6119d0',
                    fill: false
                },
                {
                    label: 'Average Accuracy',
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: averageAccuracys,
                    borderWidth:2,
                    pointRadius:2,
                    backgroundColor: '#cc0000',
                    borderColor: '#cc0000',
                    fill: false
                }
            ]
        };
        return (
            <div
                className='allAccuracy'
            >
                <Line

                    data={data}
                    options={{
                        maintainAspectRatio:false,
                        title:{
                            display: true,
                            text:['Accuracy'],
                            fontSize: 25,
                            fontColor: '#ccc'
                        },
                        legend:{
                            display:true,
                            labels:{
                                fontColor: '#ccc',
                                fontSize: 15
                            }
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
                                    labelString: 'Model Count',
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

export default AllAccuracy;
