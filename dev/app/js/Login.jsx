import React from 'react';
import {isLoggedIn, login} from './AuthService.js';
import { Redirect } from 'react-router-dom';

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
		console.log('handleChange');
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
				console.log('connected !!!');
				this.setState( prevState => {
					return {
						redirect : true,
						credential: prevState.credential,
						message: null
					};
				});
			})
			.catch(err => {
				this.setState( prevState => {
					return {
						redirect: false,
						credential: prevState.credential,
						message: 'Invalid Login Password'
					};
				});
			});
	}

	render() {
		console.log(`redirect:${this.state.redirect}`);
		if (this.state.redirect) {
			return <Redirect to="/"/>;
		} else {
			if (isLoggedIn()) {
				return <div> Already logged ! </div>;
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
							<input type="submit" value="Log In"/>
						</div>
						<span>{this.state.message}</span>
					</form>
				);
			}
		}
	}
}
