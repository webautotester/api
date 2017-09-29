import React from 'react';
import {getOneScenario} from './scenarioService.js';
import {Col} from 'react-bootstrap';

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
		var error = this.state.run.error ? this.state.run.error : '... error';

		if (this.state.run.isSuccess) {
			return (
				<Col xs={12} md={8} >
					<div>{success}{scenarioName}</div>
					<div>Date: {this.state.run.date.toString()}</div>
				</Col>
			) ;
		} else {
			return (
				<Col xs={12} md={8} >
					<div>{failure}{scenarioName}</div>
					<div>Date: {this.state.run.date.toString()}</div>
					<div>Error: {error}</div>
				</Col>
			);
		}
		
	}

}
