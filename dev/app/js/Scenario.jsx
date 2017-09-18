import React from 'react';
import {getRunForScenario, isScenarioScheduled, scheduleScenario, unscheduleScenario, playNowScenario, pushScenario} from './ScenarioHelper.js';

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
			runs: []
		};
		console.log(this.state);
		this.handleChangeWait = this.handleChangeWait.bind(this);
		this.onClickSchedule = this.onClickSchedule.bind(this);
		this.onClickUnschedule = this.onClickUnschedule.bind(this);
		this.onClickPlayNow = this.onClickPlayNow.bind(this);
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
						isScheduled: fetchedIsScheduled
					};
				});
			})
			.catch(err => {
				console.log(err);
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: [],
						isScheduled: null
					};
				});
			});
	}

	handleChangeWait() {
		var wait = document.getElementById('wait').value;
		console.log(`wait = ${wait}`);
		this.state.scenario.wait = wait;
		pushScenario(this.state.scenario)
			.then( (response) => {
				console.log(`pushScenario: ${response}`);
			})
			.catch( (err) => {
				console.log(`pushScenario error: ${err}`);
			});
	}

	onClickSchedule() {
		scheduleScenario(this.state.scenario._id)
			.then( () => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: true
					};
				});
			})
			.catch( err => {
				console.log(err);
			});
	}

	onClickUnschedule() {
		unscheduleScenario(this.state.scenario._id)
			.then( () => {
				this.setState( (prevState) => {
					return {
						scenario: prevState.scenario,
						runs: prevState.runs,
						isScheduled: false
					};
				});
			})
			.catch( err => {
				console.log(err);
			});

	}

	onClickPlayNow() {
		playNowScenario(this.state.scenario._id)
			.then( msg => {
				console.log(msg);
			})
			.catch( err => {
				console.log(err);
			});
	}

	render() {
		console.log('render');
		var runs = this.state.runs.map( (run) => <li key={run._id}>{run.isSuccess ? 'success' : 'failure'} - {run.date} </li>);
		var actions = this.state.scenario.actions.map( (action, i) => <li key={i}>{action.type}</li>);
		let isScheduled;
		if (this.state.isScheduled) {
			isScheduled = 'scheduled';
		} else {
			isScheduled = 'not scheduled';
		}
		return (
			<div>
				<div>
					<h1>Scenario</h1>
					<span>Id = {this.state.scenario._id} is <b>{isScheduled}</b></span>
				</div>
				<div>
					<h2>Actions</h2>
					<ul>{actions}</ul>
				</div>
				<div>
					<h2>Configuration</h2>
					<div>
						WAIT TIME (after each action):
						<div>
							<input id='wait' onChange={this.handleChangeWait} type='number' defaultValue={this.state.scenario.wait}/>
						</div>
					</div>
					<div>
						ASSERT:
						<div>
							<input type='checkbox' onChange={this.handleCheckAssert} id='checkAssert' name='checkAssert' value='checkAssert'/>
    						<label htmlFor='checkAssert'>Do you want to check the following assert?</label>
						</div>
						<div>
							CSS Selector: <input type='text' id='assertSelector'/>
							Expected Value: <input type='text' id='assertExpectedValue'/>
						</div>
					</div>
					
				</div>
				<div>
					<button onClick={this.onClickPlayNow}>Play Now</button>
					<button onClick={this.onClickSchedule}>Schedule</button>
					<button onClick={this.onClickUnschedule}>Unschedule</button>
				</div>
				<div>
					<h2>Last 10 Runs</h2>
					<ul>{runs}</ul>
				</div>
			</div>
		);
	}

}
