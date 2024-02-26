import './Devices.css';
import React from 'react';
import {pingCheck,request,API_URL} from "./APIConnection";
const RACK_URL='192.168.2.5'

class Device extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        status: 'checking',
        progress:0,
        reset:0,
        valve:1,
        duration:10,
        isDisabled:false
      }
      this.checkStatus=this.checkStatus.bind(this);
      this.resetDevice=this.resetDevice.bind(this);

      this.runValve=this.runValve.bind(this);
      this.handleValve=this.handleValve.bind(this);
      this.handleDuration=this.handleDuration.bind(this);
}


componentDidMount(){
    this.checkStatus();
}

async checkStatus(){
    this.setState({status:await pingCheck(RACK_URL,this.props.port)});
}


resetDevice(){
  this.setState({reset:1,status:'reseting'});
  fetch(request(`${API_URL}/resetorangepi`, 'GET'))
    .then(res => res.json())
    .then(result => { 
      console.log(result);
      if (result.success) {
        let i=1;
       const interval = setInterval(() => 
      {
        this.setState({progress: i});
        i++;
        if (i===100) {
          clearInterval(interval);
          this.checkStatus();
          this.setState({reset:0});
        }
      }, 1000);
      } else{
      alert("Nie można zresetować OrangePI");
      }
    }).catch(error => Promise.reject(new Error(error))); 
  }


  handleValve(e){
    this.setState({valve:e.target.value})
  }
  
  handleDuration(e){
    this.setState({duration:e.target.value})
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

/*
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
*/

render(){
    //const port=this.props.socketPort!=='' ? this.props.socketPort : this.props.port;
  return (
<div className='Device'>
  <div className='DeviceInfo'>
   <p>{this.props.name}</p><p>PORT: {this.props.port}</p><p>Status: {this.state.status}</p>{this.state.status!=="active"? <button onClick={()=>this.resetDevice()}>Reset</button>:''}
   {this.state.reset===1? <p>{this.state.progress}%</p>:''}
   </div>
   {this.state.status==="active" ? 
   <form disabled={this.state.isDisabled} className="runValveForm" onSubmit={this.runValve}>
  <p>Elektrozawór:</p>
  <select value={this.state.valve} onChange={this.handleValve} required>
         <option value="1">1</option>
         <option value="2">2</option>
         <option value="3">3</option>
         <option value="4">4</option>
         </select>
         <p>Czas otwarcia [s]:</p>
         <input type="number" value={this.state.duration} onChange={this.handleDuration}></input>
         <button disabled={this.state.isDisabled} type='submit'>Start</button>
    </form> :''}
</div>);}
}


export default Device;
