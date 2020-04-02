/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as styles from './app.css';
import RightNow from './components/RightNow';
import Graph from './components/Graph';
import PageNotFound from './components/PageNotFound';

const App = () => {
  return(
    <div className="App">
      <Router>
        <Switch> 
          <Route path="/graph" component={Graph} />
          <Route path="/" component={RightNow} />
         
          <Route component={PageNotFound} />  
        </Switch>  
        <div css={styles.fixed}>
          <Link to="/"><button  css={styles.left}>Current Status</button></Link>
          <Link to="/graph"><button  css={styles.right}>Historic Graph</button></Link>
        </div>
      </Router>
    </div>
  )
}

export default App;
