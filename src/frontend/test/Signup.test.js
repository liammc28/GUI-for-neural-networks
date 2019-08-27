import React from "react";
import {shallow,render} from "enzyme";
import {Redirect} from "react-router-dom";
import Signup from "../src/js/Signup";

describe('Display',()=>{
    let wrapper;
    let handleResult;

    beforeEach(()=>{
        wrapper = shallow(<Signup />);
    });

    it('signup success should be false by default', () =>{
        expect(wrapper.state().success).toBe(false);
    });


    //TODO: test ajax call
});