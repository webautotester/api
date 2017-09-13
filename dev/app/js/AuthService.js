import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

var logged = false;

export function login(credentials) {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/login`;
		axios.post(url, credentials  )
			.then( response => {
				if (response.status === 401) {
					console.log('incorrect');
					resolve(false);
				} else {
					console.log('correct');
					logged = true;
					resolve(true);
				}
			})
			.catch(() => {
				console.log('incorrect');
				reject(false);
			});
	});
}

export function logout() {
	logged = false;
	return logged;
}

export function isLoggedIn() {
	return logged;
}

export function signin(credentials) {
	return new Promise( (resolve, reject) => {
		const url = `${BASE_URL}/signin`;
		axios.post(url, credentials)
			.then(response => {
				switch (response.status) {
				case 200 : 
					logged = true;
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