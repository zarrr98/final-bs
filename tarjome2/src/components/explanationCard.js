import React from "react";
import { Card } from "react-bootstrap";
import "../index.css";

export default class ExplanationCard extends React.Component {
  render() {
    return (
      // <div>

      //   <img src={this.props.src} className="discovery card-image"/>
      //   <div className="scientist">

      //     <span>{this.props.text}</span>
      //   </div>
      // </div>
      <Card
        className="right-aligned"
        style={{ border: "none" }}
      >
        <Card.Img variant="top" src={this.props.src} className="card-image" />
        {/* <img src={this.props.src} className="card-image" alt = "some pic :("/> */}
        <Card.Body>
          {/* <Card.Title>{this.props.title}</Card.Title> */}
          <Card.Text>{this.props.text}</Card.Text>
          {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
      </Card>
    );
  }
}
