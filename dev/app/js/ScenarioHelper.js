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
            console.log(`ScenarioHelper: response to GET error = ${err} `)
            reject(err);
        })
    })
}

export function pushScenario(file) {
    return new Promise((reject, resolve) => {
        const url = `${BASE_URL}/scenario`;
        axios.post(url, JSON.parse(file))
        .then( response => {
            resolve(response.data);
        })
        .catch(err => {
            reject(err);
        })
    })
}
