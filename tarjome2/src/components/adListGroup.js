import React from "react";
import { ListGroup } from "react-bootstrap";
import AdvertisementListItem from "./advertisementListItem";
import "../index.css";
import GridItem from "../material/GridItem";
import Card from "../material/Card";
import CardBody from "../material/CardBody";
import CardHeader from "../material/CardHeader";

export default class AdListGroup extends React.Component {
  static defaultProps = {
    appliable: true,
    employer: false,
    translator: false,
  };
  render() {
    return (
      <ListGroup>
        {this.props.advertisements.map((item, i) => {
          return (
            <ListGroup.Item className="list-item-container" key={item._id}>
              <AdvertisementListItem
                profile={this.props.profile}
                ad={item}
                setShowModal={this.props.setShowModal}
                setChoosedAdId={this.props.setChoosedAdId}
                appliable={this.props.appliable}
                employer={this.props.employer}
                translator={this.props.translator}
                setStates={this.props.setStates}
              />
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  }
}
