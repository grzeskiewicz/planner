import './Devices.css';
import React from 'react';
import {pingCheck} from "./APIConnection";
const RACK_URL='watering.farmabracia.ovh'



class Device extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        status: 'checking'
      }
      this.checkStatus=this.checkStatus.bind(this);
}

componentDidMount(){
    this.checkStatus();
}

checkStatus(){
    this.setState({status:pingCheck(RACK_URL,this.props.port)});
}

render(){
  return (
<div>
   <p>{this.props.name}</p><p>PORT: {this.props.port}</p><p>Status: {this.state.status}</p> <button onClick={this.checkStatus}>TEST</button>
</div>);}
}


export default Device;
