import React from 'react';
import { isLoggedIn } from './authenticationService.js';
import { Jumbotron, Alert, Row, Col, Image, Label } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Home extends React.Component {

	render() {
		//console.log('render home');
		let uRLoggedInMsg = null;
		if (isLoggedIn()) {
			uRLoggedInMsg = <Alert bsStyle="success">
				<strong>You are logged in !</strong>
			</Alert>;
		}
		return (
			<div>
				<Row>
					<Jumbotron><h1>WAT</h1>
						<h2 className="page-subtitle">The Web Automatic Tester</h2>
						<Label className="label-danger-orange">Beta test edition</Label>
					</Jumbotron>
				</Row>
				<Row>
					<Col sm={12} md={4}>
						<div className="centered"><Image src="../img/record.png" height="125" width="125" rounded /></div>
						<div className="image-description-element">Record your end to end test scenario using our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin.</a></div>
					</Col>
					<Col sm={12} md={4}>
						<div className="centered"><Image src="../img/replay.png" height="125" width="125" rounded /></div>
						<div className="image-description-element">Replay your end to end test scenario on demand or scheduled every day.</div>
					</Col>
					<Col sm={12} md={4}>
						<div className="centered"><Image src="../img/check.png" height="125" width="125" rounded /></div>
						<div className="image-description-element">Get notified if your end to end test scenario is a success or a failure.</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<h2 className="category-title">Demo</h2>
						<div>
							<video className="centered-video" src="../img/demo.mp4" autoPlay controls loop width="800"/>
						</div>
					</Col></Row>
				<Row>
					<Col sm={12} md={6}>
						<h2>How to use Web Automatic Tester (WAT)?</h2>
						<p>First you need to <LinkContainer to="/signin"><a>Sign in </a></LinkContainer> and then <LinkContainer to="/login"><a>Log in </a></LinkContainer>.</p>
						<p>Second you need to download our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin</a> and use it to record your end to end tests.</p>
						<p>Third you can play with your <LinkContainer to="/scenario"><a> recorded end to end tests!</a></LinkContainer></p>
					</Col><Col sm={12} md={6}>
						<h2>Who is behind WAT ?</h2>
						<p><a href="http://www.promyze.com">ProMyze</a> is developping WAT for testing Themis, and is proud to provide it.</p>
						<p>WAT is open source. If you like it and want more services, please star the <a href="https://github.com/webautotester/docker_compose">WAT GitHub projet</a> or add an issue to the list.</p>
						{uRLoggedInMsg}
					</Col>
				</Row>
			</div>
		);
	}

}
