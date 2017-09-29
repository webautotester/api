import React from 'react';
import {getRunForUser} from './scenarioService.js';
import Loader from 'react-loader';
import {PageHeader, Accordion, Col, Row} from 'react-bootstrap';

var REFRESH_TEMPO = 4000;

export default class ScenarioList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			runs: [],
			loaded: false,
			intervalId: null,
			firstLoad: true
		};
	}

	updateRuns() {
		//console.log('Scenario and logged');
		this.setState({
			loaded: false,
		});

		var uid = sessionStorage.getItem('uid');
		console.log(uid);
		getRunForUser(uid)
			.then(fetchedRuns => {
				//console.log('fetched');
				this.setState({
					runs: fetchedRuns,
					loaded: true,
					firstLoad: false
				});
			})
			.catch((err) => {
				//console.log(`error:${err}`);
				this.setState({
					loaded: true
				});
			});
	}

	componentWillMount() {
		let interval = setInterval(() => this.updateRuns(), REFRESH_TEMPO);

		this.setState({
			firstLoad: true,
			intervalId: interval
		});

		this.updateRuns();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		let runs;

		if (this.state.runs.length) {
			runs = this.state.runs.map((run) =>
				<span> {run._id} </span>);
		} else {
			runs = (
				<div>
					No runs found yet.
				</div>
			);
		}

		return (
			<div>
				<Row>
					<Col xs={12} md={12} >
						<PageHeader>Your Runs</PageHeader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={12} >
						<Loader loaded={this.state.firstLoad}></Loader>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={12}>
						<Accordion>{runs}</Accordion>
					</Col>
				</Row>
			</div>
		);
	}

}
