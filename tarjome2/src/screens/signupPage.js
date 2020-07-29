import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { URL } from "../utils/configs";
import { ButtonGroup, Button, Form, Spinner } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { PutData } from "../utils/services";

class SignupPage extends React.Component {
  state = {
    values: {},
    error: false,
    errorMessage: "",
    isLoading: false
  };
  fields = [
    {
      type: "radio-button",
      label: strings.screens.registerAs,
      options: [strings.screens.employer, strings.screens.translator],
      name: "role",
      errorMessage: "",
      required: true
    },
    {
      type: "text",
      formType: "text",
      placeholder: strings.screens.name,
      controlId: "formName",
      name: "first_name",
      errorMessage: "",
      required: true
    },
    {
      type: "text",
      formType: "text",
      placeholder: strings.screens.familyName,
      controlId: "formFamilyName",
      name: "last_name",
      errorMessage: "",
      required: true
    },
    {
      type: "text",
      formType: "email",
      placeholder: strings.screens.email,
      controlId: "formEmail",
      name: "email",
      errorMessage: "",
      required: true,
      validationFunction: value => /(.+)@(.+){2,}\.(.+){2,}/.test(value),
      unvalidMessage: strings.screens.invalidEmailError
    },
    {
      type: "text",
      formType: "password",
      placeholder: strings.screens.password,
      controlId: "formPassword",
      name: "password",
      errorMessage: "",
      required: true
    }
  ];

  setErrorMessage = (name, msg) => {
    this.fields.map(item => {
      if (item.name === name) {
        item.errorMessage = msg;
      }
    });
  };

  handleChange = (key, e) => {
    const { values } = this.state;
    this.setState({
      values: { ...values, [key]: e },
      error: false,
      errorMessage: ""
    });
    this.setErrorMessage(key, "");
  };
  checkResponseStatus = response => {
    if (!response) {
      this.setState({
        errorMessage: strings.screens.connectionError
      });
    } else if (response.status === 200) {
      this.props.history.push({
        pathname: "/alert",
        state: {
          title: strings.confirmation.title,
          text : strings.confirmation.signupNewUser,
        }
      });
      
    }else if (response.status === 202){
      this.props.history.push({
        pathname: "/alert",
        state: {
          title: strings.confirmation.title,
          text : strings.confirmation.signupExistingUser,
        }
      });
     
    }
    
    else if (response.status === 409) {
      this.setState({ errorMessage: strings.screens.duplicatedEmailError });
    } else if (response.status === 500) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else {
      this.setState({ errorMessage: strings.screens.connectionError });
    }
  };

  submit = async () => {
    const { values } = this.state;
    let error = false;
    this.fields.map((item, i) => {
      if (item.required && !values[item.name]) {
        item.errorMessage = strings.screens.errorEmpty;
        error = true;
      } else if (item.validationFunction) {
        if (!item.validationFunction(values[item.name])) {
          item.errorMessage = item.unvalidMessage;
          error = true;
        }
      }
    });
    this.setState({
      error
    });
    if (!error) {
      this.setState({ isLoading: true });
      const data = await PutData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/adduser`,
        values
      );
      this.setState({ isLoading: false });
      this.checkResponseStatus(data);
    }
  };

  render() {
    return (
      <div className="gray-body">
        <Form className="signup-container" autocomplete="off">
          <h3 className="account-title">{strings.screens.createAccount}</h3>
          <hr />
          {this.fields.map((item, i) => {
            if (item.type === "radio-button") {
              return (
                <React.Fragment>
                  <label>{item.label}</label>
                  <ButtonGroup className="mr-2" aria-label="First group">
                    {item.options.map(option => (
                      <Button
                        className="radio-button"
                        active={
                          this.state.values[item.name] === option ? true : false
                        }
                        onClick={() => this.handleChange(item.name, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {this.state.error ? (
                    <p className="error-msg">{item.errorMessage}</p>
                  ) : null}
                </React.Fragment>
              );
            } else if (item.type === "text") {
              return (
                <Form.Group controlId={item.controlId} className="margin-top">
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <Form.Control
                    type={item.formType}
                    placeholder={item.placeholder}
                    onChange={e => this.handleChange(item.name, e.target.value)}
                    value={this.state.values[item.name]}
                  />
                  {this.state.error ? (
                    <Form.Text className="text-danger">
                      {item.errorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              );
            }
          })}
          <Button
            onClick={this.submit}
            disabled={this.state.isLoading ? true : false}
          >
            {this.state.isLoading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            {strings.screens.register}
          </Button>
          <p className="margin-top">
            <p className="error-msg">{this.state.errorMessage}</p>
            {strings.screens.haveAccount}
            <Link to="/login">{strings.screens.comein}</Link>
          </p>
        </Form>
      </div>
    );
  }
}

export default withRouter(SignupPage);
