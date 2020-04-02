/** @jsx jsx */
import {jsx } from '@emotion/core';
import * as firebase from 'firebase';
import moment from 'moment';
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Brush
} from 'recharts';
// import mockData from './graphMockData';
import * as Styles from './Graph.css';

function isOnClient(): boolean {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

export default class Graph extends React.Component <any, any>  {

  constructor(props: any) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      data:[]
    };
    this.resize = this.resize.bind(this);
    this.addInNoUploadComCheck = this.addInNoUploadComCheck.bind(this);
  }
  
  resize() {
    if(isOnClient()){
      this.setState({width: window.innerWidth, height: (window.innerHeight/2)});
    }
  }

  componentDidMount(){
    this.resize();
    window.addEventListener('resize',this.resize);

    const rootRef = firebase.database().ref().child('records');

    rootRef.on('value', (snap) => {
      const records = snap.val();
      const newRecords = this.processNewRecords(records);
      this.setState({data:this.addInNoUploadComCheck(newRecords)});
    });
  
    // this.setState({data: this.addInNoUploadComCheck(mockData)}): For mock tests
  }

  processNewRecords = (records: any) => {
    let newRecords = [];
    for(var key in records){
      newRecords.push(records[key]);
    }
    newRecords = newRecords.map(obj => {
      for (const property in obj) {
        if(property === "lastNetwrkTimeMeas") {
          continue;
        }
        obj[property] = Number(obj[property]);
      }
      return obj;
    });

    return newRecords;
  }

  componentWillUnmount(){
    window.removeEventListener('resize',this.resize);
  }
  

  addInNoUploadComCheck (freshData: any) {
    const newRecord = [];

    const timeOutRecord = 2400; // 40 minutes on 37 minute cycles
    const addTimeNewRecords = 37; // minutes
    const newNetworkTime = (networkTime: string, no: number) => moment(networkTime, "YY-MM-DD-HH-mm-ss").add((no * addTimeNewRecords), 'minutes').format("YY-MM-DD-HH-mm-ss");

    for(let i = 0; i < freshData.length; i++) {
      if(freshData[i].tankComSuc === 1){
        const tempObj = Object.assign({},freshData[i]);
        delete tempObj.tankComSuc;
        newRecord.push(tempObj);
      }
      else if(freshData[i].tankComSuc == 0){
        newRecord.push({tankComSuc: 0, lastNetwrkTimeMeas: freshData[i].lastNetwrkTimeMeas})
      }     

      if(i + 1 !== freshData.length){
        const recordsDiff = (freshData[i+1].lastEppochTime - freshData[i].lastEppochTime) 
        if(recordsDiff > timeOutRecord){
          const missingDataNo =  Math.floor(recordsDiff / timeOutRecord);
          for(let j = 1; j <= missingDataNo; j++) {
            newRecord.push({internetSuc: 0, lastNetwrkTimeMeas: newNetworkTime(freshData[i].lastNetwrkTimeMeas, j)})
          }
        }
      } else {
        const lastRecordAndNow  = moment().diff( moment(freshData[i].lastNetwrkTimeMeas, "YY-MM-DD-HH-mm-ss"), 'seconds');
        if(lastRecordAndNow > timeOutRecord){
          const missingDataNo =  Math.floor(lastRecordAndNow / (addTimeNewRecords*60));
          for(let j = 1; j <= missingDataNo; j++) {
            newRecord.push({internetSuc: 0, lastNetwrkTimeMeas: newNetworkTime(freshData[i].lastNetwrkTimeMeas, j)})
          }
        }
      }
    }
    return newRecord;
  }

  render() {
    return (
      <div css={Styles.space}>
        <h1 css={Styles.middle}>Historic Graphs</h1>
        <h4 css={Styles.middle}>Tank Status</h4>
        <LineChart
          width={this.state.width}
          height={200}
          data={this.state.data}
          syncId="anyId"
          margin={{ top: 10, right: 90, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lastNetwrkTimeMeas"  tickFormatter={ e => moment(e, "YY-MM-DD-HH-mm-ss").format('MMMM Do, h:mm a')}/>
          <YAxis type="number" domain={[-1,1]}  allowDecimals={false}/>
          <Tooltip labelFormatter={ e => moment(e, "YY-MM-DD-HH-mm-ss").format('MMMM Do, h:mm a')}/>
          <Line type="monotone" dataKey="tankLvlsOk" stroke="#006400" fill="#006400" dot={<CustomizedDotOk color="#006400"/>} />  
          <Line type="monotone" dataKey="warnLvls" stroke="#FACF50" fill="#FACF50" dot={<CustomizedDotOk color="#FACF50"/>} />                  
          <Line type="monotone" dataKey="emergLvls" stroke="#ff0000" fill="#ff0000" dot={<CustomizedDotBad color="#ff0000"/>} />
          <Line type="monotone" dataKey="errorLvls" stroke="#6a0dad" fill="#6a0dad" dot={<CustomizedDotBad color="#6a0dad"/>} />

          <Line type="monotone" dataKey="tankComSuc" stroke="#964B00" fill="#964B00" dot={<CustomizedDotComms color="#964B00"/>} />
          <Line type="monotone" dataKey="internetSuc" stroke="#000000" fill="#000000" dot={<CustomizedDotComms color="#000000"/>} />
          <Brush travellerWidth={20} />
        </LineChart>

        <h4 css={Styles.middle}>Raw Tank Levels</h4>
        <LineChart
          width={this.state.width}
          height={200}
          data={this.state.data}
          syncId="anyId"
          margin={{ top: 10, right: 90, left: 30, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="lastNetwrkTimeMeas" tickFormatter={ e => moment(e, "YY-MM-DD-HH-mm-ss").format('MMMM Do, h:mm a')}/>
          <YAxis type="number" domain={[-1,1]}  allowDecimals={false}/>
          <Tooltip labelFormatter={ e => moment(e, "YY-MM-DD-HH-mm-ss").format('MMMM Do, h:mm a')}/>
          <Line type="monotone" dataKey="highLvl" stroke="#006400" fill="#006400"/>            
          <Line type="monotone" dataKey="medLvl" stroke="#FACF50" fill="#FACF50" />
          <Line type="monotone" dataKey="lowLvl" stroke="#ff0000" fill="#ff0000" />
        </LineChart>
        <h4 css={Styles.middle}>{`Date & Time Now: ${moment().format('MMMM Do, h:mm a')}`}</h4>
      </div>
    );
  }
  }


const CustomizedDotOk = ({cx, cy, stroke, payload, value, color} : any ) => {
    if (value === 1) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={color} viewBox="0 0 1024 1024">
          <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
        </svg>
      );
    }
    return null;
}  
const CustomizedDotBad = ({cx, cy, stroke, payload, value, color} : any ) => {
  if (value === 1) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={color} viewBox="0 0 1024 1024">
      <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
    </svg>
    );
  }
  return null;
} ;

const CustomizedDotComms = ({cx, cy, stroke, payload, value, color} : any ) => {
  if (value === 0) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={color} viewBox="0 0 1024 1024">
      <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
    </svg>
    );
  }
  return null;
};
