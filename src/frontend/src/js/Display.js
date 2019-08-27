import React, { Component} from "react";
import {Link, Redirect, Route, BrowserRouter as Router} from 'react-router-dom';
import Verify from "./Verify";
import NewUser from "./NewUser";
import LandingPage from "./LandingPage";
import Design from "./Design"
import Train from "./Train";
import Classify from "./Classify"
import Analyse from "./Analyse";
import Home from "./Home";


class Display extends Component{
    constructor(props) {
        super(props);
        this.state= {
            display: this.props.text
        };
        this.handleDisplay = this.handleDisplay.bind(this);
    }

    handleDisplay(display){
        this.props.login(display);
    }
    capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        if (localStorage.getItem('loggedIn') === 'true') {
            if (this.props.text === 'newUserDetails') {
                return (
                    <NewUser handler={this.handleDisplay } />
                )
            }
            if(this.props.text ===''){
               return (
                   <Home
                   name={this.capitalize(localStorage.getItem("first_name"))}/>
               )
            }
            if (this.props.text === 'design') {
                return (
                        <Design/>
                )
            }
            if (this.props.text === 'train') {
                return (
                        <Train/>
                )
            }
            if (this.props.text === 'analyse') {
                return (
                        <Analyse/>
                )
            }
            if (this.props.text === 'classify') {
                return (
                        <Classify/>
                )
            }

        }
        else{
            const {className } = this.props;
            return (
                <Router>
                    <div className={className}>
                        <Route exact={true} path="/"
                               render={() => <LandingPage className={className} updateDisplay={this.handleDisplay}/>}/>
                        <Route exact={true} path="/verify/:id"
                               render={(props) => <Verify handler={this.handleDisplay } {...props}/>}/>
                    </div>
                </Router>

            )

        }
    }
}
export default Display;
