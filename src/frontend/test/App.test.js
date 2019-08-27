import React from "react";
import {shallow,render} from "enzyme";
import App from "../src/js/App";
import {BrowserRouter as Router} from 'react-router-dom';


describe('App',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<App/>);
    });

    it('renders one router component', () => {
        expect(wrapper.find(Router).length).toBe(1);
    });

    it('should be in default display mode', () => {
        expect(wrapper.state().text).toBe("");
    });

    it('successful change of display', () => {
        let instance = wrapper.instance();
        expect(wrapper.state().text).toBe("");
        let display = "newdisplay";
        instance.handleDisplay(display);
        expect(wrapper.state().text).toBe(display);
    });
});
