import React from 'react';
import {getRunForScenario} from './ScenarioHelper.js';

export default class Scenario extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scenario : {
				_id : this.props._id,
				uid : this.props.uid,
				actions : this.props.actions,
				isScheduled : this.props.isScheduled
			},
			runs: []
		};
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		getRunForScenario(this.props._id)
			.then(fetchedRuns => {
				console.log('fetched');
				console.log(JSON.stringify(fetchedRuns));
				this.setState( () => {
					return {
						runs: fetchedRuns
					};
				});
			})
			.catch((err) => {
				console.log('error');
				console.error(err);
				this.setState( () => {
					return {
						runs: []
					};
				});
			});
	}

	onClick() {
	}

	render() {
		console.log('render');
		var runs = this.state.runs.map( (run) => <li key={run._id}>{run.result} - {run.date} </li>);
		var actions = this.state.scenario.actions.map( (action, i) => <li key={i}>{action.type}</li>);
		return (
			<div onClick={this.handleClick}>
				<div>
					<h1>Scenario</h1>
					<span>{this.props._id}</span>
					<span>{this.props.isScheduled}</span>
				</div>
				<div>
					<h1>Actions</h1>
					<ul>{actions}</ul>
				</div>
				<div>
					<h1>Runs</h1>
					<ul>{runs}</ul>
				</div>
			</div>
		);
	}

}
