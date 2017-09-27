import axios from 'axios';

//const BASE_URL = 'http://localhost:8080';
const BASE_URL = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');
//console.log(`BASE_URL : ${BASE_URL}`);

export function login(credentials) {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/api/login`;
		axios.post(url, credentials  )
			.then( response => {
				if (response.status === 401) {
					//console.log('incorrect');
					resolve(false);
				} else {
					//console.log('correct');
					sessionStorage.setItem('logged',true);
					resolve(true);
				}
			})
			.catch(() => {
				//console.log('incorrect');
				reject(false);
			});
	});
}

export function logout() {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/api/logout`;
		axios.get(url)
			.then(response => {
				sessionStorage.removeItem('logged');
				resolve(response);
			})
			.catch(err => {
				reject(err);
			});
	});
}

export function isLoggedIn() {
	return sessionStorage.getItem('logged') ? sessionStorage.getItem('logged') : false;
}

export function signin(credentials) {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/api/signin`;
		axios.post(url, credentials)
			.then(response => {
				switch (response.status) {
				case 200 : 
					resolve('Account created');
					break;
				case 409 : resolve('username already created');
					break;
				default : resolve('Error Account cannot be created');
				}
			})
			.catch(err => {
				reject(err);
			});
	});
}