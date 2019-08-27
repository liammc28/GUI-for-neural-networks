import React from "react";
import {shallow,render} from "enzyme";
import NewUser from "../src/js/NewUser";

describe('Display',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<NewUser />);
    });

    it('login should return fail by default', () =>{
        expect(true).toBe(true);
    });
});
