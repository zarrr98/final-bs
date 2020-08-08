import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Link } from "react-router-dom";
import Toolbar from "./toolbar";
import SideDrawer from "./sideDrawer";
import BackDrop from "./Backdrop";
import { navigationItems, StrorageGetItem } from "../utils/configs";
import {
  FaCircle,
  FaUserAlt,
  FaRegBell,
  FaUserFriends,
  FaWindowRestore,
  FaHome,
  FaFlag,
  FaSignInAlt,
  FaWarehouse
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

  setNewMessage = () => {
    let profile = StrorageGetItem("profile", true);
    // console.log("profile in setnewmessages : ", profile)
    let newMessage = false;
    profile &&
      profile.messages &&
      profile.messages.map((m, i) => {
        // console.log("message ", i, " in setnewmessages =>", m);
        if (!m.seen) {
          newMessage = true;
        }
      });
    // console.log("and newmessage is :", newMessage);
    //this.setState({ newMessage });
    return newMessage;
  };
  render() {
    let backDrop;
    if (this.state.sideDrawerOpen) {
      backDrop = (
        <BackDrop backDropClickHandler={this.props.backDropClickHandler} />
      );
    }

    let newMessage = this.setNewMessage()
    return (
      <React.Fragment>
        <Toolbar
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          navigationItems={this.props.navigationItems}
          loggedIn={this.props.loggedIn}
          selectedTab={this.props.selectedTab}
          getIcon={this.getIcon}
          newMessage = {newMessage}
        />
        <SideDrawer
          show={this.state.sideDrawerOpen}
          navigationItems={this.props.navigationItems}
          selectedTab={this.props.selectedTab}
          getIcon={this.getIcon}
          newMessage = {newMessage}
        />
        {backDrop}
      </React.Fragment>
    );
  }
}
