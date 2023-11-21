import './Crops.css';
import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle } from "@fortawesome/free-solid-svg-icons";




class Microgreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      editMicrogreensEnabled:false,
      id:this.props.microgreen.id,
      name_pl: this.props.microgreen.name_pl,
      name_en: this.props.microgreen.name_en,
      grams_tray:this.props.microgreen.grams_tray,
      top_water: this.props.microgreen.top_water,
      bottom_water: this.props.microgreen.bottom_water,
      weight: this.props.microgreen.weight,
      blackout: this.props.microgreen.blackout,
      light: this.props.microgreen.light,
      color:this.props.microgreen.color
    }
this.enableEditMicrogreens=this.enableEditMicrogreens.bind(this);
this.deleteMicrogreens=this.deleteMicrogreens.bind(this);
this.handleNamePL=this.handleNamePL.bind(this);
this.handleNameEN=this.handleNameEN.bind(this);
this.handleGramsTray=this.handleGramsTray.bind(this);
this.handleBottomWater=this.handleBottomWater.bind(this);
this.handleTopWater=this.handleTopWater.bind(this);
this.handleWeight=this.handleWeight.bind(this);
this.handleBlackout=this.handleBlackout.bind(this);
this.handleLight=this.handleLight.bind(this);
this.handleColor=this.handleColor.bind(this);
this.saveMicrogreen=this.saveMicrogreen.bind(this);
this.enter=this.enter.bind(this);
}



  deleteMicrogreens(crop){
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


  enableEditMicrogreens(){
    this.props.setSelectedMicrogreens(this.props.microgreen.id);
    this.setState({editMicrogreensEnabled: true});
  }

  disableEdit(){
    this.setState({editMicrogreensEnabled: false});
  }
handleNamePL(e){
  this.setState({name_pl:e.target.value});
}

handleNameEN(e){
  this.setState({name_en:e.target.value});
}

handleGramsTray(e){
  this.setState({grams_tray:e.target.value});
}
handleTopWater(e){
  this.setState({top_water:e.target.value});
}

handleBottomWater(e){
  this.setState({bottom_water:e.target.value});
}
handleWeight(e){
  this.setState({weight:e.target.value});
}

handleBlackout(e){
  this.setState({blackout:e.target.value});
}

handleLight(e){
  this.setState({light:e.target.value});
}

handleColor(e){
  this.setState({color:e.target.value});
}

saveMicrogreen(){
  const microgreensData=this.state;
  delete microgreensData.editMicrogreensEnabled;
  this.props.editMicrogreens(microgreensData);
  this.setState({editMicrogreensEnabled:false});
}

enter(e){
  if (e.key === 'Enter') {
this.saveMicrogreen();
  }
}



render(){
  
const microgreen=this.props.microgreen;
const isEditEnabled=this.state.editMicrogreensEnabled;
const selectedMicrogreens=this.props.selectedMicrogreens;
const amISelectedToEdit=isEditEnabled && selectedMicrogreens===microgreen.id;
  return (
    <tr className={"MicrogreenEntry " + (amISelectedToEdit ? "edit":"") } onClick={this.enableEditMicrogreens} key={this.props.index} onKeyDown={this.enter}>
    <td>{ amISelectedToEdit ?<input   type="text" value={this.state.name_pl} onChange={this.handleNamePL}></input>:microgreen.name_pl}</td>
    <td>{amISelectedToEdit ? <input type="text" value={this.state.name_en} onChange={this.handleNameEN}></input>:microgreen.name_en}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.grams_tray} onChange={this.handleGramsTray}></input>:microgreen.grams_tray}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.top_water} onChange={this.handleTopWater}></input>:microgreen.top_water}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.bottom_water} onChange={this.handleBottomWater}></input>:microgreen.bottom_water}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.weight} onChange={this.handleWeight}></input>:microgreen.weight}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.blackout} onChange={this.handleBlackout}></input>:microgreen.blackout}</td>
    <td>{ amISelectedToEdit? <input type="text" value={this.state.light} onChange={this.handleLight}></input>:microgreen.light}</td>
    <td>{this.state.weight+this.state.blackout+this.state.light}</td>
    <td style={{backgroundColor:microgreen.color}}>{ amISelectedToEdit? <input type="color" value={this.state.color} onChange={this.handleColor}></input>:microgreen.color.toUpperCase()}</td>
    { amISelectedToEdit ? <td onClick={this.saveMicrogreen}><FontAwesomeIcon icon={faCheckCircle} size="lg"/></td>:null}
</tr>);}
}


export default Microgreen;
