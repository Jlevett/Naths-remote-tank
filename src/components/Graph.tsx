/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from 'react';
import * as firebase from 'firebase';
import * as Styles from './Graph.css';


class Graph extends React.Component <any, any>{
  constructor(props: any){
    super(props);
    this.state ={
      records:{}
    }
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('records');

    rootRef.on('value', (snap) => {
      const records = snap.val();
      this.setState({records})
    });
  }

  public render(){
    return (
      <div>
          Insert Graph here
      </div>
    );
  }
 
}

export default Graph;