import './Devices.css';
import React from 'react';
import Device from './Device';
import {request} from "./APIConnection";
const RACK_URL='http://192.168.2.5:3051'

class Devices extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        valve:1,
        duration:15,
        isDisabled:false
      }
      this.runValve=this.runValve.bind(this);
      this.handleValve=this.handleValve.bind(this);
      this.handleDuration=this.handleDuration.bind(this);
}

handleValve(e){
  this.setState({valve:e.target.value})
}

handleDuration(e){
  this.setState({duration:e.target.value})
}

componentDidMount(){
}

runValve(e){
  e.preventDefault();
  if (Number.isInteger(this.state.duration)) {alert("Not a number!"); return;}
  this.setState({isDisabled:true});
  fetch(request(`${RACK_URL}/runvalve`, "POST", {valve:this.state.valve,duration:this.state.duration}))
  .then((res) => res.json())
  .then((result) => {
    this.setState({isDisabled:false});
    console.log(result);
    if (result.success) {
alert("Nawodniono");
    } else {
      alert("Error!")
    }
  })
  .catch((error) => Promise.reject(new Error(error)));
}

//getLampState(shelf){}

//getFanState(shelf){}

//  <Device name='LAMPS' port='3070' socketPort=''></Device>
render(){
  return (
<div className='Devices'>
<Device name='ORANGE PI' port='3051' socketPort='3069'></Device>
  <div><form disabled={this.state.isDisabled} className="runValveForm" onSubmit={this.runValve}>
  <p>Elektrozawór:</p>
  <select value={this.state.valve} onChange={this.handleValve} required>
         <option value="1">1</option>
         <option value="2">2</option>
         <option value="3">3</option>
         <option value="4">4</option>
         <option value="5">5</option>
         <option value="6">6</option>
         <option value="7">7</option>
         <option value="8">8</option>
         <option value="9">9</option>
         <option value="10">10</option>
         <option value="11">11</option>
         <option value="12">12</option>
         <option value="13">13</option>
         <option value="14">14</option>
         <option value="15">15</option>
         <option value="16">16</option>
         </select>
         <p>Czas nawadniania [s]:</p>
         <input type="text" value={this.state.duration} onChange={this.handleDuration}></input>
         <button disabled={this.state.isDisabled} type='submit'>Start</button>
    </form>
    </div>
</div>);}
}


export default Devices;
