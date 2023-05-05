import './Devices.css';
import React from 'react';
import Device from './Device';
class Devices extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      }
}

componentDidMount(){
}


//getLampState(shelf){}

//getFanState(shelf){}


render(){
  return (
<div>
  <Device name='ORANGE PI' port='3051'></Device>
  <Device name='PUMP' port='3069'></Device>
  <Device name='LAMPS' port='3070'></Device>
</div>);}
}


export default Devices;
