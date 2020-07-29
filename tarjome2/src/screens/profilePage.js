import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import { navigationItems } from "../utils/configs";
import ProfileCard from "../components/profileCard";
import { withRouter } from "react-router-dom";

class ProfilePage extends React.Component {
 
  render() {
    
    return (
      <React.Fragment>
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.employerNavigationItems}
          loggedIn={true}
          selectedTab = {this.props.location.state.projectPage ? strings.navbar.profile : strings.navbar.translators}
        />

        <div className="color-behind-profile">
          <div style={{ width: "60%", height: "140px" }}></div>
          <ProfileCard profile={this.props.location.state.profile} dashboard = {false}/>
         
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ProfilePage);