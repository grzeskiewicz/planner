import React from 'react';
import { API_URL, request } from "./APIConnection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCheckCircle, faEdit } from "@fortawesome/free-solid-svg-icons";




class Microgreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      editMicrogreensEnabled:false,
      id:this.props.microgreen.id,
      name_pl: this.props.microgreen.name_pl,
      name_en: this.props.microgreen.name_en,
      grams_tray:this.props.microgreen.grams_tray,
      grams_harvest:this.props.microgreen.grams_harvest,
      watering_level: this.props.microgreen.watering_level,
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
this.handleGramsHarvest=this.handleGramsHarvest.bind(this);
this.handleWateringLevel=this.handleWateringLevel.bind(this);
this.handleWeight=this.handleWeight.bind(this);
this.handleBlackout=this.handleBlackout.bind(this);
this.handleLight=this.handleLight.bind(this);
this.handleColor=this.handleColor.bind(this);
this.saveMicrogreen=this.saveMicrogreen.bind(this);
this.enter=this.enter.bind(this);
}



  deleteMicrogreens(microgreen){
    if (window.confirm("Czy usunąć definicję mikroliści?")) {
      fetch(request(`${API_URL}/deletemicrogreens`, "POST", {"id": microgreen.id}))
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        this.props.refreshMicrogreens();
        alert("Definicja mikroliści usunięta.");
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

handleGramsHarvest(e){
  this.setState({grams_harvest:e.target.value});
}
handleWateringLevel(e){
  this.setState({watering_level:e.target.value});
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
    <div className={"MicrogreenEntry " + (amISelectedToEdit ? "edit":"") } key={this.props.index} onKeyDown={this.enter}>
    <div>{ amISelectedToEdit? <input type="text" value={this.state.name_pl} onChange={this.handleNamePL}></input>:microgreen.name_pl}</div>
    <div>{amISelectedToEdit ? <input type="text" value={this.state.name_en} onChange={this.handleNameEN}></input>:microgreen.name_en}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.grams_tray} onChange={this.handleGramsTray}></input>:microgreen.grams_tray}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.grams_harvest} onChange={this.handleGramsHarvest}></input>:microgreen.grams_harvest}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.watering_level} onChange={this.handleWateringLevel}></input>:microgreen.watering_level}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.weight} onChange={this.handleWeight}></input>:microgreen.weight}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.blackout} onChange={this.handleBlackout}></input>:microgreen.blackout}</div>
    <div>{ amISelectedToEdit? <input type="number" value={this.state.light} onChange={this.handleLight}></input>:microgreen.light}</div>
    <div>{this.state.weight+this.state.blackout+this.state.light}</div>
    <div style={{backgroundColor:microgreen.color}}>{ amISelectedToEdit? <input type="color" value={this.state.color} onChange={this.handleColor}></input>:microgreen.color.toUpperCase()}</div>
    { !amISelectedToEdit? <div className="iconTD" onClick={() => this.deleteMicrogreens(microgreen)}>
          <FontAwesomeIcon icon={faTrashAlt} size="lg" />
        </div> :''}
        { !amISelectedToEdit? <div className="iconTD" onClick={this.enableEditMicrogreens}>
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </div>: ''}
    { amISelectedToEdit ? <div className='iconTD save' onClick={this.saveMicrogreen}><FontAwesomeIcon icon={faCheckCircle} size="lg"/></div>:null}
</div>);}
}


export default Microgreen;