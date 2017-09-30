import React from 'react';
import {getScenario} from './scenarioService.js';
import Scenario from './Scenario.jsx';
import Loader from 'react-loader';
import {PageHeader, Accordion, Col, Row} from 'react-bootstrap';

var REFRESH_TEMPO = 10000;

export default class ScenarioList extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scenarii: [],
			loaded: false,
			intervalId: null,
			loadedAtLeastOnce: false
		};
	}

	updateScenarii() {
		//console.log('Scenario and logged');
		this.setState({
			loaded: false,
		});

		getScenario()
			.then(fetchedScenarii => {
				//console.log('fetched');
				this.setState({
					scenarii: fetchedScenarii,
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
		let interval = setInterval(() => this.updateScenarii(), REFRESH_TEMPO);

		this.setState({
			loadedAtLeastOnce: true,
			intervalId: interval
		});

		this.updateScenarii();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		let scenarii;

		if (this.state.scenarii.length) {
			scenarii = this.state.scenarii.map((scenario, i) =>
				<Scenario indice={i + 1} scenario={scenario} key={scenario._id} eventKey={i} />);
		} else {
			scenarii = (
				<div>
					No scenario found. Upload a scenario thanks to our <a href="https://chrome.google.com/webstore/detail/wat-chrome-plugin/fopllklfdgccljiagdpeocpdnhlmlakc">Chrome Plugin</a>.
				</div>
			);
		}

		return (
			<div>
				<Row>
					<Col xs={12} md={8} >
						<PageHeader>Your scenario</PageHeader>
					</Col>
					<Col xs={12} md={4} >
						<Loader loaded={this.state.loadedAtLeastOnce}></Loader>
					</Col>
					<Col xs={12} md={12}>
						<Accordion>{scenarii}</Accordion>
					</Col>
				</Row>
			</div>
		);
	}

}
