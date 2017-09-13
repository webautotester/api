import React from 'react';
import {isLoggedIn} from './AuthService.js';
import {getScenario, pushScenario} from './ScenarioHelper.js';

export default class Scenario extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      scenario : []
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log('File did change');
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      pushScenario(reader.result)
      .then(() => {
        console.log('will get after post');
        return getScenario();
      })
      .then((fetchedScenario) => {
        console.log('fetched');
        console.log(JSON.stringify(fetchedScenario));
        this.setState( () => {
          return {
            message: null,
            scenario: fetchedScenario
          }
        });
      })
      .catch((err) => {
        this.setState( () => {
          return {
            message : err.toString(),
            scenario: []
          }
        });
      });
    }
    reader.readAsText(file);
  }

  componentDidMount() {
    if (isLoggedIn()) {
      console.log('Scenario and logged');
      getScenario()
      .then(fetchedScenario => {
        console.log('fetched');
        console.log(JSON.stringify(fetchedScenario));
        this.setState( () => {
          return {
            message: null,
            scenario: fetchedScenario
          }
        });
      })
      .catch((err) => {
        console.log('error');
        console.error(err);
        this.setState( () => {
          return {
            message : err.toString(),
            scenario: []
          }
        });
      });
    }
  }

  render() {
    console.log('render');
    if (isLoggedIn()) {
      console.log('logged in');
      console.log(JSON.stringify(this.state.scenario));
      var scenarios = this.state.scenario.map( (scenario) => <li key={scenario._id}>{scenario._id}</li>);
      
      console.log(scenarios);
      return (
        <div>
          <div>
            <h1>Your scenario</h1>
            <ul>{scenarios}</ul>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>Scenario:</label>
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
