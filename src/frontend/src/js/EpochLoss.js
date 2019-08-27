import React, { Component} from "react";
import {Line} from "react-chartjs-2";
import "../css/Chart.css"


class EpochLoss extends Component{
    constructor(props) {
        super(props);
    }



    render(){
        const {data, className,title} = this.props;
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
                        legend: {
                            display: true,
                            labels:{
                                fontColor: '#ccc',
                            }
                        },
                        scales:{
                            yAxes: [{
                                ticks:{
                                    beginAtZero:true,
                                    min:0,
                                    fontColor: '#ccc'
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: '# of epochs',
                                    fontSize: 20,
                                    fontColor: '#ccc',

                                },
                                ticks:{
                                    fontColor: '#ccc',
                                }
                            }],
                        }
                    }}
                />
            </div>
        );
    }
}

export default EpochLoss;