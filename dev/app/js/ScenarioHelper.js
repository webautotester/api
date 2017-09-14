import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export function getScenario() {
	const url = `${BASE_URL}/scenario`;
	return get(url);
}

export function isScenarioScheduled(sid) {
	const url = `${BASE_URL}/isscheduled/${sid}`;
	return get(url);
}

export function scheduleScenario(sid) {
	const url = `${BASE_URL}/schedule/${sid}`;
	return get(url);
}

export function unscheduleScenario(sid) {
	const url = `${BASE_URL}/unschedule/${sid}`;
	return get(url);
}

export function playNowScenario(sid) {
	const url = `${BASE_URL}/playnow/${sid}`;
	return get(url);
}

export function getRunForScenario(sid) {
	const url = `${BASE_URL}/run/${sid}`;
	return get(url);
}

function get(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then( response => {
				console.log(`Response to GET ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				console.log(`Error to GET ${url} : ${err} `);
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
