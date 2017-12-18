import React from 'react';
import {isScenarioScheduled, scheduleScenario, playNowScenario, pushScenario, removeScenario} from './scenarioService.js';
import { Panel, Col, Button, FormGroup, ControlLabel, FormControl, Modal, Checkbox } from 'react-bootstrap';

const REFRESH_TEMPO = 15000;

export default class Scenario extends React.Component {
	constructor(props) {
		super(props);
		let scenario = this.props.scenario;
		if (! scenario.wait) {
			scenario.wait = 0;
		}
		if (! scenario.name) {
			scenario.name = 'MyScenario';
		}
		if (! scenario.assert) {
			scenario.assert = {
				end : true,
				selector : 'body',
				property: 'innerHTML',
				contains: 'success'
			};
		}
		this.state = {
			scenario : scenario,
			isScheduled : false,
			showPlayNowModal: false,
			intervalId: null
		};
		//console.log(this.props.indice);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.onClickSchedule = this.onClickSchedule.bind(this);
		this.onClickPlayNow = this.onClickPlayNow.bind(this);
		this.onClickRemoveScenario = this.onClickRemoveScenario.bind(this);
		this.closePlayNowModal = this.closePlayNowModal.bind(this);
		this.handleChangeAssert = this.handleChangeAssert.bind(this);
	}

	componentDidMount() {
		let interval = setInterval(
			() => {

				//console.log('interval');
				var schedulePromise = isScenarioScheduled(this.state.scenario._id);
				schedulePromise
					.then(fetchedIsScheduled => {
						this.setState( () => {
							return {
								isScheduled: fetchedIsScheduled
							};
						});
					})
					.catch(err => {
						//console.log(err);
					});
			}, REFRESH_TEMPO);
		
		this.setState( () => {
			return {
				intervalId: interval
			};
		});
	}



	componentWillUnmount () {
		clearInterval(this.state.intervalId);
	}


	handleChangeName(event) {
		event.preventDefault();
		const nameControlId = `name${this.state.scenario._id}`;
		var name = document.getElementById(nameControlId).value;
		var newScenario = this.state.scenario;
		newScenario.name = name;
		pushScenario(newScenario)
			.then( (response) => {
				//console.log(`pushScenario: ${response}`);
				this.setState( () => {
					return {
						scenario: newScenario
					};
				});
			})
			.catch( (err) => {
				//console.log(`pushScenario error: ${err}`);
			});
	}

	handleChangeAssert(event) {
		event.preventDefault();
		const assertEndId = `end${this.state.scenario._id}`;
		const assertSelectorId = `selector${this.state.scenario._id}`;
		const assertPropertyId = `property${this.state.scenario._id}`;
		const assertContainsId = `contains${this.state.scenario._id}`;
		var newScenario = this.state.scenario;
		newScenario.assert = {
			end : document.getElementById(assertEndId).checked,
			selector : document.getElementById(assertSelectorId).value,
			property : document.getElementById(assertPropertyId).value,
			contains : document.getElementById(assertContainsId).value
		};
		pushScenario(newScenario)
			.then( (response) => {
				this.setState( () => {
					return {
						scenario: newScenario
					};
				});
			})
			.catch( (err) => {

			});
	}

	onClickSchedule(event) {
		event.preventDefault();
		scheduleScenario(this.state.scenario._id, !this.state.isScheduled)
			.then( () => {
				this.setState( (prevState) => {
					return {
						isScheduled: !prevState.isScheduled
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
				this.setState( () => {
					return {
						showPlayNowModal: true
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
		this.setState(() => {
			return { 
				showPlayNowModal: false,
			};
		});
	}

	render() {
		var actions = this.state.scenario.actions.map( (action, i) => <li key={i}>{action.type}</li>);

		const divProps = Object.assign({}, this.props);
		delete divProps.indice;
		delete divProps.scenario;

		const head = `${this.props.indice} - ${this.state.scenario.actions[0].url}`;
		const nameControlId = `name${this.state.scenario._id}`;
		const assertEndId = `end${this.state.scenario._id}`;
		const assertSelectorId = `selector${this.state.scenario._id}`;
		const assertPropertyId = `property${this.state.scenario._id}`;
		const assertContainsId = `contains${this.state.scenario._id}`;
		
		return (
			<Panel header={head} {...divProps} >
				<Col xs={12} md={8} >
					<h2>Configuration</h2>
					<form>
						<FormGroup >
							<ControlLabel>Name or Intent of the Scenario </ControlLabel>
							<FormControl id={nameControlId} type="text" defaultValue={this.state.scenario.name} onChange={this.handleChangeName}/>
						</FormGroup>
					</form>
				</Col>
				<Col xs={12} md={4} >
					<Button bsStyle="danger" bsSize="large" onClick={this.onClickRemoveScenario}>delete</Button>
				</Col>
				<Col xs={12} md={12} >
					<Checkbox checked={this.state.isScheduled} onChange={this.onClickSchedule}> Run Scheduling (once per day, each morning)
					</Checkbox>
				</Col>
				<Col xs={12} md={12}>
					<h2>Assert</h2>
					<form>
						<Checkbox id={assertEndId} checked={this.state.scenario.assert.end} onChange={this.handleChangeAssert}>
      						The scenario just runs until the end
						</Checkbox>
						<FormGroup >
							<ControlLabel>CSS Selector Of The Element Target Of The Assert </ControlLabel>
							<FormControl id={assertSelectorId} type="text" defaultValue={this.state.scenario.assert.selector} readOnly={this.state.scenario.assert.end} onChange={this.handleChangeAssert}/>
						</FormGroup>
						<FormGroup >
							<ControlLabel>Tested Property </ControlLabel>
							<select id={assertPropertyId}
								defaultValue={this.state.scenario.assert.property} 
								disabled={this.state.scenario.assert.end}
								onChange={this.handleChangeAssert}>
								<option value="value">Value</option>
								<option value="innerHTML">innerHTML</option>
							</select>
						</FormGroup>
						<FormGroup >
							<ControlLabel>Expected Value That Should Be Contained In</ControlLabel>
							<FormControl id={assertContainsId} type="text" defaultValue={this.state.scenario.assert.contains} readOnly={this.state.scenario.assert.end} onChange={this.handleChangeAssert} />
						</FormGroup>
					</form>
				</Col>
				<Col xs={12} md={12} >
					<Button onClick={this.onClickPlayNow}>Play Now</Button>
				</Col>
				
				<Col xs={12} md={8} >
					<h2>Actions of the scenario</h2>
					<ul>{actions}</ul>
				</Col>
				
				
				<Modal show={this.state.showPlayNowModal} onHide={this.closePlayNowModal}>
					<Modal.Header closeButton>
						<Modal.Title>Test Scenario Will Be Played </Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>The Scenario has been requested to be played.</p>
						<p> <emph>Wait several minutes </emph> and then, <emph>look at your Runs.</emph></p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.closePlayNowModal}>Close</Button>
					</Modal.Footer>
				</Modal>

			</Panel>
		);
	}

}
