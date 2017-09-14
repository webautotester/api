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
		logout()
			.then( (response) => {
				console.log(response);
				this.setState( () => {
					return {
						redirect : true,
					};
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	render() {
		if (this.state.redirect) {
			return <Redirect to="/"/>;
		}
		else {
			if (isLoggedIn()) {
				return (<button onClick={this.handleClick}> Loggout ? </button>);
			} else {
				return (
					<div> Not logged </div>
				);
			}
		}
	}
}
