import React from "react";
import "../index.css";
import { Link, withRouter } from "react-router-dom";

export default class SideDrawer extends React.Component {
  state = {
    show: this.props.show
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
    return (
      <nav className={drawerClasses}>
        <ul>
          {this.props.navigationItems.map(item => {
            let classes = item.title === this.props.selectedTab ? 'selected-tab' : '';
            return (
              <li className = {classes}>
                <Link to={item.path}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
