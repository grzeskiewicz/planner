import './Devices.css';
import React from 'react';
import {pingCheck,request,API_URL} from "./APIConnection";
const RACK_URL='192.168.2.6'

class Device extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        status: 'checking',
        progress:0,
        reset:0,
        valve:1,
        duration:10,
        isDisabled:false,
        info:''
      }
      this.checkPIStatus=this.checkPIStatus.bind(this);
      this.checkStatus=this.checkStatus.bind(this);
      this.resetDevice=this.resetDevice.bind(this);

      this.runValve=this.runValve.bind(this);
      this.handleValve=this.handleValve.bind(this);
      this.handleDuration=this.handleDuration.bind(this);
      this.getSocketInfo=this.getSocketInfo.bind(this);
}


componentDidMount(){
   this.props.name==="ORANGEPI" ? this.checkPIStatus():this.checkStatus();
   this.getSocketInfo();
}

async checkPIStatus(){
    this.setState({status:await pingCheck(RACK_URL,this.props.port)});
}

async checkStatus(){
  this.setState({status:await pingCheck(this.props.socketIP,this.props.port)});
}

resetDevice(){
  if (window.confirm('Reset OrangePI?')) {

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
          this.checkPIStatus();
          this.setState({reset:0});
        }
      }, 1000);
      } else{
      alert("Nie można zresetować OrangePI");
      }
    }).catch(error => {alert("Lipa jakaś"); return error}); 
  }
  }

  turnSocketON(){
    if (window.confirm('Włączyć gniazdo?')) {
    fetch(request(`${API_URL}/turnon`, "POST", {ip:this.props.socketIP}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {alert("Problem z uruchomieniem gniazda!"); return error});
  }
  }

  turnSocketOFF(){
    if (window.confirm('Wyłączyć gniazdo?')) {
    fetch(request(`${API_URL}/turnoff`, "POST", {ip:this.props.socketIP}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      // this.getSocketInfo();
    })
    .catch((error) => {alert("Problem z wyłączeniem gniazda!"); return error});
  }
  }


  getSocketInfo(){
    fetch(request(`${API_URL}/getsocketinfo`, "POST", {ip:this.props.socketIP}))
    .then((res) => res.json())
    .then((result) => {
this.setState({info:result.data.Status});
    })
    .catch((error) => {alert("Problem z pobraniem statusu gniazda!"); return error});   
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
    .catch((error) => {alert("Problem z uruchomieniem nawadniania!"); return error});
  }



render(){
    //const port=this.props.socketPort!=='' ? this.props.socketPort : this.props.port;
  return (
<div className='Device'>
  <fieldset className='DeviceInfo'>
    <legend>{this.props.name}</legend>
  <p>PORT: {this.props.port}</p><p>Status: {this.state.status}</p>{this.state.status!=="active" && this.props.name==="ORANGEPI" ? <button onClick={()=>this.resetDevice()}>RESET</button>:''}
   {this.state.reset===1? <p>{this.state.progress}%</p>:''}
   <p>SOCKET POWER STATUS: {this.state.info!=='' && this.state.info.Power===1 ? "ON":"OFF" }</p>
   <button onClick={this.turnSocketOFF}>OFF</button>
   <button onClick={this.turnSocketON}>ON</button>
   </fieldset>

   {this.state.status=== "active" && this.props.name==="ORANGEPI" ? 
   <form disabled={this.state.isDisabled} className="runValveForm" onSubmit={this.runValve}>
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
         <p>Czas otwarcia [s]:</p>
         <input type="number" value={this.state.duration} onChange={this.handleDuration}></input>
         <button disabled={this.state.isDisabled} type='submit'>Start</button>
    </form> :''}
</div>);}
}


export default Device;
