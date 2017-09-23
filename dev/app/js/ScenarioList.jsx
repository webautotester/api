import React from 'react';
import {isLoggedIn} from './AuthService.js';
import {getScenario, pushScenario} from './ScenarioHelper.js';
import Scenario from './Scenario.jsx';

import { PageHeader, Accordion, Col, Alert } from 'react-bootstrap';

const REFRESH_TEMPO = 3000;

export default class ScenarioList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scenarii : [],
			intervalId: null
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		//console.log('File did change');
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			pushScenario(JSON.parse(reader.result))
				.then(() => {
					//console.log('will get after post');
					return getScenario();
				})
				.then((fetchedScenario) => {
					//console.log('fetched');
					//console.log(JSON.stringify(fetchedScenario));
					this.setState( (prevState) => {
						return {
							scenarii: fetchedScenario,
							intervalId: prevState.intervalId
						};
					});
				})
				.catch((err) => {
					this.setState( (prevState) => {
						return {
							scenarii: [],
							intervalId: prevState.intervalId
						};
					});
				});
		};
		reader.readAsText(file);
	}

	componentDidMount() {
		let interval = setInterval(
			() => {
				if (isLoggedIn()) {
					//console.log('Scenario and logged');
					getScenario()
						.then(fetchedScenarii => {
							//console.log('fetched');
							this.setState( (prevState) => {
								return {
									scenarii: fetchedScenarii,
									intervalId: prevState.intervalId
								};
							});
						})
						.catch((err) => {
							//console.log(`error:${err}`);
							this.setState( (prevState) => {
								return {
									scenarii: [],
									intervalId: prevState.intervalId
								};
							});
						});
				}
			}, REFRESH_TEMPO);

		this.state = {
			scenarii : [],
			intervalId: interval
		};
	}

	componentWillUnmount () {
		clearInterval(this.state.intervalId);
	}

	render() {
		//console.log('render');
		if (isLoggedIn()) {
			//console.log('logged in');
			//console.log(JSON.stringify(this.state.scenarii));
			var scenarii = this.state.scenarii.map( (scenario,i) => <Scenario indice={i+1} scenario={scenario} key={scenario._id} eventKey={i}  />);
			// var scenarii = this.state.scenarii.map( (scenario,i) => 
			// 	<Panel header={scenario._id} eventKey={i}>
			// 		<Scenario indice={i} scenario={scenario} />
			// 	</Panel>
			// );
      
			console.log(scenarii);
			return (
				<Col xs={12} md={12} >
					<PageHeader>Your scenario</PageHeader>
					<Accordion>{scenarii}</Accordion>
				</Col>
			);
		} else {
			return (<Alert bsStyle="warning">
				<strong>You are not yet logged in !</strong>
			</Alert>);
		}
	}

}
