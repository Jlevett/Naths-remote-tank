/** @jsx jsx */
import { Global, jsx } from "@emotion/core";

import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as styles from './test.css';
import * as firebase from 'firebase';

class App extends React.Component <any, any>{
  constructor(props: any){
    super(props);
    this.state ={
      lowLvl: -1,
      medLvl: -1,
      highLvl: -1,
      lastNetwrkTimeMeas: 'Loading',
      tankComSuc: -1,
      errorLvls: -1,
      emergLvls: -1,
      warnLvls: -1,
      tankLvlsOk: -1,
      lastEppochTime: -1
    }
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('latest');
    // get last successful BackUp
    // last communication from devicePixelRatio.
    //Get value from dweet first then database.
    rootRef.on('value', (snap) => {
      const {
        lowLvl,
        medLvl,
        highLvl,
        lastNetwrkTimeMeas,
        tankComSuc,
        errorLvls,
        emergLvls,
        warnLvls,
        tankLvlsOk,
        lastEppochTime
      } = snap.val();
      this.setState({
        lowLvl,
        medLvl,
        highLvl,
        lastNetwrkTimeMeas,
        tankComSuc,
        errorLvls,
        emergLvls,
        warnLvls,
        tankLvlsOk,
        lastEppochTime
      })
    });
  }

  public render(){
    return (
      <div className="App">
          <h1>Naths Tank</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.lowLvl}
          </p>

          <p>Get from backup source</p>
      </div>
    );
  }
 
}

export default App;

//install react router

//Recordm


//Home page
//Current Time
//Tank status: ok 
//Last Check: 10 minutes ago on the x.y.2020 
//Within one hour thershold
//Tank and levels
//Communication with tank module: ok/ not ok

//Other page
//Charts
//levels
//warnings

//Max objects 15,000

