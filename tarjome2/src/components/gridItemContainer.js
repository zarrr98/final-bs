import React from "react";
import GridItem from "../material/GridItem";
import Card from "../material/Card";
import CardBody from "../material/CardBody";
import CardHeader from "../material/CardHeader";
import strings from "../utils/strings";
import "../index.css";
import CardsContainer from "./cardsContainer";

export default class GridItemContainer extends React.Component {
  static defaultProps = {
    cardContent : false,
  }
  render() {
    return ( 
      <GridItem xs={12} sm={12} md={12} className="right-aligned ">
        <Card className = 'extra-margin-top'>
          <CardHeader color="primary" className="center-aligned">
            <h4>{this.props.title}</h4>
          </CardHeader>
          <CardBody>
            {this.props.cardContent ? <CardsContainer content = {this.props.content}/> : null}
          </CardBody>
        </Card>
      </GridItem>
    );
  }
}
