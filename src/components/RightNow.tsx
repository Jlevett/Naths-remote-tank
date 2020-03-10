/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from 'react';
import * as firebase from 'firebase';
import * as Styles from './RightNow.css';

class RightNow extends React.Component <any, any>{
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
      lastEppochTime: -1,
      lastUpdate_lastNetwrkTimeMeas: 'Loading',
      lastUpdate_tankComSuc: -1,
      lastUpdate_lastEppochTime: -1,
    }
  }

  componentDidMount(){
    const rootRef = firebase.database().ref().child('lastSuccessful');
    const rootRef1 = firebase.database().ref().child('lastUpdate');

    rootRef.on('value', (snap) => {
      const values = snap.val();
      this.setState({
        ...values
      })
    });

    rootRef1.on('value', (snap) => {
      const {
        lastNetwrkTimeMeas,
        tankComSuc,
        lastEppochTime
      } = snap.val();
      this.setState({
        lastUpdate_lastNetwrkTimeMeas: lastNetwrkTimeMeas,
        lastUpdate_tankComSuc: tankComSuc,
        lastUpdate_lastEppochTime: lastEppochTime
      })
    });
  }

  public render(){
    return (
      <div >
        {this.state.lowLvl && this.state.lowLvl}
      </div>
    );
  }
 
}

export default RightNow;

