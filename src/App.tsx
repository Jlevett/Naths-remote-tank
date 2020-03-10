/** @jsx jsx */
import { Global, jsx } from "@emotion/core";
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import * as styles from './test.css';
import RightNow from './components/RightNow';
import Graph from './components/Graph';
import PageNotFound from './components/PageNotFound';

const App = () => {
  return(
    <div className="App">
      <Router>
        <Link to="/">Current Status</Link>
        <Link to="/graph">Historic Graph</Link>
        <Switch>
          <Route exact path="/" component={RightNow} />
          <Route exact path="/graph" component={Graph} />
          <Route component={PageNotFound} />  
        </Switch>
      </Router>
    </div>
  )
}

export default App;

//Home page
//Current Time
//Tank status: ok 
//Last Check: 10 minutes ago on the x.y.2020 
//Within one hour thershold
//Tank and levels
//Communication with tank module: ok/ not ok