import React, { Component } from "react";
import PropTypes from "prop-types";
import Loader from "../../loader/Loader";
// Redux
import { connect } from "react-redux";
import { getProfile } from "../../../redux/actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    console.log(profile);
    if (profile === null || loading) {
      dashboardContent = <Loader />;
    } else if (!profile.noprofile) {
      dashboardContent = <span>Profile showing here</span>;
    } else {
      dashboardContent = <span>{user.name} has no profile</span>;
    }

    return <div>{dashboardContent}</div>;
  }
}

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfile }
)(Dashboard);
