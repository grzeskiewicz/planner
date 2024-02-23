import './Devices.css';
import React from 'react';
import {pingCheck,request,request2} from "./APIConnection";
import axios from 'axios';
const RACK_URL='192.168.2.5'



class Device extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        status: 'checking',
      }
      this.checkStatus=this.checkStatus.bind(this);
}

componentDidMount(){
    this.checkStatus();
}

async checkStatus(){
    this.setState({status:await pingCheck(RACK_URL,this.props.port)});
}

resetDevice(ip,port){
  axios.get(`http://${ip}/cm?cmnd=Power%20off`)
    .then((response) => {
console.log(response);
setTimeout(() => {
  axios.get(`http://${ip}/cm?cmnd=Power%20on`)
  .then((result2) => {
      this.checkStatus();
  }).catch((error2) => {
    console.log(error2);
  });
}, 5000);

    }).catch((error) => {
      console.log(error);
    });
  }

 /* console.log(`http://${ip}/cm?cmnd=Power%20off`);
    fetch(request2(`http://${ip}/cm?cmnd=Power%20off`, "GET"))
  //.then((res) => res.json())
  .then((result) => {
    console.log(result)
    }).catch((error) => Promise.reject(new Error(error)));
}*/

/*
    if (result.POWER == "OFF") {
    setTimeout(() => {
        fetch(request2(`http://${ip}/cm?cmnd=Power%20on`, "GET"))
        .then((res) => res.json())
        .then((result2) => {
            this.checkStatus();
        })
      }, 5000);
    }
*/




render(){
    //const port=this.props.socketPort!=='' ? this.props.socketPort : this.props.port;
    const socketIP=this.props.socketIP;
  return (
<div className='Device'>
   <p>{this.props.name}</p><p>PORT: {this.props.port}</p><p>Status: {this.state.status}</p>{this.state.status!=="active"? <button onClick={()=>this.resetDevice(socketIP)}>Reset</button>:''}
</div>);}
}


export default Device;
