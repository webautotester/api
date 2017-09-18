import React from 'react';
import {isLoggedIn} from './AuthService.js';
import {getScenario, pushScenario} from './ScenarioHelper.js';
import Scenario from './Scenario.jsx';

export default class ScenarioList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scenarii : []
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		console.log('File did change');
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			pushScenario(JSON.parse(reader.result))
				.then(() => {
					console.log('will get after post');
					return getScenario();
				})
				.then((fetchedScenario) => {
					console.log('fetched');
					console.log(JSON.stringify(fetchedScenario));
					this.setState( () => {
						return {
							scenarii: fetchedScenario
						};
					});
				})
				.catch((err) => {
					this.setState( () => {
						return {
							scenarii: []
						};
					});
				});
		};
		reader.readAsText(file);
	}

	componentDidMount() {
		if (isLoggedIn()) {
			console.log('Scenario and logged');
			getScenario()
				.then(fetchedScenarii => {
					console.log('fetched');
					this.setState( () => {
						return {
							scenarii: fetchedScenarii
						};
					});
				})
				.catch((err) => {
					console.log(`error:${err}`);
					this.setState( () => {
						return {
							scenarii: []
						};
					});
				});
		}
	}

	render() {
		console.log('render');
		if (isLoggedIn()) {
			console.log('logged in');
			console.log(JSON.stringify(this.state.scenarii));
			var scenarii = this.state.scenarii.map( (scenario) => <Scenario key={scenario._id} scenario={scenario} />);
      
			console.log(scenarii);
			return (
				<div>
					<div>
						<h1>Your scenario</h1>
						<ul>{scenarii}</ul>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div>
							<input type="file" id="jsonscenario" accept=".json" value={this.state.username} onChange={this.handleChange}/>
						</div>
					</form>
					<div>{this.state.message}</div>
				</div>
			);
		} else {
			return (
				<div>
          Please Login to see your scenario.
				</div>
			);
		}
	}

}
