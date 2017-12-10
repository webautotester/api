const axios = require('axios');
const express = require('express');
const passport = require('passport');


module.exports.init = (serverNames, webServer, db, logger) => {
	const schedulerServer = `http://${serverNames.schedulerServerName}:8090`;

	let router = express.Router();
	router.use(passport.authenticate('jwt', {failureRedirect: '/login' , session:false}));

	router
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

	webServer.use('/api/schedule', router);
        
	function forwardGET(url, res, req) {
		logger.info(`Forward GET ${url}`);
		axios.get(url)
			.then( forwardedRes => {
				logger.info('Response Received');
				res.status(200).send(forwardedRes.data);
			})
			.catch(err => {
				logger.error(err);
				res.status(500).send(err);
			});
	}
};