import React from "react";
import "../index.css";
import strings from "../utils/strings";
import DrawerToggleButton from "./drawerToggleButton";
import { Link } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { StrorageGetItem } from "../utils/configs";

export default class Toolbar extends React.Component {
  // static defaultProps = {
  //   newMessages : false;
  // }
  state = {
    toolbarClass:
      this.props.selectedTab === strings.navbar.mainPage
        ? "transparent-toolbar"
        : "toolbar",
    prevScrollpos: window.pageYOffset,
    //newMessage: this.props.newMessage,
  };
  handleToolbarStyle = () => {
    console.log("handle toolabar nav");
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > prevScrollpos) {
      this.setState({
        toolbarClass: "toolbar",
      });
    } else if (this.props.selectedTab === strings.navbar.mainPage) {
      this.setState({
        toolbarClass: "transparent-toolbar",
      });
    }
  };

  setNewMessage = () => {
    let profile = StrorageGetItem("profile", true);
    // console.log("profile in setnewmessages : ", profile)
    let newMessage = false;
    profile &&
      profile.messages &&
      profile.messages.map((m, i) => {
        console.log("message ", i, " in setnewmessages =>", m);
        if (!m.seen) {
          newMessage = true;
        }
      });
    console.log("and newmessage is :", newMessage);
    return newMessage;
  };
  // componentDidMount = () => {
  //   this.props.selectedTab === strings.navbar.mainPage &&
  //     window.addEventListener("scroll", this.handleToolbarStyle);
  // };

  componentWillUnmount = () => {
    this.props.selectedTab === strings.navbar.mainPage &&
      window.removeEventListener("scroll", this.handleToolbarStyle);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.newMessage !== this.state.newMessage) {
      //Perform some operation
      this.setState({ newMessage: nextProps.newMessage });
    }
  }
  render() {
    //console.log("### this.props.navigationItems : ",this.props.navigationItems)
    let newMessage = this.setNewMessage();
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
              {this.props.navigationItems.map((item) => {
                let classes =
                  item.title === this.props.selectedTab ? "selected-tab" : "";

                let text =
                  newMessage && item.title === strings.navbar.alertMessages ? (
                    <span>
                      <FaCircle className="new-msg-icon" /> {item.title}
                    </span>
                  ) : (
                    item.title
                  );
                return (
                  <li className={classes}>
                    <Link to={item.path} className={classes}>
                      {text}
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
