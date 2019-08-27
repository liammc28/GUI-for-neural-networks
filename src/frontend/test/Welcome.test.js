import React from "react";
import {shallow} from "enzyme";
import Welcome from "../src/js/Welcome";

describe('Display',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<Welcome/> );

    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find("p").length).toBe(4);
    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find("p").first().text()).toBe('Welcome to GUI for NN');
    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find('p').last().text()).toBe('Here you can implement NNs without writing any code!');
    });




});
