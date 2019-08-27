import React from "react";
import {shallow,mount,render} from "enzyme";
import Header from "../src/js/Header";
import {BrowserRouter as Router} from 'react-router-dom';


describe('Header',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = mount(<Header/>);
    });

    it('Title is display correctly',()=>{
        expect(wrapper.find('.navbar-brand').first().text()).toBe("GUI for NN");
    });

    it('open burger menu',()=>{
        let button = wrapper.find('button').first();
        let isOpen = wrapper.state().isOpen;
        button.simulate('click');
        expect(wrapper.state().isOpen).not.toBe(isOpen);
    });

    it('renders one router component', () => {
        expect(wrapper.find(Router).length).toBe(1);
    });

    it('toggle on dropdown alternates',()=>{
        let instance = wrapper.instance();
        let isOpen = wrapper.state().isOpen;
        instance.toggle();
        expect(wrapper.state().isOpen).not.toBe(isOpen);
        instance.toggle();
        expect(wrapper.state().isOpen).toBe(isOpen);
    });

    it('on dropdown alternates',()=>{
        let instance = wrapper.instance();
        let isOpen = wrapper.state().isOpen;
        instance.toggle();
        expect(wrapper.state().isOpen).not.toBe(isOpen);
        instance.toggle();
        expect(wrapper.state().isOpen).toBe(isOpen);
    });

});
