import React, { Component} from "react";
import {Label, Input} from "reactstrap";



    class LabelInputText extends Component{
        constructor(props) {
            super(props);
        }

        render(){

            const {
                placeholder,
                type,
                name,
                id,
                label,
                className
            } = this.props;

            return(
                <div className={className + " my-3"}>
                    <Label for={id}> {label} </Label>
                    <Input
                        innerRef={id}
                        type={type}
                        name={name}
                        id={id}
                        placeholder={placeholder}
                        required
                    />
                </div>
            );
        }
    }

    export default LabelInputText;




