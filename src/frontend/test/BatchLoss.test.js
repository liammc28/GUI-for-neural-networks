import React from "react";
import {shallow} from "enzyme";
import {Line} from "react-chartjs-2";
import BatchLoss from "../src/js/BatchLoss";

describe('Display',()=>{
    let wrapper;
    let className = 'batchLoss';
    let data = {
        labels: [1,2,3,4,5,6,7,8,9,10],
        datasets:[
            {
                label: 'loss',
                lineTension: 0,
                backgroundColor: 'grey',
                borderColor: 'grey',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(150,99,132,0.4)',
                hoverBorderColor: 'grey',
                data: [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1],
                fill: false
            }]
    };
    let title = 'Design Title';

    beforeEach(()=>{
        wrapper = shallow(<BatchLoss
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