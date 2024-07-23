import React from 'react';
import {request,API_URL} from "./APIConnection";
import moment from 'moment';
import WeekView from './WeekView';
import Crop from './Crop';
import './addCrop.css';

class AddCrop extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        stage:1,
        crop: null,
        microgreensID: 99,
        notes:'',
        sim: null,
        start1:'',
        harvest1:'',
        showHarvestSim:true,
        showCalendar:false
      }
      this.addCrops=this.addCrops.bind(this);
      this.saveScheduleTDC=this.saveScheduleTDC.bind(this);
      this.handleMicrogreens=this.handleMicrogreens.bind(this);
      this.handleNotes=this.handleNotes.bind(this);
      this.updateSim=this.updateSim.bind(this);
      this.handleDaySelection=this.handleDaySelection.bind(this);
      this.handleHarvest=this.handleHarvest.bind(this);
      this.handleStart=this.handleStart.bind(this);
      this.toggleSimulation=this.toggleSimulation.bind(this);
      this.toggleCalendar=this.toggleCalendar.bind(this);
      this.makeSimulation=this.makeSimulation.bind(this);
}

componentDidMount(){
}


handleDaySelection(date) {
  this.state.showHarvestSim ? this.setState({ harvest1: date, showCalendar: false }) : this.setState({ start1: date, showCalendar: false });
}

handleHarvest(event) {
  this.setState({ harvest1: event.target.value })
}

handleStart(event) {
  this.setState({ start1: event.target.value })
}

toggleSimulation() {
  this.setState({ showHarvestSim: !this.state.showHarvestSim, harvest1: '', start1: '' });
}

toggleCalendar() {
  this.setState({ showCalendar: !this.state.showCalendar });
}

handleMicrogreens(event) {
this.setState({ microgreensID: event.target.value });
}

handleNotes(event) {
this.setState({ notes: event.target.value })
}

renderMicrogreensSelection() {
    const microgreens = JSON.parse(JSON.stringify(this.props.microgreens));
    microgreens.unshift({ id: 99, name_pl: "MICROGREENS", name_en: "MICROGREENS" });
    return microgreens.map((microgreen, index) => {
      return <option key={index} value={microgreen.id} id={microgreen.id}>{microgreen.name_pl}</option>
    });
  }


  addCrops(event) {
    event.preventDefault();
    const crop = {
      microgreenID: this.state.microgreensID,
      notes: this.state.notes
    }

    fetch(request(`${API_URL}/addcrops`, "POST", crop))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshCrops();
          this.setState({stage:2,crop: result.crop})
        } else {
          alert("SQL Error - błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd dodawania zasiewu!"); return error});
  }


  saveScheduleTDC(crop, tdcs, harvest) {
    const microgreens=this.props.microgreens;
    const microgreenData=microgreens.find((x)=>x.id===this.state.crop.microgreen_id);
    fetch(request(`${API_URL}/savescheduletdc`, "POST", { crop_id: crop, tdcs: tdcs, harvest: harvest,light:microgreenData.light }))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert("Zasiew zaktualizowany.");
          this.props.refreshCrops();
          this.props.setSelectedCrop(crop);
          this.props.refreshTDC();
        } else {
          alert("SQL Error - błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd zapisu harmonogramu!"); return error});
  }  

updateSim(sim){
this.setState({sim:sim});
}


