import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { cardPictures } from "../utils/configs";
import ExplanationCard from "./explanationCard";
import strings from "../utils/strings";
import "../index.css";

export default class CardsContainer extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          {this.props.content.map((item) => {
            return (
              <Col xs={12} sm={12} md={12 / this.props.content.length}>
                <ExplanationCard
                  src={item.src}
                  title={item.title}
                  text={item.text}
                />
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  }
}
