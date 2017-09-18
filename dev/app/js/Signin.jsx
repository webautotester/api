import React from 'react';
import {isLoggedIn, signin} from './AuthService.js';

import { FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
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
		var eventID = event.target.id;
		var eventValue = event.target.value;   
		this.setState( (prevState) => {
			switch (eventID) {
			case 'username' : return { 
				credential: {
					username: eventValue, 
					password: prevState.credential.password
				},
				message: null};
			case 'password' : return {
				credential: {
					username: prevState.credential.username, 
					password: eventValue},
				message: null};
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		signin(this.state.credential)
			.then((message) => {
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						message: message
					};
				});
			})
			.catch( (err) => {
				this.setState( prevState => {
					return {
						credential: prevState.credential,
						message: 'ERROR'
					};
				});
			});
    
	}

	render() {
		console.log('render');
		if (isLoggedIn()) {
			return (
				<Alert bsStyle="success">
					<strong>You are already logged in !</strong>
				</Alert>
			);
		} else {
			return (
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="formUserName">
						<ControlLabel>Username</ControlLabel>
						<FormControl id="username" type="text" value={this.state.username} onChange={this.handleChange}/>
					</FormGroup>
					<FormGroup controlId="formPassword">
						<ControlLabel>Password</ControlLabel>
						<FormControl id="password" type="password" value={this.state.password} onChange={this.handleChange}/>
					</FormGroup>
					<Button type="submit">Signin</Button>
				</form>
			);
		}
	}
}
