import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export function getScenario() {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/scenario`;
		axios.get(url)
			.then( response => {
				console.log(`ScenarioHelper: response to GET /scenario = ${response.data} `);
				resolve(response.data);
			})
			.catch (err => {
				console.log(`ScenarioHelper: response to GET /scenario error = ${err} `);
				reject(err);
			});
	});
}

export function getRunForScenario(sid) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/scenario/${sid}`;
		axios.get(url)
			.then( response => {
				console.log(`ScenarioHelper: response to GET /scenario/:sid = ${response.date}`);
				resolve(response.data);
			})
			.catch (err => {
				console.log(`ScenarioHelper: response to GET /scenario/:sid error = ${err} `);
				reject(err);
			});
	});
}

export function pushScenario(scenario) {
	return new Promise((resolve, reject) => {
		const url = `${BASE_URL}/scenario`;
		axios.post(url, scenario)
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
