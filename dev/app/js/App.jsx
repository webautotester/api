import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, browserHistory} from 'react-router-dom';
import Home from './Home.jsx';
import ScenarioList from './ScenarioList.jsx';
import Login from './Login.jsx';
import Signin from './Signin.jsx';
import Logout from './Logout.jsx';

import { Nav, Navbar,NavItem, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


class App extends React.Component {

	constructor(props) {
		super(props);
	}


	render () {
		return (
			<Router history={browserHistory}>
				<div>
					<Navbar>
						<Navbar.Header>
							<Navbar.Brand>
								<LinkContainer to="/">
									<a href="#" eventKey={1}>Home</a>
								</LinkContainer>
							</Navbar.Brand>
						</Navbar.Header>
						<Nav>
							<LinkContainer to="/signin" >
								<NavItem eventKey={2}>Signin</NavItem>
							</LinkContainer>
							<LinkContainer to="/login" >
								<NavItem eventKey={3}>Login</NavItem>
							</LinkContainer>
							<LinkContainer to="/logout" >
								<NavItem eventKey={4}>Logout</NavItem>
							</LinkContainer>
							<LinkContainer to="/scenario" >
								<NavItem eventKey={5}>Scenario</NavItem>
							</LinkContainer>
						</Nav>
					</Navbar>

					<Grid>
						<Route exact path="/" component={Home}/>
						<Route path="/login" component={Login}/>
						<Route path="/signin" component={Signin}/>
						<Route path="/logout" component={Logout}/>
						<Route path="/scenario" component={ScenarioList}/>
					</Grid>
				</div>
			</Router>
		);
	}
}

render(<App/>, document.getElementById('app'));
