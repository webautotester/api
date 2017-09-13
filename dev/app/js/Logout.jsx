import React from 'react';
import {isLoggedIn, logout} from './AuthService.js';
import { Redirect } from 'react-router-dom';

export default class Logout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        redirect : false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    var logged = logout();
    this.setState( prevState => {
        return {
          redirect : !logged,
        };
      });
  }

  render() {
    if (this.state.redirect) {
        return <Redirect to="/"/>;
    }
    else {
        if (isLoggedIn()) {
            return (<a onClick={this.handleClick}> Loggout ? </a>)
        } else {
            return (
                <div> Not logged </div>
            );
        }
    }
  }
}
