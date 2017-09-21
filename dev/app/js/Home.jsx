import React from 'react';
import {isLoggedIn} from './AuthService.js';
import { PageHeader, Alert, Row, Col, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Home extends React.Component {

	render() {
		console.log('render home');
		let uRLoggedInMsg = null;
		if (isLoggedIn()) {
			uRLoggedInMsg = <Alert bsStyle="success">
				<strong>You are logged in !</strong>
			</Alert>;
		}
		return (
			<Row>
				<PageHeader> WAT <small> Web Automatic Tester</small></PageHeader>
				<Row>
					<Col sm={12} md={4}>
						<div><Image src="../img/record.png" width="150" rounded /></div>
						<div>Record your E2E Test Scenario by using our Chrome Plugin.</div>
					</Col>
					<Col sm={12} md={4}>
						<div><Image src="../img/replay.png" width="150" rounded /></div>
						<div>Replay your E2E Test Scenario on demand or scheduled every day.</div>
					</Col>
					<Col sm={12} md={4}>
						<div><Image src="../img/check.png" width="150" rounded /></div>
						<div>Check if your E2E Test Scenario is a success or a failure.</div>
					</Col>
				</Row>
				<h2>What WAT is about ?</h2>
				<p>
                WAT allows you to easily record your own E2E tests on any website.
				Once recorded, you can then ask WAT to play your tests and check if they pass or not. 
				You can even ask WAT to play them each morning and to be notified in case of failure.
				</p>

				<h2>Demo</h2>
				<div>
					<video src="../img/demo.mp4" autoPlay controls loop width="800"/>
				</div>



				<h2>How to use WAT ?</h2>
				<p>First you need to <LinkContainer to="/signin"><a>Sign in !</a></LinkContainer> and then <LinkContainer to="/login"><a>Log in !</a></LinkContainer>.</p>
				<p>Second you need to download our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin Sign in !</a> and use it to record your E2E tests.</p>
				<p>Third you can play with your <LinkContainer to="/scenario"><a> recorded E2E test !</a></LinkContainer></p>
				
				<h2>Who is behind WAT ?</h2>
				<p><a href="http://www.promyze.com">ProMyze</a> is developping WAT for testing Themis, and is proud to provide it.</p>
				<p>WAT is open source. If you like it and want for more services, please star the <a href="https://github.com/webautotester/docker_compose"> WAT GitHub projet</a> or add an issue to the list</p>
				{uRLoggedInMsg}
			</Row>
		);
	}

}
