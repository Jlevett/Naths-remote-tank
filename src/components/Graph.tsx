/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from 'react';
import * as firebase from 'firebase';
import {
  Label,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea
} from "recharts";
import * as Styles from './Graph.css';


class Graph extends React.Component <any, any>{
  constructor(props: any){
    super(props);
    this.state ={
      data:[]
    }
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('records');

    rootRef.on('value', (snap) => {
      const records = snap.val();
      const newRecords = this.processNewRecords(records);
      this.setState({data:newRecords});
    });
  }

  processNewRecords = (records: any) => {
    let newRecords = [];
    for(var key in records){
      newRecords.push(records[key]);
    }
    return newRecords;
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
/*
To include tick on and off
lowLvl: -1,
medLvl: -1,
highLvl: -1,

tankComSuc: -1,

errorLvls: -1,

emergLvls: -1,

warnLvls: -1,

tankLvlsOk: -1,

lastNetwrkTimeMeas: 'Loading',
lastEppochTime: -1,
*/