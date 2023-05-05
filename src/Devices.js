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
<div className='Devices'>
  <Device name='ORANGE PI' port='3051' socketPort='3069'></Device>
  <Device name='LAMPS' port='3070' socketPort=''></Device>
</div>);}
}


export default Devices;
