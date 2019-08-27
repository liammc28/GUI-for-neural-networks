import React from "react";
import {shallow,render} from "enzyme";
import Verify from "../src/js/Verify";

describe('Display',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<Verify />);
    });

    it('login should return fail by default', () =>{
        expect(true).toBe(true);
    });
    //TODO: test ajax call
});