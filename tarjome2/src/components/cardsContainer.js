import React from "react";
import ReactDOM from "react-dom";
import { Container, Row, Col } from "react-bootstrap";
import { cardPictures } from "../utils/configs";
import ExplanationCard from "./explanationCard";
import strings from "../utils/strings";
import "../index.css";

export default class CardsContainer extends React.Component {
  state = {
    items: [],
  };
  isElementInViewport = (el) => {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  callbackFunc = () => {
    let { items } = this.state;
    for (var i = 0; i < items.length; i++) {
      if (this.isElementInViewport(items[i])) {
        if (!items[i].classList.contains("in-view")) {
          items[i].classList.add("in-view");
        }
      }
      //  else if (items[i].classList.contains("in-view")) {
      //   items[i].classList.remove("in-view");
      // }
    }
  };

  componentDidMount = () => {
    let node = ReactDOM.findDOMNode(this);
    console.log("items:", node.querySelectorAll(".landig-animated-items li"));
    this.setState({
      items: node.querySelectorAll(".landig-animated-items li"),
    });

    window.addEventListener("load", this.callbackFunc);
    window.addEventListener("scroll", this.callbackFunc);
  };
  render() {
    return (
      // <Container>
      //   <Row>
      //     {this.props.content.map((item) => {
      //       return (
      //         <Col xs={12} sm={12} md={12 / this.props.content.length}>
      //           <ExplanationCard
      //             src={item.src}
      //             title={item.title}
      //             text={item.text}
      //           />
      //         </Col>
      //       );
      //     })}
      //   </Row>
      // </Container>
      <section className="landig-animated-items">
        <ul>
          {this.props.content.map((item) => {
            return (
              <li>
                <div>
                  <time>{item.title}</time>
                  <ExplanationCard src={item.src} title={""} text={item.text} />
                  {/* <div className="discovery">
                    <h1>Discovery</h1>
                    <p>Laws of motion</p>
                  </div>
                  <div className="scientist">
                    <h1>Scientist</h1>
                    <span>Newton</span>
                  </div>*/}
                </div> 
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
}
