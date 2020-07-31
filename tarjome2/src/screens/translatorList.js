import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import Empty from "../components/empty";
import { navigationItems, Fields, Languages } from "../utils/configs";
import { URL } from "../utils/configs";
import { ListGroup } from "react-bootstrap";
import TranslatorListItem from "../components/translatorListItem";
import Load from "../components/load";
import TranslatorListGroup from "../components/translatorListGroup";
import FilterSegment from "../components/filterSegment";
import { FetchData } from "../utils/services";

export default class TranslatorList extends React.Component {
  state = {
    translators: [],
    filteredTranslators: [],
    isLoading: false,
  };

  filterFields = [
    {
      type: "one-row",
      fields: [
        {
          type: "selectoption-append",
          label: strings.filter.languageLabel,
          disabledValue: strings.filter.chooseLang,
          appendText: strings.filter.chooseLang,
          options: [strings.filter.allLanguages, ...Languages],
          name: "languages",
          required: false,
        },
        {
          type: "selectoption-append",
          label: strings.filter.fieldLable,
          disabledValue: strings.filter.chooseField,
          appendText: strings.filter.chooseField,
          options: [strings.filter.allFields, ...Fields],
          name: "fields",
          required: false,
        },
        {
          type: "text-append",
          formType: "text",
          label: strings.filter.searchHereTranslatorTitle,
          placeholder: strings.filter.searchHere,
          name: "name",
        },
      ],
    },
  ];

  filterItems = (values, searchedText) => {
    let translators = this.state.translators;
    for (let key in values) {
      //console.log(key, values[key]);
      translators =
        values[key] !== strings.filter.all
          ? translators.filter((t) =>
              t.translatorFields[key].includes(values[key])
            )
          : translators;
    }
    translators =
      searchedText.trim() !== ""
        ? translators.filter(
            (t) =>
              t.first_name.indexOf(searchedText) !== -1 ||
              t.last_name.indexOf(searchedText) !== -1
          )
        : translators;
    console.log("filtered Translaters : ", translators);
    this.setState({ filteredTranslators: translators });
  };

  

  checkResponseStatus = (response) => {
    if (!response) {
      return;
    } else if (response.status === 200) {
      this.setState({
        translators: response.resolve,
        filteredTranslators: response.resolve,
      });
    }else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    }
  };
  getTranslators = async () => {
    this.setState({ isLoading: true });
    const data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/translators`,
      this.props.profile ? this.props.profile.token : ""
    );
    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
  };
  componentDidMount() {
    this.getTranslators();
  }
  render() {
    console.log("this.state.translators =>>", this.state.filteredTranslators);
    return (
      <div className="background">
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.employerNavigationItems}
          loggedIn={true}
          selectedTab={strings.navbar.translators}
        />
        <main className="main-content">
          <FilterSegment
            className="filter-seg"
            fields={this.filterFields}
            filterItems={this.filterItems}
          />
          {this.state.isLoading ? (
            <Load />
          ) : this.state.filteredTranslators.length > 0 ? (
            <TranslatorListGroup
              translators={this.state.filteredTranslators}
              setCurrentTranslator={this.props.setCurrentTranslator}
              setIsProjectPage={this.props.setIsProjectPage}
            />
          ) : (
            <Empty />
          )}
        </main>
      </div>
    );
  }
}
