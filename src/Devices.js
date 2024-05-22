import "./Devices.css";
import React from "react";
import Device from "./Device";
//import {request} from "./APIConnection";
//const RACK_URL='http://192.168.2.5:3051'

class Devices extends React.Component {
 /* constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <div className="Devices">
        <Device name="ORANGEPI" port="3051" socketPort="3069" socketIP="192.168.2.10"></Device>
        <Device name="LAMPS" port="80" socketPort="3069" socketIP="192.168.2.12"></Device>
      </div>
    );
  }
}

export default Devices;