makeSimulation(microgreen) {
  if (this.state.harvest1 !== '') {
    const lightExposureStart = moment(this.state.harvest1).subtract(microgreen.light, "days");
    const blackoutStart = moment(lightExposureStart).clone().subtract(microgreen.blackout, "days");
    const start = moment(blackoutStart).clone().subtract(microgreen.weight, "days");
    return <div className='simulation'>
      <div><p>Start:</p><p>{start.format('DD.MM.YYYY')}</p></div>
      <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
      <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
      <div><p>Zbiór:</p><p>{moment(this.state.harvest1).format('DD.MM.YYYY')}</p></div>
    </div>
  } else if (this.state.start1 !== '') {
    const blackoutStart = moment(this.state.start1).add(microgreen.weight, "days");
    const lightExposureStart = moment(blackoutStart).clone().add(microgreen.blackout, "days");
    const harvest = moment(lightExposureStart).clone().add(microgreen.light, "days");
    return <div className='simulation'>
      <div><p>Start:</p><p>{moment(this.state.start1).format('DD.MM.YYYY')}</p></div>
      <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
      <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
      <div><p>Zbiór:</p><p>{harvest.format('DD.MM.YYYY')}</p></div>
    </div>
  }
}

render(){
  const microgreens=this.props.microgreens;
  const microgreenData=this.state.stage===2 ? microgreens.find((x)=>x.id===this.state.crop.microgreen_id) : null;
    const mappedMicrogreens = this.renderMicrogreensSelection();

    let microgreenDataSim='';
    if (Number(this.state.microgreensID) !== 99) microgreenDataSim=microgreens.find((x)=>Number(x.id)===Number(this.state.microgreensID));

    const addCropForm = <form id="addCropForm" onSubmit={this.addCrops}>
      <select id="microgreens-selection" name="microgreens-selection" onChange={this.handleMicrogreens} value={this.state.microgreensID}>
        {mappedMicrogreens}
      </select>
      <textarea rows="10" placeholder='NOTATKI' value={this.state.notes} onChange={this.handleNotes}></textarea>
      <button type='submit'>DODAJ</button>

      <fieldset id="cropSim">
        <legend>SYMULACJA</legend>
        <div><input type="radio" id="harvest-option" checked={this.state.showHarvestSim} onChange={this.toggleSimulation} name="dateTypeSelect"></input><label>DATA ZBIORU</label></div>
        <div><input type="radio" id="start-option" checked={!this.state.showHarvestSim} onChange={this.toggleSimulation} name="dateTypeSelect"></input><label>DATA ZASIEWU</label></div>
        {this.state.showHarvestSim ?
          <input type="date" value={this.state.harvest1 !== '' ? moment(this.state.harvest1).format('YYYY-MM-DD'): ''} onChange={this.handleHarvest}></input> :
          <input type="date" value={this.state.start1 !== '' ? moment(this.state.start1).format('YYYY-MM-DD') : ''} onChange={this.handleStart}></input>}

        {Number(this.state.microgreensID) !== 99 ?  this.makeSimulation(microgreenDataSim) : ''}
      </fieldset> 
    </form>;

  return (
    
<div id='addCrop'>
{this.state.stage===1 ? addCropForm : null}
{this.state.stage===2 ?
<div className='cropEntryWrapper'>
<div className='head'>
                  <div></div><div className='cropType'>Rodzaj</div><div>Start</div><div>Blackout</div><div>Światło</div><div>Zbiór</div><div>Tace</div><div>Notatki</div><div>X</div></div>
<Crop sim={this.state.sim} addCrop={true} refreshCrops={this.props.refreshCrops} crop={this.state.crop} microgreenData={microgreenData} setSelectedCrop={this.props.setSelectedCrop}
        trays={this.props.trays} tdc={this.props.traydatecrops} refreshTDC={this.props.refreshTDC}></Crop></div>:''}
{this.state.stage===2 ? <WeekView addCrop={1} updateSim={this.updateSim} refreshTDC={this.props.refreshTDC} saveScheduleTDC={this.saveScheduleTDC} selectedCrop={this.state.crop} className="scheduleCrop" trays={this.props.trays} tdc={this.props.tdc} 
microgreens={this.props.microgreens} crops={this.props.crops} setSelectedDay={this.props.setSelectedDay} setSelectedCrop={this.props.setSelectedCrop}></WeekView>: null}
        </div>);}
}


export default AddCrop;
