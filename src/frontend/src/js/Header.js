import React, { Component} from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import "../css/App.css"
import {Link, BrowserRouter as Router} from "react-router-dom";


class Header extends Component{
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    acticeTab(tab){
        const { selected } = this.props;
        if(selected===tab) return "activeTab";

    }

    render(){
        return (
            <Router>
                <Navbar className='header_border' color="light" light expand="md" >
                    <NavbarBrand onClick={() =>  this.props.selection("")}>GUI for NN</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>

                        {
                            (() => {
                                if (localStorage.getItem('loggedIn') === 'true') {
                                    return (
                                        <Nav className="ml-auto" navbar>
                                            <NavItem>
                                               <NavLink className={this.acticeTab('design')} onClick={() =>  this.props.selection("design")}>
                                                   Design
                                               </NavLink>
                                            </NavItem>
                                            <NavItem>
                                               <NavLink className={this.acticeTab('train')} onClick={() =>  this.props.selection("train")}>
                                                   Train
                                               </NavLink>
                                            </NavItem>
                                            <NavItem>
                                               <NavLink className={this.acticeTab('analyse')} onClick={() =>  this.props.selection("analyse")}>
                                                   Analyse
                                               </NavLink>
                                            </NavItem>
                                            <NavItem>
                                               <NavLink className={this.acticeTab('classify')} onClick={() =>  this.props.selection("classify")}>
                                                   Classify
                                               </NavLink>
                                            </NavItem>
                                            <UncontrolledDropdown nav inNavbar>
                                                <DropdownToggle nav caret>
                                                    Settings
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem>
                                                        Contact us
                                                    </DropdownItem>
                                                    <DropdownItem onClick={this.props.logout}>
                                                        <Link to="/">Logout</Link>
                                                    </DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>
                                                        Reset
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </Nav>

                                    )
                                }
                                else {
                                    return (
                                        <Nav className="ml-auto" navbar>
                                            <UncontrolledDropdown nav inNavbar>
                                                <DropdownToggle nav caret>
                                                    Settings
                                                </DropdownToggle>
                                                <DropdownMenu right>
                                                    <DropdownItem>
                                                        Contact us
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </Nav>
                                    )
                                }
                            })()
                        }
                    </Collapse>
                </Navbar>
            </Router>
        );
    }
}

export default Header;
