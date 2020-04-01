/** @jsx jsx */
import { Global, jsx } from "@emotion/core";
import * as React from 'react';
import * as firebase from 'firebase';
import * as Styles from './RightNow.css';
import moment from 'moment';
import cow from '../cow.gif';

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

  getInfoFromFireBase = () => {
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

  componentDidMount(){
    this.getInfoFromFireBase();
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    if(nextState.lastUpdate_lastNetwrkTimeMeas !== this.state.lastUpdate_lastNetwrkTimeMeas || nextState.lastNetwrkTimeMeas !== this.state.lastNetwrkTimeMeas){
      return true;
    }
    return false;
  }

  public render(){
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
      lastEppochTime, 
      lastUpdate_lastNetwrkTimeMeas,
      lastUpdate_tankComSuc,
      lastUpdate_lastEppochTime
    } = this.state;
    
    const lastUpdateFromNow = moment(lastUpdate_lastNetwrkTimeMeas, "YY-MM-DD-hh-mm-ss").fromNow();
    const lastUpdateDateTime = moment(lastUpdate_lastNetwrkTimeMeas, "YY-MM-DD-hh-mm-ss").format('MMMM Do, h:mm a');
    const lastBaseToTankSuccessFromNow = moment(lastNetwrkTimeMeas, "YY-MM-DD-hh-mm-ss").fromNow();
    const lastBaseToTankSuccessDateTime = moment(lastNetwrkTimeMeas, "YY-MM-DD-hh-mm-ss").format('MMMM Do, h:mm a');

    const hasItBeenToLong = (updateFromNow: string, where: string) => {
        const commsMessage = `Its been detected that the ${where} update has been a while, this might be due to bad weather (in which case, it might resolve) or a malfunction (which wont resolve, especially if its been a week) requiring a power reset of both modules.`;
        if(updateFromNow.indexOf("hour") === -1 && updateFromNow.indexOf("minute") === -1 && updateFromNow.indexOf("second") === -1){
         return (<p css={Styles.red}>{commsMessage}</p>);
        }
        return null;
    }

    const RightNow = () => (
       <div css={Styles.container}>

        <Global styles={Styles.global2} />

        <div css={Styles.headingContainer}><h1 css={Styles.headings}>Current Status</h1></div>

        <div css={Styles.width}>

          {lastEppochTime === lastUpdate_lastEppochTime ? <p>Last attempted communication between tank and base station was successful</p> 
          : <p css={Styles.orange}>{`Unsuccessful tank to base station communication, ${lastUpdateFromNow} on ${lastUpdateDateTime}. It is possible to use the information of the last successful update below, but be mindful of how long ago that update occured.`}</p>}
          {hasItBeenToLong(lastUpdateFromNow, "base station")}
          

        </div>

        <div css={Styles.headingContainerBottom}><h2 css={Styles.headings}>Information on the last successful base station to tank communication</h2></div>
        <div css={Styles.width}>
        <p css={Styles.inline}><b>Status:</b></p>{getCurrentStatus()}<p css={Styles.inline}>{lastBaseToTankSuccessFromNow}</p>
        <p>{`This was on ${lastBaseToTankSuccessDateTime}`}</p>
        <p>Note: Tank to base station communications are scheduled every 30 minutes.</p>
        {hasItBeenToLong(lastBaseToTankSuccessFromNow, "tank to base station")}
        {(emergLvls == 1 || warnLvls == 1 || errorLvls == 1) && (
          <div css={[Styles.bordersContainer, Styles.red]}>
            <h3>If this is here its bad</h3>
            <p css={Styles.red}>{`Tank critically low: ${warnLvls == 1 ? 'Yes' : 'No'}`}</p>
            <p css={Styles.red}>{`Tank is completely empty: ${emergLvls == 1 ? 'Yes' : 'No'}`}</p>
            <p css={Styles.red}>{`Error levels: ${errorLvls == 1 ? 'Yes' : 'No'}`}</p>
          </div>
        )}
        <div css={[Styles.bordersContainer, Styles.moreBottom]}>
          <p css={highLvl == 1? Styles.green : Styles.red}>{`High Level Sensor: ${highLvl == 1 ? 'High' : 'Low'}`}</p>
          <p css={medLvl == 1? Styles.green : Styles.red}>{`Med Level Sensor: ${medLvl == 1 ? 'High' : 'Low'}`}</p>
          <p css={lowLvl == 1? Styles.green : Styles.red}>{`Low Level Sensor: ${lowLvl == 1 ? 'High' : 'Low'}`}</p>
        </div> 
        </div>
      </div>
    )

    const getCurrentStatus = () => {
      if(tankLvlsOk == -1) return (<p css={[Styles.inline, Styles.orange]}>Corrupt Results.</p>);
      if(emergLvls == 1 || warnLvls == 1 || errorLvls == 1)  return (<p css={[Styles.inline, Styles.red]}>BAD. Not Okay.</p>);
      if(tankLvlsOk == 0) return (<p css={[Styles.inline, Styles.red]}>Levels Not Okay.</p>);
      if(tankLvlsOk == 1) return (<p css={[Styles.inline, Styles.green]}>Levels Okay.</p>);
    }

    return (
      <div>
        {lastNetwrkTimeMeas  === 'Loading' ?
          <div css={Styles.background}>
            <Global styles={Styles.global} />
            <h1>Please Wait. Milking all the data...</h1>
            <img css={Styles.img} src={cow} />
          </div>
           :
           <React.Fragment>
          {RightNow()}
          </React.Fragment>
        }
      </div>
    );
  }
 
}

export default RightNow;

