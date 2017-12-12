import React from 'react';
import {getRunForUser} from './scenarioService.js';
import Run from './Run.jsx';
import Loader from 'react-loader';
import {PageHeader, Col, Row} from 'react-bootstrap';

var REFRESH_TEMPO = 10000;

export default class ScenarioList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			runs: [],
			loaded: false,
			intervalId: null,
			loadedAtLeastOnce: false
		};
	}

	updateRuns() {
		//console.log('Scenario and logged');
		this.setState({
			loaded: false,
			loadedAtLeastOnce: true
		});

		getRunForUser()
			.then(fetchedRuns => {
				//console.log('fetched');
				this.setState({
					runs: fetchedRuns,
					loaded: true,
					loadedAtLeastOnce: true
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
			loadedAtLeastOnce: false,
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
			runs = this.state.runs.map( (arun) => <Run key={arun._id} run={arun}></Run>);
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
					<Col xs={12} md={8} >
						<PageHeader>Your New Runs</PageHeader>
					</Col>
					<Col xs={12} md={4} >
						<Loader loaded={this.state.loadedAtLeastOnce}></Loader>
					</Col>
					<Col xs={12} md={8} >
						<div>{runs}</div>
					</Col>
				</Row>
			</div>
		);
	}

}
