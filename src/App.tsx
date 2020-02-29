/** @jsx jsx */
import { Global, jsx } from "@emotion/core";

import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as styles from './test.css';
import { render } from "@testing-library/react";
import * as firebase from 'firebase';

class App extends React.Component <any, any>{
  constructor(props: any){
    super(props);
    this.state ={
      speed: -1
    }
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('react');
    const speedRef = rootRef.child('speed');
    speedRef.on('value', snap => {
      this.setState({speed: snap.val()})
    });

  }

  public render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            css={styles.test}
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.state.speed}
          </a>
        </header>
      </div>
    );
  }
 
}

export default App;
