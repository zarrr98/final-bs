import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Link } from "react-router-dom";
import Toolbar from "./toolbar";
import SideDrawer from "./sideDrawer";
import BackDrop from "./Backdrop";
import { navigationItems } from "../utils/configs";
import {
  FaCircle,
  FaUserAlt,
  FaRegBell,
  FaUserFriends,
  FaWindowRestore,
  FaHome,
  FaFlag,
  FaSignInAlt,
} from "react-icons/fa";

export default class NavigationSystem extends React.Component {
  static defaultProps = {
    navigationItems: navigationItems.notLoggedInNavigationItems,
    loggedIn: false,
  };
  state = {
    sideDrawerOpen: this.props.sideDrawerOpen,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.sideDrawerOpen !== this.state.sideDrawerOpen) {
      //Perform some operation
      this.setState({ sideDrawerOpen: nextProps.sideDrawerOpen });
    }
  }
  getIcon = (title , newMessage) => {
    if (title === strings.navbar.alertMessages) {
      let classes = newMessage ? "orange-icon" : ""
      return <FaRegBell className={classes}/>;
    } else if (title === strings.navbar.profile) {
      return <FaUserAlt />;
    } else if (title === strings.navbar.translators) {
      return <FaUserFriends />;
    } else if (title === strings.navbar.advertisements) {
      return <FaWindowRestore />;
    } else if (title === strings.navbar.mainPage) {
      return <FaHome />;
    } else if (title === strings.navbar.help) {
      return <FaFlag />;
    } else if (title === strings.navbar.signup_login) {
      return <FaSignInAlt />;
    } else return null;
  };
  render() {
    let backDrop;
    if (this.state.sideDrawerOpen) {
      backDrop = (
        <BackDrop backDropClickHandler={this.props.backDropClickHandler} />
      );
    }
    return (
      <React.Fragment>
        <Toolbar
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          navigationItems={this.props.navigationItems}
          loggedIn={this.props.loggedIn}
          selectedTab={this.props.selectedTab}
          getIcon={this.getIcon}
        />
        <SideDrawer
          show={this.state.sideDrawerOpen}
          navigationItems={this.props.navigationItems}
          selectedTab={this.props.selectedTab}
          getIcon={this.getIcon}
        />
        {backDrop}
      </React.Fragment>
    );
  }
}
