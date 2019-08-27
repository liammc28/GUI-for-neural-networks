import React from "react";
import {shallow,render} from "enzyme";
import Display from "../src/js/Display";
import {BrowserRouter as Router} from 'react-router-dom';


describe('Display',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<Display text={""}/>);
    });

    it('renders one router component', () => {
        expect(wrapper.find(Router).length).toBe(1);
    });

    it('correct update of display', ()=>{
        let display = "new";
        expect(wrapper.state().display).not.toBe(display);
        let instance = wrapper.instance();
        instance.handleDisplay(display);
        expect(wrapper.state().display).toBe(display);
    });

    it('should capitalize name', () =>{
        let instance = wrapper.instance();
        let str = instance.capitalize("john");
        expect(str).toEqual("John");
    });
});