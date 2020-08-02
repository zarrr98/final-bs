import React from "react";
import "../index.css";
import { Link, withRouter } from "react-router-dom";
import { StrorageGetItem } from "../utils/configs";
import strings from "../utils/strings";
import { FaCircle ,FaBookOpen} from "react-icons/fa";

export default class SideDrawer extends React.Component {
  state = {
    show: this.props.show,
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
    return newMessage;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.state.show) {
      //Perform some operation
      this.setState({ show: nextProps.show });
    }
  }
  render() {
    let drawerClasses = "side-drawer";
    if (this.state.show) {
      drawerClasses = "side-drawer open";
    }
    let newMessage = this.setNewMessage();
    return (
      <nav className={drawerClasses}>
        <FaBookOpen className="icon-in-sidebar"/>
        <ul>
          {this.props.navigationItems.map((item) => {
            let classes =
              item.title === this.props.selectedTab ? "selected-tab" : "";
            let text =
              newMessage && item.title === strings.navbar.alertMessages ? (
                <span>
                  <FaCircle className="new-msg-icon" />{" "}
                  {this.props.getIcon(item.title , true)} {item.title}
                </span>
              ) : (
                <span>
                  {this.props.getIcon(item.title)} {item.title}
                </span>
              );
            return (
              <li className={classes}>
                <Link to={item.path}>{text}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
