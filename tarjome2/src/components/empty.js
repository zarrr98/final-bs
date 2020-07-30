import React from "react";
import strings from "../utils/strings";
import "../index.css";

export default class Empty extends React.Component {
  static defaultProps = {
    information: strings.emptyAlert.information,
  };

  render() {
    let text = this.props.text
      ? this.props.text
      : `${this.props.information} ${strings.emptyAlert.notExist}`;
    return (
      <h3 className="emty-text margin-top">
       {text}
      </h3>
    );
  }
}
