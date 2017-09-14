const winston = require('winston');
const axios = require('axios');

module.exports.init = (serverNames, webServer) => {
	const schedulerServer = `http://${serverNames.schedulerServerName}:8090`;
	webServer
		.get('/playNow/:sid', (req, res) => {
			const sid = req.params.sid;
			const url = `${schedulerServer}/playNow/${sid}`;
			forwardGET(url, res, req);
		})
		.get('/schedule/:sid', (req, res) => {
			const sid = req.params.sid;
			const url = `${schedulerServer}/schedule/${sid}`;
			forwardGET(url, res, req);
		})
		.get('/unschedule/:sid', (req, res) => {
			const sid = req.params.sid;
			const url = `${schedulerServer}/unschedule/${sid}`;
			forwardGET(url, res, req);
		})
		.get('/isscheduled/:sid', (req, res) => {
			const sid = req.params.sid;
			const url = `${schedulerServer}/isscheduled/${sid}`;
			forwardGET(url, res, req);
		});
        
	function forwardGET(url, res, req) {
		winston.info(`Forward GET ${url}`);
		if (req.isAuthenticated()) {
			axios.get(url)
				.then( forwardedRes => {
					winston.info('Response Received');
					res.status(200).send(forwardedRes.data);
				})
				.catch(err => {
					winston.error(err);
					res.status(500).send(err);
				});
		} else {
			winston.error('access denied');
			res.status(401).send('access denied').end();
		}
	}
};