import React from "react";
import {shallow} from "enzyme";
import { Input } from "reactstrap"
import LabelInputText from "../src/js/LabelInputText";

describe('Display',()=>{
    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<LabelInputText
            placeholder={'placeholder'}
            type={'text'}
            name={'testName'}
            id={'testID'}
            label={'testLabel'}
            className={'testClassName'}
        /> );

    });

    it('The title passed should be displayed', () =>{
        expect(wrapper.find(Input).debug())
            .toBe(
                "<Input innerRef=\"testID\" type=\"text\" name=\"testName\" id=\"testID\" placeholder=\"placeholder\" required={true} />"
            );
    });




});
