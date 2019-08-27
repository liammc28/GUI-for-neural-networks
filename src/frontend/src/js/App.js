import React, { Component} from "react";
import "../css/button.css";
import "../css/App.css";
import {hot} from "react-hot-loader";
import {BrowserRouter as Router, Link, Redirect, Route} from 'react-router-dom';
import Header from "./Header";
import Display from "./Display"
import Cookies from "universal-cookie";

const cookies = new Cookies();

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleDisplay = this.handleDisplay.bind(this);

    }
    componentDidMount(){
        if( cookies.get("user_id")===undefined){
            localStorage.setItem("loggedIn",JSON.stringify(false));
        }
    }
    handleDisplay(input) {
        this.setState({
            text : input
        })
    }
    async handleLogout() {
        await localStorage.setItem("loggedIn",JSON.stringify(false));
        cookies.remove("user_id");
        this.setState({
            text : ""
        })
    }
    render(){
        return (
            <Router>
                <div className="app max-height background_color">
                    <Header

                        selection = {this.handleDisplay}
                        logout={this.handleLogout}
                        session={localStorage.getItem("loggedIn")}
                        selected={ this.state.text}
                    />
                    <Display
                        className=''
                        login={this.handleDisplay}
                        text={this.state.text}
                    />
                </div>
            </Router>
        );
    }
}

export default hot(module)(App);
