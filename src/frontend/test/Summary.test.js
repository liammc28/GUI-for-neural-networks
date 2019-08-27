import React from "react";
import {shallow,mount,render} from "enzyme";
import {Row,ToastBody,Toast} from "reactstrap";
import Summary from "../src/js/Summary";


describe('Summary',()=>{
    let wrapper;
    let labels = ["model 1","model 2","model 3","model 4"];
    let trainingSpeed = {index:0};
    let valAcc = {index:2};
    let testAcc = {index:1};


    beforeEach(()=>{
        wrapper = shallow(<Summary
            labels={labels}
            trainingSpeed={trainingSpeed}
            valAcc={valAcc}
            testAcc={testAcc}
        />);
    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find(Row).length).toBe(4);
    });

    it('The title passed should be displayed', () =>{
        let row = wrapper.find(Row).first().find("div").find(Toast).find(ToastBody).find(Row).first();
        expect(row.html()).toBe("<div class=\"mx-0 row\">The model with the quickest training time is: model 1</div>");
    });

    it('The title passed should be displayed', () =>{
        let row = wrapper.find(Row).first().find("div").find(Toast).find(ToastBody).find(Row).last();
        expect(row.html()).toBe("<div class=\"mx-0 row\">The model with the highest Validation Accuracy is: model 3</div>");
    });
});
