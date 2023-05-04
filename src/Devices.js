import './Devices.css';
import React from 'react';
import { API_URL, request,ping } from "./APIConnection";



class Devices extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      }
}

componentDidMount(){

}

getPumpStatus(rack){
    fetch(request(`${API_URL}/pumpstatus`, "POST", {"rack_id": rack}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {

      } else {

      }
    })
    .catch((error) => Promise.reject(new Error(error)));
}

getControllerState(){
   /* fetch(request(`http://watering.farmabracia.ovh:3051`, "GET"))
   // .then((res) => res.json())
    .then((result) => { console.log(result);})
    //.catch((error) => Promise.reject(new Error(error)));
    .catch((error) => {console.log(error);})*/
 //   const response = await fetch("http://watering.farmabracia.ovh:3051");
 //   console.log(response);

    let ip=prompt("Daj adres");
            new ping(ip, function (status, e) {
            console.log(status);;
        });
}

getLampsState(rack){
    fetch(request(`${API_URL}/lampsstate`, "POST", {"rack_id": rack}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        
      } else {

      }
    })
    .catch((error) => Promise.reject(new Error(error)));
}

//getLampState(shelf){}

//getFanState(shelf){}



render(){

  return (
<div>
    <button onClick={this.getControllerState}>TEST ORANGE PI</button>
</div>);}
}


export default Devices;
