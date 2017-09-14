import React from 'react';
import {isLoggedIn, signin} from './AuthService.js';

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
				<div> You are logged ! </div>
			);
		} else {
			return (
				<form onSubmit={this.handleSubmit}>
					<div>
						<label>Username:</label>
						<input type="text" id="username" value={this.state.username} onChange={this.handleChange}/>
					</div>
					<div>
						<label>Password:</label>
						<input type="password" id="password" value={this.state.password} onChange={this.handleChange}/>
					</div>
					<div>
						<input type="submit" value="Signin !"/>
					</div>
					<span>{this.state.message}</span>
				</form>
			);
		}
	}
}
