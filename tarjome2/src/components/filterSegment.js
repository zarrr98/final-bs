import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Link, withRouter } from "react-router-dom";
import GridItem from "../material/GridItem";
import Card from "../material/Card";
import CardBody from "../material/CardBody";
import CardHeader from "../material/CardHeader";
import { InputGroup, FormControl, Form } from "react-bootstrap";
import { Fields, Languages } from "../utils/configs";
import { FaSearch } from "react-icons/fa";

class FilterSegment extends React.Component {
  goBack = () => {
    this.props.history.goBack();
  };

  state = {
    values: {},
    searchedText: "",
  };

  title = `جست و جو کنید`;
  text = strings.confirmation.signupExistingUser;

  optionHandleChange = (key, value, allOptions) => {
    let { values } = this.state;
    console.log("**** ", value[value.selectedIndex].label, value.selectedIndex);
    if (value.selectedIndex === 1) {
      //all the oprions
      this.setState(
        {
          values: { ...values, [key]: strings.filter.all },
        },
        () => {
          this.props.filterItems(this.state.values, this.state.searchedText);
        }
      );
    } else {
      let selectedOption = value[value.selectedIndex].label;

      this.setState(
        {
          values: { ...values, [key]: selectedOption },
        },
        () => {
          this.props.filterItems(this.state.values, this.state.searchedText);
        }
      );
    }
  };

  handleChange = (key, e) => {
    const { values } = this.state;
    this.setState({ searchedText: e });

    this.props.filterItems(values, e);
  };

  render() {
    return (
      // <div className="filter-card filter-seg">
      <GridItem xs={12} sm={12} md={12} className="center-aligned ">
        <Card>
          <CardHeader color="primary" className="center-aligned">
            <h4>{this.title}</h4>
          </CardHeader>
          <CardBody>
            {this.props.fields.map((item) => {
              if (item.type === "one-row") {
                return (
                  <React.Fragment>
                    <Form.Row className="buttons-container">
                      {item.fields.map((rowF) => {
                        if (rowF.type === "selectoption-append") {
                          return (
                            <Form.Group
                              key={rowF.name}
                              className="margin-right"
                            >
                              {rowF.label ? (
                                <Form.Label>{rowF.label}</Form.Label>
                              ) : null}
                              <InputGroup className="mb-3">
                                <InputGroup.Append>
                                  <InputGroup.Text>
                                    {rowF.appendText}
                                  </InputGroup.Text>
                                </InputGroup.Append>
                                <Form.Control
                                  as="select"
                                  onChange={(e) =>
                                    this.optionHandleChange(
                                      rowF.name,
                                      e.target.options,
                                      rowF.options
                                    )
                                  }
                                >
                                  {rowF.disabledValue ? (
                                    <option key={rowF.disabledValue} disabled>
                                      {rowF.disabledValue}
                                    </option>
                                  ) : null}
                                  {rowF.options.map((field) => (
                                    <option key={field}>{field}</option>
                                  ))}
                                </Form.Control>
                              </InputGroup>
                            </Form.Group>
                          );
                        } else if (rowF.type === "text-append") {
                          return (
                            <Form.Group
                              key={rowF.name}
                              className="margin-right"
                            >
                              {rowF.label ? (
                                <Form.Label>{rowF.label}</Form.Label>
                              ) : null}
                              <InputGroup>
                                <Form.Control
                                  type={rowF.formType}
                                  placeholder={rowF.placeholder}
                                  onChange={(e) =>
                                    this.handleChange(rowF.name, e.target.value)
                                  }
                                  value={this.state.searchedText}
                                  min={rowF.min}
                                />
                                <InputGroup.Append>
                                  <InputGroup.Text className="white-bg">
                                    <FaSearch />
                                  </InputGroup.Text>
                                </InputGroup.Append>
                              </InputGroup>
                            </Form.Group>
                          );
                        }
                      })}
                    </Form.Row>
                  </React.Fragment>
                );
              }
            })}
          </CardBody>
        </Card>
      </GridItem>
      // </div>
    );
  }
}

export default withRouter(FilterSegment);
