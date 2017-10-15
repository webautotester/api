import React from 'react';
import { Jumbotron, Row, Col, Label } from 'react-bootstrap';

export default class About extends React.Component {

	render() {
		return (
			<div>
				<Row>
					<Jumbotron><h1>Join WAT</h1>
						<h2 className="page-subtitle">The First Open Source Web Monitoring Environment !</h2>
						<Label className="label-danger-orange">Beta test edition</Label>
					</Jumbotron>
				</Row>
				<Row>
					<Col sm={12} md={6}>
						<h2>Help us to improve WAT?</h2>
						<p>WAT is composed of several <a href="https://github.com/webautotester">Open Source projects</a>.</p>
						<p>Feel free to add issues or to post bug reports</p>
						<p>Please create issues in the <a href="https://github.com/webautotester/docker_compose">WAT docker-compose</a> project.</p>
					</Col><Col sm={12} md={6}>
						<h2>Who is behind WAT?</h2>
						<p><a href="http://www.promyze.com">ProMyze</a> is developping WAT for testing Themis, and is proud to provide it.</p>
						<p>If you want to deploy WAT in your organisation, don't hesitate to contact us.</p>
					</Col>
				</Row>
			</div>
		);
	}

}
