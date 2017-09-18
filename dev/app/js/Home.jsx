import React from 'react';
import {isLoggedIn} from './AuthService.js';
import { PageHeader } from 'react-bootstrap';

export default class Home extends React.Component {

	render() {
		let uRLoggedInMsg = null;
		if (isLoggedIn()) {
			uRLoggedInMsg = <span>You are logged In !</span>;      
		}
		return (
			<div>
				<PageHeader> WAT <small> Web Automatic Tester</small></PageHeader>
				<span>
                WAT Tester allows you to easily define your own E2E tests and to run them on the Cloud.
				</span>
				<div>
                Download our chrom plugin to create and push your E2E tests !!!
				</div>
				{uRLoggedInMsg}
			</div>
		);
	}

}
