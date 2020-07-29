import React from "react";
import "../index.css";
import strings from "../utils/strings";
import DrawerToggleButton from "./drawerToggleButton";
import { Link } from "react-router-dom";

export default class Toolbar extends React.Component {
  state = {
    toolbarClass:
      this.props.selectedTab === strings.navbar.mainPage
        ? "transparent-toolbar"
        : "toolbar",
    prevScrollpos: window.pageYOffset
  };
  handleToolbarStyle = () => {
    console.log("handle toolabar nav")
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > prevScrollpos) {
      this.setState({
        toolbarClass: "toolbar"
      });
    } else if (this.props.selectedTab === strings.navbar.mainPage) {
      this.setState({
        toolbarClass: "transparent-toolbar"
      });
    }
  };

  componentDidMount = () => {
    this.props.selectedTab === strings.navbar.mainPage && window.addEventListener("scroll", this.handleToolbarStyle);
  };

  componentWillUnmount = () => {
    this.props.selectedTab === strings.navbar.mainPage && window.removeEventListener("scroll", this.handleToolbarStyle);
  };
  render() {
    let toolbar_logo_classes =
      this.props.selectedTab === strings.navbar.profile
        ? "selected-tab toolbar_logo"
        : "toolbar_logo";
    return (
      <header className={this.state.toolbarClass}>
        <nav className="toolbar_navigation">
          <div className="toolbar_toggle_button">
            <DrawerToggleButton click={this.props.drawerToggleClickHandler} />
          </div>
          <div className={toolbar_logo_classes}>
            {this.props.loggedIn ? (
              <Link to="/profile">{strings.navbar.profile}</Link>
            ) : (
              <Link to="/login">{strings.navbar.signup_login}</Link>
            )}
          </div>
          {/* <div className='spacer'/> */}
          <div className="toolbar_navigation_items">
            <ul>
              {this.props.navigationItems.map(item => {
                let classes =
                  item.title === this.props.selectedTab ? "selected-tab" : "";
                return (
                  <li className={classes}>
                    <Link to={item.path} className={classes}>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
