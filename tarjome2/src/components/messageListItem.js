import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import strings from "../utils/strings";
import {
  withRouter,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { StorageSetItem, StrorageGetItem } from "../utils/configs";
import { FaCircle, FaCommentDots } from "react-icons/fa";

class MessageListItem extends React.Component {
  state = {
    cost: null,
  };
  showMessages = () => {
    let { _id } = this.props.message;
    this.props.history.push({
      pathname: `/messages/${_id}`,
    });
  };

  render() {
    let CardClasses = "translator-list-item-card ";
    if (this.props.hoverable) {
      CardClasses += "hoverable-list-item";
    }
    return (
      <div>
        <Card
          className={CardClasses}
          onClick={this.props.hoverable ? this.showMessages : () => {}}
        >
          <Card.Body>
            <Card.Title>
              {!this.props.message.seen ? (
                <span>
                  <FaCircle className="new-msg-icon" />
                </span>
              ) : null}
            </Card.Title>
            <Card.Text className="purple-txt" as={"h5"}>
              <FaCommentDots />
              {" "}
              {this.props.message.topic}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default withRouter(MessageListItem);
