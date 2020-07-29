import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Link } from "react-router-dom";
import Toolbar from "./toolbar";
import SideDrawer from './sideDrawer'
import BackDrop from './Backdrop'
import {navigationItems} from '../utils/configs'

export default class NavigationSystem extends React.Component {
  static defaultProps = {
    navigationItems : navigationItems.notLoggedInNavigationItems,
    loggedIn: false
  }
    state = {
        sideDrawerOpen : this.props.sideDrawerOpen,
      }
      componentWillReceiveProps(nextProps) {
        if (nextProps.sideDrawerOpen !== this.state.sideDrawerOpen) {
          //Perform some operation
          this.setState({ sideDrawerOpen: nextProps.sideDrawerOpen });
        }
      }
  render() { 
    let backDrop;
    if (this.state.sideDrawerOpen) {
      backDrop = <BackDrop backDropClickHandler={this.props.backDropClickHandler} />;
    }
    return (
      <React.Fragment>
        <Toolbar
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          navigationItems = {this.props.navigationItems}
          loggedIn= {this.props.loggedIn}
          selectedTab = {this.props.selectedTab}
        />
        <SideDrawer show={this.state.sideDrawerOpen} navigationItems = {this.props.navigationItems} 
        selectedTab = {this.props.selectedTab}
        />
        {backDrop}
      </React.Fragment>
    );
  }
}
