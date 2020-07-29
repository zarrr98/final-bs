import React from "react";
import { Card } from "react-bootstrap";
import '../index.css'

export default class ExplanationCard extends React.Component {
  render() {
    return (
      <Card className='right-aligned extra-margin-top' style={{border : 'none'}}>
        <Card.Img variant="top" src={this.props.src} className='card-image'/>
        <Card.Body >
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>{this.props.text}</Card.Text>
          {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
      </Card>
    );
  }
}
