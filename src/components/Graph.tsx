/** @jsx jsx */
import {jsx } from '@emotion/core';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush,
  AreaChart, Area,
} from 'recharts';
import data from './graphMockData';
import * as Styles from './Graph.css';
import moment from 'moment';

function isOnClient(): boolean {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export default class Graph extends React.Component <any, any>  {

  constructor(props: any) {
    super(props);
    this.state = {
      height: 0,
      width: 0
    };
    this.resize = this.resize.bind(this);
  }
  
  resize() {
    if(isOnClient()){
      this.setState({width: window.innerWidth, height: (window.innerHeight/2)});
    }
  }

  componentDidMount(){
    this.resize();
    window.addEventListener('resize',this.resize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize',this.resize);
  }
  
  render() {
    return (
      <div css={Styles.space}>
        <h1 css={Styles.middle}>Historic Graphs</h1>
        <h4 css={Styles.middle}>Raw Tank Levels</h4>
        <LineChart
          width={this.state.width}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lastEppochTime" tickFormatter={ e => moment(e, "YY-MM-DD-hh-mm-ss").format('MMMM Do, h:mm a')}/>
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="lowLvl" stroke="#ff0000" fill="#ff0000" />
          <Line type="monotone" dataKey="medLvl" stroke="#FACF50" fill="#FACF50" />
          <Line type="monotone" dataKey="highLvl" stroke="#00ff00" fill="#00ff00" />
        </LineChart>



        <h4 css={Styles.middle}>Tank Levels</h4>
        <LineChart
          width={this.state.width}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lastEppochTime"  tickFormatter={ e => moment(e, "YY-MM-DD-hh-mm-ss").format('MMMM Do, h:mm a')}/>
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="errorLvls" stroke="#6a0dad" fill="#6a0dad" />
          <Line type="monotone" dataKey="emergLvls" stroke="#ff0000" fill="#ff0000" />
          <Line type="monotone" dataKey="warnLvls" stroke="#FACF50" fill="#FACF50" />
          <Line type="monotone" dataKey="tankLvlsOk" stroke="#00ff00" fill="#00ff00" />
          
        </LineChart>


        <h4 css={Styles.middle}>Communication</h4>
        <AreaChart
          width={this.state.width}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lastEppochTime" tickFormatter={ e => moment(e, "YY-MM-DD-hh-mm-ss").format('MMMM Do, h:mm a')}/>
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="tankComSuc" stroke="#6a0dad" fill="#6a0dad" />

          <Brush travellerWidth={20}/>
          
        </AreaChart>

        

      </div>
    );
  }
  }

/*
Levels 

tankComSuc

levels detailed

*/

// /** @jsx jsx */
// import { jsx } from "@emotion/core";
// import * as React from 'react';
// import * as firebase from 'firebase';
// import {
//   Label,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ReferenceArea
// } from "recharts";
// import * as Styles from './Graph.css';


// class Graph extends React.Component <any, any>{
//   constructor(props: any){
//     super(props);
//     this.state ={
//       data:[]
//     }
//   }

//   componentDidMount(){
//     const rootRef = firebase.database().ref().child('records');

//     rootRef.on('value', (snap) => {
//       const records = snap.val();
//       const newRecords = this.processNewRecords(records);
//       this.setState({data:newRecords});
//     });
//   }

//   processNewRecords = (records: any) => {
//     let newRecords = [];
//     for(var key in records){
//       newRecords.push(records[key]);
//     }
//     return newRecords;
//   }


//   public render(){
//     return (
//       <div>
//           Insert Graph here
//       </div>
//     );
//   }
 
// }

// export default Graph;
// /*
// To include tick on and off
// lowLvl: -1,
// medLvl: -1,
// highLvl: -1,

// tankComSuc: -1,

// errorLvls: -1,

// emergLvls: -1,

// warnLvls: -1,

// tankLvlsOk: -1,

// lastNetwrkTimeMeas: '20-04-01-15-02-43",
// lastEppochTime: -1,
// */