import './Crops.css';
import React from 'react';
import moment from 'moment';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt,faCheckCircle } from '@fortawesome/free-solid-svg-icons';


class Crop extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      editNotesEnabled:false,
      notes:this.props.crop.notes
    }
    this.triggerEditNotes=this.triggerEditNotes.bind(this);
    this.editNotes=this.editNotes.bind(this);
    this.saveNotes=this.saveNotes.bind(this);
    this.deleteCrop=this.deleteCrop.bind(this);
  }

  triggerEditNotes(){
    this.props.setSelectedCrop(this.props.crop.id);
    this.setState({editNotesEnabled: !this.state.editNotesEnabled});
  }

//TODO: dokonczyc crop,valve,start,end,duration!!!
/* confirmWatering(crop){
    const level=this.props.shelfData.level;
    let valve;
    switch (level) {
      case 1:
        valve = 4;
        break;
      case 2:
        valve = 3;
        break;
      case 3:
        valve = 2;
        break;
      case 4:
        minute = 1;
        break;
    }
    const job={
      crop:crop.id,
valve:valve,
start:crop.start,
end:crop.end,
duration: crop.duration
    }

    if (window.confirm("Czy zaplanować nawadnianie?")) {
      fetch(request(`${API_URL}/schedule`, "POST", job))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        //this.props.refreshCrops();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => Promise.reject(new Error(error)));
    } else {
    } 
  }*/

  deleteCrop(crop){
    if (window.confirm("Czy usunąć zasiew?")) {
      fetch(request(`${API_URL}/deletecrop`, "POST", {"crop_id": crop.id}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        this.props.refreshCrops();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => Promise.reject(new Error(error)));
    } else {
    }

  }

  editNotes(e){
    e.preventDefault();
    this.setState({notes:e.target.value});
  }

  saveNotes(){
    const notes=this.state.notes;
    fetch(request(`${API_URL}/savenotes`, "POST", {"crop_id": this.props.crop.id, "notes": notes}))
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        this.setState({editNotesEnabled:false});
       // alert("Notatki edytowane")
        this.props.refreshCrops();
      } else {
        alert("SQL Erro - błędne wartości!")
      }
    })
    .catch((error) => Promise.reject(new Error(error)));
  }




  componentDidMount(){
  }

  enter(e){
    if (e.key === 'Enter') {
//alert("PEDAU");
    }
  }

  //<textarea disabled={this.state.editNotesEnabled} onChange={this.editNotes} className='cropNotes'>  </textarea>

render(){
const microgreenData=this.props.microgreenData;
const shelfData=this.props.shelfData;
const crop=this.props.crop;
console.log(crop);
console.log(microgreenData);

  return (
     <tr className='cropEntry' key={this.props.index}>
        <td className='color' style={{backgroundColor:this.props.microgreenData.color}}> </td>
        <td>{microgreenData.name_pl}</td>
        <td>{moment(crop.start).format('DD.MM.YYYY')}</td>
        <td>{moment(crop.blackoutStart).format('DD.MM.YYYY')}</td>
        <td>{moment(crop.lightExposureStart).format('DD.MM.YYYY')}</td>
        <td>{moment(crop.harvest).format('DD.MM.YYYY')}</td>
        <td>{shelfData.rack_name + shelfData.level}</td>
        <td>{crop.trays}</td>
        <td className='cropNotes'>{this.state.editNotesEnabled && Number(crop.id)===Number(this.props.selectedCrop) ?
        <div className='cropNotesEnabled'><textarea onKeyDown={this.enter} rows="8" onChange={this.editNotes}  type="text" value={this.state.notes}></textarea><FontAwesomeIcon onClick={this.saveNotes} icon={faCheckCircle} size="lg" /></div>
:<div className='cropNotesDisabled' onClick={this.triggerEditNotes}><textarea disabled rows="2" onChange={this.editNotes}  type="text" value={this.state.notes}></textarea></div>}</td>
        <td  onClick={()=>this.deleteCrop(crop)}><FontAwesomeIcon icon={faTrashAlt} size="lg" /></td>
    </tr>);}
}


export default Crop;
