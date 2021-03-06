import React, { Component } from "react";
import PropTypes from "prop-types";

// Custom Components
import Field from "../../formComponents/fields/Field";
import "./Register.css";

// For use with Redux
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../../redux/actions/authActions";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: ""
  };

  onInputChange = evt => {
    const state = Object.assign({}, this.state);
    state[evt.target.name] = evt.target.value;
    this.setState(state);
  };

  onSubmit = evt => {
    evt.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    // This function comes from the store -> authActions.js
    // It receives:
    // User data needed to create a user (from register form)
    // Routehistory to be able to handle redirects
    this.props.registerUser(user, this.props.history);
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <main className="signUp">
        <form onSubmit={this.onSubmit}>
          <Field
            type="text"
            id="name"
            placeholder="Name"
            name="name"
            value={this.state.name}
            onChange={this.onInputChange}
          />
          <Field
            type="text"
            id="email"
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.onInputChange}
          />
          <Field
            type="password"
            id="password"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.onInputChange}
          />
          <div>
            <input className="signUpButton" value="Sign Up" type="submit" />
          </div>
        </form>
      </main>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
