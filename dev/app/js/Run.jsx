import React from 'react';
import {getOneScenario} from './scenarioService.js';

export default class Run extends React.Component {
	constructor(props) {
		super(props);
		let run = this.props.run;
		this.state = {
			run : run,
		};
	}
    
	componentDidMount() {
		console.log('will mount');
		getOneScenario(this.state.run.sid)
			.then( scenarioArray => {
				console.log(scenarioArray);
				this.setState({
					scenario: scenarioArray[0]
				});
			})
			.catch ( (err) => {
				console.log(err);
				this.setState({
					error: err
				});
			});
	}

	render() {
		var success = <img src="../img/success.png"/>;
		var failure = <img src="../img/failure.png"/>;
		var scenarioName = this.state.scenario ? this.state.scenario.name : '... featching scenario';

		if (this.state.run.isSuccess) {
			return (
				<div>
					{this.state.run._id}
					{scenarioName}
					{success}
				</div>
			) ;
		} else {
			return (
				<div>
					{scenarioName}
					{failure}
				</div>
			);
		}
		
	}

}
