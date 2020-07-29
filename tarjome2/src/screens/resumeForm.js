import React from "react";
import "../index.css";
import strings from "../utils/strings";
import { Fields, Languages , URL} from "../utils/configs";
import { Button, Form ,Spinner} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import {PatchData} from '../utils/services'

class ResumeForm extends React.Component {
  state = {
    values: {},
    error: false,
    errorMessage: "",
    isLoading : false
  };
  fields = [
    {
      type: "checkbox",
      label: strings.screens.languageFieldLabel,
      options: Languages,
      name: "languages",
      errorMessage: "",
      required: true,
      validationFunction: value => {
        return !!value && value.length >= 0;
      },
      unvalidMessage: strings.screens.errorEmpty
    },
    {
      type: "selectoption",
      label: `${strings.screens.professionaFields}(${strings.screens.ctrlExplanation})`,
      options: Fields,
      name: "fields",
      required: true,
      validationFunction: value => {
        return !!value && value.length > 0;
      },
      unvalidMessage: strings.screens.errorEmpty
    },
    {
      type: "text",
      formType: "number",
      label: strings.screens.experienceYearsLabel,
      min : 0,
      name: "experienceYears",
      errorMessage: "",
      placeholder: strings.screens.experienceYears,
      required: true,
      validationFunction: value => {
        return value > 0;
      },
      unvalidMessage: strings.screens.notNegativeExperience
    },
    {
      type: "textarea",
      formType: "textarea",
      label: strings.screens.explanation,
      placeholder: strings.screens.explanationPlaceholder,
      name: "explanation",
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
  optionHandleChange = (key, options) => {
    const { values } = this.state;
    console.log("^^^^^ options : ", options);
    let arr = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        arr.push(options[i].value);
      }
    }
    this.setState({
      values: { ...values, [key]: arr },
      error: false,
      errorMessage: ""
    });
    this.setErrorMessage(key, "");
  };
 
  checkboxHandleChange = (key , option , checked) => {
    const { values } = this.state;
    let old = values[key] || []
    console.log('checkboxHandleChange old : ',old)
    let newVal;
    if (checked){
      old.push(option)
      this.setState({
        values: { ...values, [key]: old },
       
      });
    }else{
      newVal = old.filter(item => item !== option)
      this.setState({
        values: { ...values, [key]: newVal },
       
      });
    }
    this.setState({
      error: false,
      errorMessage: ""
    });
    this.setErrorMessage(key, "");

  }

  checkResponseStatus = response => {
    if (!response) {
      this.setState({
        errorMessage: strings.screens.connectionError
      });
    } else if (response.status === 200) {
        console.log("user updated successfully");
        this.props.updateProfile(this.state.values)
        this.props.history.push({
          pathname: "/profile",
        });
    } else if (response.status === 403) {
      this.setState({ errorMessage: strings.screens.AuthFailedError });
    } else if (response.status === 500) {
      this.setState({ errorMessage: strings.screens.connectionError });
    } else {
      this.setState({ errorMessage: strings.screens.connectionError });
    }
  };
  submit = async () => {
    const { values } = this.state;
    const {profile} =  this.props.location.state
    console.log("VALues in submit : ", values ,'and profile is :',profile);
    let error = false;
    this.fields.map((item, i) => {
      if (item.required && !values[item.name]) {
        item.errorMessage = strings.screens.errorEmpty;
        error = true;
      } else if (item.validationFunction) {
        console.log("1 true for ", item.name);
        if (!item.validationFunction(values[item.name])) {
          console.log("2 true for ", item.name);
          item.errorMessage = item.unvalidMessage;
          error = true;
        }
      }
    });
    this.setState({
      error
    });
    if (!error) {
      console.log("Everything is ok in resumeform : ", values);
      let sendData = [{propName : 'translatorFields' , value : values}]
      this.setState({ isLoading: true });
      const data = await PatchData(`${URL.protocol}://${URL.baseURL}:${URL.port}/users`, sendData , profile.token);
      this.setState({ isLoading: false });
      this.checkResponseStatus(data);
    }
  };

  render() {
    return (
      <div className="resume-gray-body">
        <Form className="signup-container" autocomplete="off">
          <h4 className="account-title">{strings.screens.resumeFormTitle}</h4>
          <hr />
          {this.fields.map((item, i) => {
            if (item.type === "text") {
              return (
                <Form.Group className="margin-top" key={item.name}>
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <Form.Control
                    type={item.formType}
                    placeholder={item.placeholder}
                    onChange={e => this.handleChange(item.name, e.target.value)}
                    value={this.state.values[item.name]}
                    min = {item.min}
                  />
                  {this.state.error ? (
                    <Form.Text className="text-danger">
                      {item.errorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              );
            } else if (item.type === "checkbox") {
              return (
                <Form.Group key={item.name}>
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <div className="checkbox-container">
                    {item.options.map(option => (
                      <Form.Check
                        key={option}
                        type="checkbox"
                        label={option}
                        onChange={(e) =>
                          this.checkboxHandleChange(item.name, option , e.target.checked)
                        }
                      />
                    ))}
                  </div>
                  {this.state.error ? (
                    <Form.Text className="text-danger">
                      {item.errorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              );
            } else if (item.type === "selectoption") {
              return (
                <Form.Group key={item.name}>
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <Form.Control
                    as="select"
                    multiple
                    onChange={e =>
                      this.optionHandleChange(item.name, e.target.options)
                    }
                  >
                    {item.options.map(field => (
                      <option key={field}>{field}</option>
                    ))}
                  </Form.Control>
                  {this.state.error ? (
                    <Form.Text className="text-danger">
                      {item.errorMessage}
                    </Form.Text>
                  ) : null}
                </Form.Group>
              );
            } else if (item.type === "textarea") {
              return (
                <Form.Group key={item.name}>
                  {item.label ? <Form.Label>{item.label}</Form.Label> : null}
                  <Form.Control
                    as="textarea"
                    rows="3"
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
          <Button onClick={this.submit} disabled={this.state.isLoading ? true : false}
          >
            {this.state.isLoading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null} {strings.screens.submit}</Button>
          <div className="margin-top">
            <p className="error-msg">{this.state.errorMessage}</p>
          </div>
        </Form>
      </div>
    );
  }
}

export default withRouter(ResumeForm);
