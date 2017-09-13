import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, browserHistory, Link} from 'react-router-dom';
import Home from './Home.jsx';
import ScenarioList from './ScenarioList.jsx';
import Login from './Login.jsx';
import Signin from './Signin.jsx';
import Logout from './Logout.jsx';

class App extends React.Component {
	render () {
    
		return (
			<Router history={browserHistory}>
				<div>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/signin">Signin</Link></li>
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/logout">Logout</Link></li>
						<li><Link to="/scenario">Scenario</Link></li>
					</ul>
          
					<Route exact path="/" component={Home}/>
					<Route path="/login" component={Login}/>
					<Route path="/signin" component={Signin}/>
					<Route path="/logout" component={Logout}/>
					<Route path="/scenario" component={ScenarioList}/>
				</div>
			</Router>
		);
	}
}

render(<App/>, document.getElementById('app'));