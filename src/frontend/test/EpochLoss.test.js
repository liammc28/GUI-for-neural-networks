import React from "react";
import {shallow} from "enzyme";
import {Line} from "react-chartjs-2";
import BatchAccuracy from "../src/js/BatchAccuracy";
import EpochLoss from "../src/js/EpochLoss";

describe('Display',()=>{
    let wrapper;
    let className = 'epochLoss';
    let data = {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets:[
            {
                label: 'Validation Accuracy',
                lineTension:0,
                backgroundColor: 'grey',
                borderColor: 'grey',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'grey',
                data: [.1,.2,.3,.4,.5,.6,.7,.8,.9,1],
                fill: false
            },
            {
                label: 'Accuracy',
                lineTension:0,
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'green',
                data: [.05,.15,.25,.35,.45,.55,.65,.75,.85,.95],
                fill: false
            }]
    };
    let title = 'Design Title';

    beforeEach(()=>{
        wrapper = shallow(<EpochLoss
            title={title}
            data={data}
            className={className}
        />);
    });

    it('should display the title passed', () =>{
        expect(wrapper.hasClass(className)).toBe(true);
        expect(wrapper.find(Line).props().data).toBe(data);
        expect(wrapper.find(Line).props().options.title.text[0]).toBe(title);
    });

});