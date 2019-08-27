import React from "react";
import {shallow,render,mount} from "enzyme";
import Sidebar from "../src/js/Sidebar";

describe('Sidebar',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = mount(<Sidebar
            title={'Classify'}
            models={[]}
            model_names={[]}
        /> );

    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find('.sidebar_title').text()).toBe('Classify');
    });

    it('there should be a dropdown item for each primary model', () =>{
        let models=['test1', 'test2','test3'];
        wrapper.setProps({model_names: models});
        let dropdown = wrapper.find('.primary-models');
        expect(dropdown.find('.dropdown-item').length).toBe(models.length);
        expect(dropdown.find('.dropdown-item').first().text()).toBe('test1');
        expect(dropdown.find('.dropdown-item').last().text()).toBe('test3');
    });

    it('there should be a no dropdown as there is no primary models', () =>{
        let dropdown = wrapper.find('.primary-models');
        expect(dropdown.find('.dropdown-item').length).toBe(0);
    });

    it('there should be no dropdown as there is no secondary models', () =>{
        let dropdown = wrapper.find('.secondary-models');
        expect(dropdown.find('.dropdown-item').length).toBe(0);
    });
    //TODO: test ajax call
});
