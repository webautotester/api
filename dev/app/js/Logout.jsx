import React from 'react';
import {isLoggedIn, logout} from './authenticationService.js';
import { Redirect } from 'react-router-dom';

import { Button, Alert} from 'react-bootstrap';

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
		logout()
			.then( (response) => {
				//console.log(response);
				this.setState( () => {
					return {
						redirect : true,
					};
				});
			})
			.catch(err => {
				//console.log(err);
			});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/"/>;
		}
		else {
			if (isLoggedIn()) {
				return (<Button bsStyle="warning" bsSize="large" onClick={this.handleClick}> Loggout ? </Button>);
			} else {
				return (
					<Alert bsStyle="warning">
						<strong>You are not logged in !</strong>
					</Alert>
				);
			}
		}
	}
}
