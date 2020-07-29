import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Link, withRouter } from "react-router-dom";
import GridItem from "../material/GridItem";
import Card from "../material/Card";
import CardBody from "../material/CardBody";
import CardHeader from "../material/CardHeader";

class AlertPage extends React.Component {
  goBack = () => {
    this.props.history.goBack();
  };

  title = `تایید ایمیل`;
  text = strings.confirmation.signupExistingUser
  render() {
    return (
      <div className="background center-aligned">
        <GridItem xs={12} sm={12} md={6} className="center-aligned alert-container">
          <Card>
            <CardHeader color="primary" className="center-aligned">
              <h4>{this.props.location.state.title}</h4>
            </CardHeader>
            <CardBody alertClasses={"alert-card"} className="alert-card">
              {this.props.location.state.text}
            </CardBody>
          </Card>
        </GridItem>
      </div>
    );
  }
}

export default withRouter(AlertPage);
