import React from 'react';
import {isLoggedIn, login} from './AuthService.js';
import { Redirect } from 'react-router-dom';

import { FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect : false,
			credential : {
				username : '',
				password :''
			},
			message : null
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		//console.log('handleChange');
		var eventID = event.target.id;
		var eventValue = event.target.value;   
		this.setState( (prevState) => {
			switch (eventID) {
			case 'username' : return { 
				redirect: false,
				credential: {
					username: eventValue, 
					password: prevState.credential.password
				},
				message: null};
			case 'password' : return {
				redirect: false,
				credential: {
					username: prevState.credential.username, 
					password: eventValue},
				message: null};
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		var message = login(this.state.credential)
			.then(response => {
				//console.log('connected !!!');
				//console.log(response);
				this.setState( prevState => {
					return {
						redirect : true,
						credential: prevState.credential,
						message: null
					};
				});
			})
			.catch(err => {
				//console.log(err);
				this.setState( prevState => {
					return {
						redirect: false,
						credential: prevState.credential,
						message: 'Invalid Username / Password'
					};
				});
			});
	}

	render() {
		//console.log(`redirect:${this.state.redirect}`);
		if (this.state.redirect) {
			return <Redirect to="/"/>;
		} else {
			if (isLoggedIn()) {
				return (<Alert bsStyle="success">
					<strong>You are already logged in !</strong>
				</Alert>);
			} else {
				let errorMessage;
				if  (this.state.message) {
					errorMessage = <Alert bsStyle="warning">
						<strong>{this.state.message}</strong>
					</Alert>;
				}
				return (
					<form onSubmit={this.handleSubmit}>
						<FormGroup>
							<ControlLabel>Username</ControlLabel>
							<FormControl id="username" type="text" value={this.state.username} onChange={this.handleChange}/>
						</FormGroup>
						<FormGroup>
							<ControlLabel>Password</ControlLabel>
							<FormControl id="password" type="password" value={this.state.password} onChange={this.handleChange}/>
						</FormGroup>
						<Button type="submit">Log In</Button>
						{errorMessage}
					</form>
				);
			}
		}
	}
}
