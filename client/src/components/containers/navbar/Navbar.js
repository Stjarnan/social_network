import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { logOut } from "../../../redux/actions/authActions";
import { clearProfile } from "../../../redux/actions/profileActions";

import "./Navbar.css";

class Navbar extends Component {
  state = {
    toggle: false
  };

  onLogout = e => {
    e.preventDefault();
    this.setState({
      toggle: !this.state.toggle
    });
    this.props.clearProfile();
    this.props.logOut();
  };

  onToggle = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

  onNavLinkClick = () => {
    this.setState({
      toggle: false
    });
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    const toggleMenu = (
      <div className="toggleMenu">
        {this.state.toggle ? (
          <svg
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
            onClick={this.onToggle}
          >
            <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z" />
            <path d="M0 0h48v48h-48z" fill="none" />
          </svg>
        ) : (
          <svg
            fill="#000000"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={this.onToggle}
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        )}
      </div>
    );

    const loggedInLinks = (
      <nav className="loggedIn">
        <ul>
          <Link onClick={this.onNavLinkClick} to="/dashboard">
            <li>Dashboard</li>
          </Link>

          <Link onClick={this.onNavLinkClick} to="/feed">
            <li>Feed</li>
          </Link>
          <a href="" onClick={this.onLogout}>
            <li>Log Out </li>
          </a>
        </ul>
      </nav>
    );

    const notLoggedInLinks = (
      <nav>
        <ul>
          <Link to="/">
            <li>Sign In</li>
          </Link>

          <Link to="/register">
            <li>Sign Up</li>
          </Link>
        </ul>
      </nav>
    );

    return (
      <header>
        {!this.state.toggle ? (
          <div className="logoNtitle">
            <h1>Social Network</h1>
          </div>
        ) : null}
        {isAuthenticated ? toggleMenu : notLoggedInLinks}
        {this.state.toggle ? loggedInLinks : null}
      </header>
    );
  }
}

Navbar.propTypes = {
  logOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logOut, clearProfile }
)(Navbar);
