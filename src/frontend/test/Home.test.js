import React from "react";
import {shallow,render} from "enzyme";
import Home from "../src/js/Home";
import "isomorphic-fetch"
import Cookies from "universal-cookie";
const cookies = new Cookies();


describe('Home',()=>{
    let wrapper;
    let name = "test";

    beforeEach(()=>{
        cookies.set("user_id","EKiOTfJASnKUPlpQ4fYBig");
        wrapper = shallow(<Home name={name} />);
    });

    it('login should return fail by default', () =>{
        expect(wrapper.containsMatchingElement(name)).toBeTruthy();
    });
});
