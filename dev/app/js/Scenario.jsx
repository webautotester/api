import React from 'react';
import {getRunForScenario, isScenarioScheduled, scheduleScenario, playNowScenario, pushScenario, removeScenario} from './scenarioService.js';
import Loader from 'react-loader';
import { Panel, Col, Alert, Button, FormGroup, ControlLabel, FormControl, Modal, Checkbox } from 'react-bootstrap';

const REFRESH_TEMPO = 5000;

export default class Scenario extends React.Component {
	constructor(props) {
		super(props);
		let scenario = this.props.scenario;
		if (! scenario.wait) {
			scenario.wait = 0;
		}
		if (! scenario.cssselector) {
			scenario.cssselector = 'watId';
		}
		this.state = {
			scenario : scenario,
			isScheduled : false,
			runs: [],
			time : new Date(),
			showPlayNowModal: false,
			intervalId: null,
			runLoaded: false
		};
		//console.log(this.props.indice);
		this.handleChangeWait = this.handleChangeWait.bind(this);
		this.handleChangeCSSSelector = this.handleChangeCSSSelector.bind(this);
		this.onClickSchedule = this.onClickSchedule.bind(this);
		this.onClickPlayNow = this.onClickPlayNow.bind(this);
		this.onClickRemoveScenario = this.onClickRemoveScenario.bind(this);
		this.closePlayNowModal = this.closePlayNowModal.bind(this);
	}

	componentDidMount() {
		let interval = setInterval(
			() => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: prevState.isScheduled,
						time: prevState.time,
						showPlayNowModal: prevState.showPlayNowModal,
						intervalId: prevState.intervalId,
						runLoaded: false
					};
				});
				//console.log('interval');
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
								time: prevState.time,
								showPlayNowModal: prevState.showPlayNowModal,
								intervalId: prevState.intervalId,
								runLoaded: true
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
								time : prevState.time,
								showPlayNowModal: prevState.showPlayNowModal,
								intervalId: prevState.intervalId,
								runLoaded: true
							};
						});
					});
			}, REFRESH_TEMPO);
		
		this.setState( (prevState) => {
			return {
				scenario: prevState.scenario,
				runs: prevState.runs,
				isScheduled: prevState.isScheduled,
				time: prevState.time,
				showPlayNowModal: prevState.showPlayNowModal,
				intervalId: interval,
				runLoaded: false
			};
		});
	}



	componentWillUnmount () {
		clearInterval(this.state.intervalId);
	}


	handleChangeWait(event) {
		event.preventDefault();
		const waitControlId = `wait${this.state.scenario._id}`;
		var wait = document.getElementById(waitControlId).value;
		//console.log(wait);
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
						time : prevState.time,
						showPlayNowModal: prevState.showPlayNowModal,
						intervalId: prevState.intervalId,
						runLoaded: prevState.runLoaded
					};
				});
			})
			.catch( (err) => {
				//console.log(`pushScenario error: ${err}`);
			});
	}

	handleChangeCSSSelector(event) {
		//event.preventDefault();
		const cssselectorId = `cssselector${this.state.scenario._id}`;
		var cssselector = document.getElementById(cssselectorId).value;
		console.log(cssselector);
		var newScenario = this.state.scenario;
		newScenario.cssselector = cssselector;
		pushScenario(newScenario)
			.then( (response) => {
				//console.log(`pushScenario: ${response}`);
				this.setState( (prevState) => {
					return {
						scenario: newScenario,
						runs: prevState.runs,
						isScheduled: prevState.isScheduled,
						time : prevState.time,
						showPlayNowModal: prevState.showPlayNowModal,
						intervalId: prevState.intervalId,
						runLoaded: prevState.runLoaded
					};
				});
			})
			.catch( (err) => {
				//console.log(`pushScenario error: ${err}`);
			});
	}

	onClickSchedule(event) {
		event.preventDefault();
		scheduleScenario(this.state.scenario._id, !this.state.isScheduled)
			.then( () => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: !prevState.isScheduled,
						time : prevState.time,
						showPlayNowModal: prevState.showPlayNowModal,
						intervalId: prevState.intervalId,
						runLoaded: prevState.runLoaded
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
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: prevState.isScheduled,
						time : prevState.time,
						showPlayNowModal: true,
						intervalId: prevState.intervalId,
						runLoaded: prevState.runLoaded
					};
				});
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

	closePlayNowModal() {
		this.setState((prevState) => {
			return { 
				scenario: prevState.scenario,
				runs: prevState.runs,
				isScheduled: prevState.isScheduled,
				time: Date.now(),
				showPlayNowModal: false,
				intervalId: prevState.intervalId,
				runLoaded: prevState.runLoaded
			};
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
		const cssselectorId = `cssselector${this.state.scenario._id}`;
		
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
					<h2>Run Configuration</h2>
					<form>
						<FormGroup >
							<ControlLabel>Wait time in ms (after each action)</ControlLabel>
							<FormControl id={waitControlId} type="number" defaultValue={this.state.scenario.wait} onChange={this.handleChangeWait}/>
						</FormGroup>
						<FormGroup >
							<ControlLabel>CSS Selector Used To Identify Element</ControlLabel>
							<select id={cssselectorId} 
								componentClass="select" 
								placeholder="select" 
								defaultValue={this.state.scenario.cssselector} 
								onChange={this.handleChangeCSSSelector}>
								<option value="watId">WAT With Id</option>
								<option value="watPath">WAT With Path</option>
								<option value="optimal">Optimal Select</option>
							</select>
						</FormGroup>
					</form>
				</Col>
				<Col xs={12} md={12} >
					<Button onClick={this.onClickPlayNow}>Play Now</Button>
				</Col>
				<Col xs={12} md={12} >
					<Checkbox checked={this.state.isScheduled} onChange={this.onClickSchedule}> Scheduling (once per day, each morning)
					</Checkbox>
				</Col>
				<Col xs={12} md={8} >
					<h2>Last 10 Runs</h2>
					<ul>{runs}</ul>
					<Loader loaded={this.state.runLoaded}>
						<Alert bsStyle="success">
							All runs have been loaded !
						</Alert>
					</Loader>
				</Col>

				<Modal show={this.state.showPlayNowModal} onHide={this.closePlayNowModal}>
					<Modal.Header closeButton>
						<Modal.Title>Test Scenario Will Be Played </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>The Scenario {this.state.scenario._id} has been requested to be played.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closePlayNowModal}>Close</Button>
					</Modal.Footer>
				</Modal>

			</Panel>
		);
	}

}
