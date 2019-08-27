import React, { Component} from "react";
import {Bar} from "react-chartjs-2";
import "../css/Chart.css"
import {selectColor} from "./Chartconfig"


class TrainingTimes extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const {times, labels,className,title} = this.props;
        const colour = selectColor();

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: colour,
                    borderColor: colour,
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: times
                }
            ]
        };

        return (
            <div
                className={className}
            >
                <Bar
                    data={data}
                    options={{
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: [title],
                            fontSize: 25,
                            fontColor: '#ccc'
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor: '#ccc'
                                }
                            }],
                            xAxes: [{
                                ticks: {

                                    fontColor: '#ccc'
                                }
                            }]
                        }
                    }}
                />
            </div>
        );
    }
}

export default TrainingTimes;