import axios from 'axios';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');
//console.log(`BASE_URL : ${BASE_URL}`);

export function getScenario() {
	const url = `${BASE_URL}/api/scenario`;
	return get(url);
}

export function removeScenario(sid) {
	const url = `${BASE_URL}/api/scenario/${sid}`;
	return new Promise((resolve, reject) => {
		axios.delete(url)
			.then( response => {
				//console.log(`Response to DELETE ${url} : ${response.data}`);
				resolve(response.data);
			})
			.catch (err => {
				//console.log(`Error to DELETE ${url} : ${err} `);
				reject(err);
			});
	});
}

export function isScenarioScheduled(sid) {
	const url = `${BASE_URL}/api/isscheduled/${sid}`;
	return get(url);
}

export function scheduleScenario(sid, isScheduled) {
	let url;
	if (isScheduled) {
		url = `${BASE_URL}/api/schedule/${sid}`;
	} else {
		url = `${BASE_URL}/api/unschedule/${sid}`;
	}
	return get(url);
}

export function playNowScenario(sid) {
	const url = `${BASE_URL}/api/playnow/${sid}`;
	return get(url);
}

export function getRunForScenario(sid) {
	const url = `${BASE_URL}/api/run/${sid}`;
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
		const url = `${BASE_URL}/api/scenario`;
		axios.post(url, scenario)
			.then( response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err);
			});
	});
}
