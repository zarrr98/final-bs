import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { ButtonGroup, Button, Form, Spinner } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { URL } from "../utils/configs";
import {FetchData} from '../utils/services'

class LoginPage extends React.Component {
  state = {
    values: {},
    error: false,
    errorMessage: "",
    isLoading: false
  };
  fields = [
    {
      type: "text",
      formType: "email",
      placeholder: strings.screens.email,
      controlId: "formEmail1",
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
      controlId: "formPassword1",
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
      values: { ...values, [key]: e.target.value },
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
      this.props.setProfile(response.resolve);
      if (
        response.resolve.role === strings.screens.translator &&
        !response.resolve.translatorFields
      ) {
        this.props.history.push({
          pathname: "/fillResume",
          state: {
            profile: response.resolve
          }
        });
      } else {
        this.props.history.push({
          pathname: "/profile"
        });
      }
    }else if (response.status === 201){
      //badan bayad bere be oon safe he!! felan:
      //this.setState({ errorMessage: 'هستی ولی تایید نکردی. برو تایید کن. ارسال شد' });
      this.props.history.push({
        pathname: "/alert",
        state: {
          title: strings.confirmation.title,
          text : strings.confirmation.loginUserNotConfirmed,
        }
      });
    }
    
    else if (response.status === 403) {
      this.setState({ errorMessage: strings.screens.wrongEmailOrPass });
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
      const data = await FetchData(
        `${URL.protocol}://${URL.baseURL}:${URL.port}/users/${values["email"]}/${values["password"]}`
      );
      this.setState({ isLoading: false });
      this.checkResponseStatus(data);
    }
  };
  render() {
    return (
      <div className="gray-body">
        <Form className="signup-container" autocomplete="off">
          <h3 className="account-title">{strings.screens.welcome}</h3>

          {this.fields.map((item, i) => {
            if (item.type === "text") {
              return (
                <Form.Group controlId={item.controlId} className="margin-top">
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <Form.Control
                    type={item.formType}
                    placeholder={item.placeholder}
                    onChange={e => this.handleChange(item.name, e)}
                    value={this.state.values[item.name]}
                    autoComplete={"on"}
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
            {strings.screens.login}
          </Button>

          <p className="margin-top">
            <p className="error-msg">{this.state.errorMessage}</p>
            {strings.screens.notHaveAccount}
            <Link to="/signup">{strings.screens.registerNow}</Link>
          </p>
        </Form>
      </div>
    );
  }
}

export default withRouter(LoginPage);
