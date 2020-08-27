import React from "react";
import "../index.css";
import strings from "../utils/strings";
import NavigationSystem from "../components/navigationSystem";
import Empty from "../components/empty";
import { navigationItems } from "../utils/configs";
import { URL } from "../utils/configs";
import { ListGroup } from "react-bootstrap";
import AdvertisementListItem from "../components/advertisementListItem";
import ApplyToAdModal from "../components/applyToAdModal";
import Load from "../components/load";
import AdListGroup from "../components/adListGroup";
import FilterSegment from "../components/filterSegment";
import { FetchData } from "../utils/services";

export default class AdvertisementList extends React.Component {
  state = {
    advertisements: [],
    filteredAdvertisements: [],
    showModal: false,
    choosedAdId: "",
    isLoading: false,
  };

  setFilteredAdvertisements = (filteredAdvertisements) => {
    this.setState({ filteredAdvertisements });
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
          options: [
            strings.filter.allLanguages,
            ...this.props.profile.translatorFields.languages,
          ],
          name: "language",
          required: false,
        },
        {
          type: "selectoption-append",
          label: strings.filter.fieldLable,
          disabledValue: strings.filter.chooseField,
          appendText: strings.filter.chooseField,
          options: [
            strings.filter.allFields,
            ...this.props.profile.translatorFields.fields,
          ],
          name: "field",
          required: false,
        },
        {
          type: "text-append",
          formType: "text",
          label: strings.filter.searchHereAdTitle,
          placeholder: strings.filter.searchHere,
          name: "name",
        },
      ],
    },
  ];

  filterItems = (values, searchedText) => {
    let advertisements = this.state.advertisements;
    for (let key in values) {
      //console.log(key, values[key]);
      advertisements =
        values[key] !== strings.filter.all
          ? advertisements.filter(
              (a) =>
                (key === "field" && a[key] === values[key]) ||
                (key === "language" &&
                  (a.origin_lang === values[key] ||
                    a.target_lang === values[key]))
            )
          : advertisements;
    }

    advertisements = searchedText.trim() !== ""
    ? advertisements.filter(
        (a) =>
          a.title.indexOf(searchedText) !== -1 
      )
    : advertisements;
    console.log("filtered advertisements : ", advertisements);
    this.setState({ filteredAdvertisements: advertisements });
  };

  setShowModal = (val) => {
    this.setState({ showModal: val });
  };

  setChoosedAdId = (id) => {
    this.setState({ choosedAdId: id });
  };
  checkResponseStatus = (response) => {
    if (!response) {
      return;
    } else if (response.status === 200) {
      this.setState({
        advertisements: response.resolve,
        filteredAdvertisements: response.resolve,
      });
    } else if (response.status === 413) {
      this.props.setProfile(null);

      window.location = "/";
      localStorage.removeItem("profile");
    }
  };
  getAdvertisements = async () => {
    this.setState({ isLoading: true });
    const data = await FetchData(
      `${URL.protocol}://${URL.baseURL}:${URL.port}/${URL.path}/advertisements`,
      this.props.profile ? this.props.profile.token : ""
    );
    this.setState({ isLoading: false });
    this.checkResponseStatus(data);
  };
  componentDidMount() {
    this.getAdvertisements();
  }
  render() {
    console.log(
      "this.state.advertisements =>>",
      this.state.filteredAdvertisements
    );
    return (
      <div className="background">
        <NavigationSystem
          backDropClickHandler={this.props.backDropClickHandler}
          drawerToggleClickHandler={this.props.drawerToggleClickHandler}
          sideDrawerOpen={this.props.sideDrawerOpen}
          navigationItems={navigationItems.translatorNavigationItems}
          loggedIn={true}
          selectedTab={strings.navbar.advertisements}
        />
        <main className="main-content">
          <FilterSegment
            className="filter-seg"
            fields={this.filterFields}
            filterItems={this.filterItems}
          />
          {this.state.isLoading ? (
            <Load />
          ) : this.state.filteredAdvertisements.length > 0 ? (
            <AdListGroup
              advertisements={this.state.filteredAdvertisements}
              setShowModal={this.setShowModal}
              setChoosedAdId={this.setChoosedAdId}
            />
          ) : (
            <Empty />
          )}
        </main>
        <ApplyToAdModal
          showModal={this.state.showModal}
          setShowModal={this.setShowModal}
          profile={this.props.profile}
          choosedAdId={this.state.choosedAdId}
          setProfile = {this.props.setProfile}
        />
      </div>
    );
  }
}
