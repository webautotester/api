import React from 'react';
import {getRunForScenario, isScenarioScheduled, scheduleScenario, unscheduleScenario, playNowScenario, pushScenario, removeScenario} from './ScenarioHelper.js';

import { Panel, Col, Alert, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class Scenario extends React.Component {

	constructor(props) {
		super(props);
		let scenario = this.props.scenario;
		if (! scenario.wait) {
			scenario.wait = 0;
		}
		this.state = {
			scenario : scenario,
			isScheduled : null,
			runs: [],
			time : new Date()
		};
		//console.log(this.props.indice);
		this.handleChangeWait = this.handleChangeWait.bind(this);
		this.onClickSchedule = this.onClickSchedule.bind(this);
		this.onClickUnschedule = this.onClickUnschedule.bind(this);
		this.onClickPlayNow = this.onClickPlayNow.bind(this);
		this.onClickRemoveScenario = this.onClickRemoveScenario.bind(this);
	}

	componentDidMount() {
		var runPromise = getRunForScenario(this.state.scenario._id);
		var schedulePromise = isScenarioScheduled(this.state.scenario._id);
		Promise.all([runPromise, schedulePromise])
			.then(promisesResult => {
				const fetchedRuns = promisesResult[0];
				const fetchedIsScheduled = promisesResult[1];
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: fetchedRuns,
						isScheduled: fetchedIsScheduled,
						time: prevState.time
					};
				});
			})
			.catch(err => {
				//console.log(err);
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: [],
						isScheduled: null,
						time : prevState.time
					};
				});
			});
		
		setInterval(
			() => {
				console.log('interval');
				this.setState((prevState) => {
					return { 
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: prevState.isScheduled,
						time: Date.now()
					};
				});
			}, 2000);
		
	}

	handleChangeWait(event) {
		event.preventDefault();
		const waitControlId = `wait${this.state.scenario._id}`;
		var wait = document.getElementById(waitControlId).value;
		console.log(wait);
		var newScenario = this.state.scenario;
		newScenario.wait = wait;
		pushScenario(newScenario)
			.then( (response) => {
				//console.log(`pushScenario: ${response}`);
				this.setState( (prevState) => {
					return {
						scenario: newScenario,
						runs: prevState.runs,
						isScheduled: prevState.isScheduled,
						time : prevState.time
					};
				});
			})
			.catch( (err) => {
				//console.log(`pushScenario error: ${err}`);
			});
	}

	onClickSchedule(event) {
		event.preventDefault();
		scheduleScenario(this.state.scenario._id)
			.then( () => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: true,
						time : prevState.time
					};
				});
			})
			.catch( err => {
				//console.log(err);
			});
	}

	onClickUnschedule(event) {
		event.preventDefault();
		unscheduleScenario(this.state.scenario._id)
			.then( () => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: false,
						time : prevState.time
					};
				});
			})
			.catch( err => {
				//console.log(err);
			});

	}

	onClickPlayNow(event) {
		event.preventDefault();
		playNowScenario(this.state.scenario._id)
			.then( msg => {
				//console.log(msg);
			})
			.catch( err => {
				//console.log(err);
			});
	}

	onClickRemoveScenario(event) {
		event.preventDefault();
		//console.log('remove');
		removeScenario(this.state.scenario._id)
			.then( msg => {
				//console.log(msg);
			})
			.catch( err => {
				//console.log(err);
			});
	}

	render() {
		//console.log('render');

		var success = <img src="../img/success.png"/>;
		var failure = <img src="../img/failure.png"/>;
		var runs = this.state.runs.map( (run) => <li key={run._id}>{run.isSuccess ? success : failure } at {run.date} </li>);
		var actions = this.state.scenario.actions.map( (action, i) => <li key={i}>{action.type}</li>);
		let isScheduled;
		if (this.state.isScheduled) {
			isScheduled = 'scheduled';
		} else {
			isScheduled = 'not scheduled';
		}

		const divProps = Object.assign({}, this.props);
		delete divProps.indice;
		delete divProps.scenario;

		const head = `${this.props.indice} - Scenario (${this.state.scenario._id}) - URL : ${this.state.scenario.actions[0].url}`;
		const waitControlId = `wait${this.state.scenario._id}`;
		
		return (
			<Panel header={head} {...divProps} >
				<Col xs={12} md={8} >
					<Alert bsStyle="info">This Scenario is <b>{isScheduled}</b></Alert>
				</Col>
				<Col xs={12} md={4} >
					<Button bsStyle="danger" bsSize="large" onClick={this.onClickRemoveScenario}>delete</Button>
				</Col>
				
				<Col xs={12} md={8} >
					<h2>Actions of the scenario</h2>
					<ul>{actions}</ul>
				</Col>
				<Col xs={12} md={8} >
					<h2>Configuration</h2>
					<form>
						<FormGroup >
							<ControlLabel>Wait time in ms (after each action)</ControlLabel>
							<FormControl id={waitControlId} type="number" defaultValue={this.state.scenario.wait} onChange={this.handleChangeWait}/>
						</FormGroup>
					</form>
				</Col>
				<Col xs={12} md={12} >
					<Button onClick={this.onClickPlayNow}>Play Now</Button>
					<Button onClick={this.onClickSchedule}>Schedule</Button>
					<Button onClick={this.onClickUnschedule}>Unschedule</Button>
				</Col>
				<Col xs={12} md={8} >
					<h2>Last 10 Runs</h2>
					<ul>{runs}</ul>
				</Col>
			</Panel>
		);
	}

}
