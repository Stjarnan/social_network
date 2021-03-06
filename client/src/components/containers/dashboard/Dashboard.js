import React, { Component } from "react";
import PropTypes from "prop-types";
import Loader from "../../loader/Loader";
import { Link } from "react-router-dom";

import DashboardNavbar from "./dashboardNavbar/DashboardNavbar";
import Experience from "./experience/Experience";

import "./Dashboard.css";

// Redux
import { connect } from "react-redux";
import {
  getProfile,
  deleteAccount
} from "../../../redux/actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getProfile();
  }

  onDeleteAccount = () => {
    if (window.confirm("Are you sure? This action can not be undone!")) {
      this.props.deleteAccount();
    }
  };

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) {
      dashboardContent = <Loader />;
    } else if (profile.noprofile) {
      dashboardContent = (
        <div>
          <span>{user.name} has no profile</span>
          <Link to="/createprofile">Create a Profile</Link>
        </div>
      );
    } else {
      dashboardContent = (
        <div className="dashboardMain">
          <h3>
            Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link>
          </h3>
          <DashboardNavbar />
          <Experience experience={profile.experience} />
          <button className="deleteAccount" onClick={this.onDeleteAccount}>
            Delete Account
          </button>
        </div>
      );
    }

    return <div>{dashboardContent}</div>;
  }
}

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfile, deleteAccount }
)(Dashboard);
