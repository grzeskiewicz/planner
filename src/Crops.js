import './Crops.css';
import React from 'react';
import Calendar from './Calendar';
import moment from 'moment';
import { API_URL, request } from "./APIConnection";
import Crop from './Crop';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck,faCheckToSlot } from "@fortawesome/free-solid-svg-icons";
import {isMobile} from 'react-device-detect';



class Crops extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        microgreensID:99,
        shelfID:'',
        trays:'',
        notes:'',
        harvest:'',
        start:'',
        showHarvestSim:true,
        showCalendar:false,
        showCalendarRange:false,
        cropDateFrom :moment().subtract(15, 'days'),
        cropDateTo: moment(),
        clicks:Number(0),
        showACF:false
      }
      this.handleMicrogreens = this.handleMicrogreens.bind(this);
      this.handleShelf = this.handleShelf.bind(this);
      this.handleTrays = this.handleTrays.bind(this);
      this.handleNotes = this.handleNotes.bind(this);
      this.handleHarvest=this.handleHarvest.bind(this);
      this.handleDaySelection=this.handleDaySelection.bind(this);
      this.handleRangeSelection=this.handleRangeSelection.bind(this);
      this.toggleCalendar=this.toggleCalendar.bind(this);
      this.renderMicrogreensSelection=this.renderMicrogreensSelection.bind(this);
      this.renderShelvesSelection=this.renderShelvesSelection.bind(this);
      this.addCrops=this.addCrops.bind(this);
      this.handleStart=this.handleStart.bind(this);
      this.toggleSimulation=this.toggleSimulation.bind(this);
      this.setSelectedCrop=this.setSelectedCrop.bind(this);
      this.toggleCalendarRange=this.toggleCalendarRange.bind(this);
      this.renderRangeCropsTable=this.renderRangeCropsTable.bind(this);
  }


  componentDidMount(){
  }

  renderMicrogreensSelection() {
    const microgreens=JSON.parse(JSON.stringify(this.props.microgreens));
    microgreens.unshift({id:99,name_pl: "MICROGREENS",name_en:"MICROGREENS"});
    return microgreens.map((microgreen, index) => {
        return <option key={index} value={microgreen.id} id={microgreen.id}>{microgreen.name_pl}</option>
    });
}


renderShelvesSelection() {
  const shelves=JSON.parse(JSON.stringify(this.props.shelves));
  shelves.unshift({id:999, rack_name: "PÓŁKA",level:""})
  return shelves.map((shelf, index) => {
      return <option key={index} value={shelf.id} id={shelf.id}>{shelf.rack_name + " " + shelf.level}</option>
  });
}

handleMicrogreens(event){
this.setState({microgreensID:event.target.value});
}
handleShelf(event){
  this.setState({shelfID:event.target.value})
}

handleTrays(event){
  this.setState({trays:event.target.value})
}
handleNotes(event){
  this.setState({notes:event.target.value})
}

handleHarvest(event){
  this.setState({harvest:event.target.value})
}

handleStart(event){
  this.setState({start:event.target.value})
}

toggleSimulation(){
  this.setState({showHarvestSim:!this.state.showHarvestSim,harvest:'',start:''});
}
makeSimulation(microgreen){
  console.log(microgreen)
  if (this.state.harvest!=='') {
 const lightExposureStart=moment(this.state.harvest).subtract(microgreen.light, "days");
 const blackoutStart=moment(lightExposureStart).subtract(microgreen.blackout, "days");
 const start=moment(blackoutStart).subtract(microgreen.weight, "days");
 return <div className='simulation'>
  <div><p>Start:</p><p>{start.format('DD.MM.YYYY')}</p></div>
  <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
  <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
  <div><p>Zbiór:</p><p>{moment(this.state.harvest).format('DD.MM.YYYY')}</p></div>
 </div>
  } else if (this.state.start!==''){
    const blackoutStart=moment(this.state.start).add(microgreen.weight, "days");
    const lightExposureStart=moment(blackoutStart).add(microgreen.blackout, "days");
    const harvest=moment(lightExposureStart).add(microgreen.light, "days");
    return <div className='simulation'>
    <div><p>Start:</p><p>{moment(this.state.start).format('DD.MM.YYYY')}</p></div>
 <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
 <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
 <div><p>Zbiór:</p><p>{harvest.format('DD.MM.YYYY')}</p></div>
</div>
  }
}

calcDatesCrop(crops){
  for (const crop of crops){
    const microgreen=this.props.microgreens.find((x)=> x.id===crop.microgreen_id);
    const lightExposureStart=moment(crop.harvest).subtract(microgreen.light, "days");
    const blackoutStart=moment(lightExposureStart).subtract(microgreen.blackout, "days");
    const start=moment(blackoutStart).subtract(microgreen.weight, "days");
    crop.lightExposureStart=lightExposureStart.format('YYYY-MM-DD');
    crop.blackoutStart=blackoutStart.format('YYYY-MM-DD');
    crop.start=start.format('YYYY-MM-DD');
  }
 }

 setSelectedCrop(id){
  console.log(id);
  this.setState({selectedCrop:id});
 }


renderCropsTable(){
  //filter here? last 2 weeks from now harvest date
  const borderDate=moment().subtract(30, "days");
  const cropsLast2Weeks=this.props.crops.filter((x)=> moment(x.harvest).isAfter(moment(borderDate)));
//console.log(cropsLast2Weeks);
  this.calcDatesCrop(cropsLast2Weeks);
  return cropsLast2Weeks.map((crop, index) => {
    const microgreenData=this.props.microgreens.find((x)=> x.id===crop.microgreen_id);
    const shelfData=this.props.shelves.find((x)=> x.id===crop.shelf_id);
return <Crop refreshCrops={this.props.refreshCrops} index={index} crop={crop} microgreenData={microgreenData} shelfData={shelfData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop} markedCrop={this.props.markedCrop}></Crop>
});
}

renderRangeCropsTable(){
  const from=this.state.cropDateFrom;
  const to=this.state.cropDateTo;
  console.log(from,to);
  const rangeDateCrops=this.props.crops.filter((x)=> 
  moment(x.start).isBefore(moment(from)) && moment(x.harvest).isAfter(moment(from)) ||
  moment(x.start).isBefore(moment(to)) && moment(x.harvest).isAfter(moment(to)) ||
  moment(x.start).isAfter(moment(from)) && moment(x.harvest).isBefore(moment(to)));
console.log(rangeDateCrops);
  this.calcDatesCrop(rangeDateCrops);
  return rangeDateCrops.map((crop, index) => {
    const microgreenData=this.props.microgreens.find((x)=> x.id===crop.microgreen_id);
    const shelfData=this.props.shelves.find((x)=> x.id===crop.shelf_id);
return <Crop refreshCrops={this.props.refreshCrops} index={index} crop={crop} microgreenData={microgreenData} shelfData={shelfData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop} markedCrop={this.props.markedCrop}></Crop>
});
}



renderAllCropsTable(){
  //filter here?
  this.calcDatesCrop(this.props.crops);
  return this.props.crops.map((crop, index) => {
    const microgreenData=this.props.microgreens.find((x)=> x.id===crop.microgreen_id);
    const shelfData=this.props.shelves.find((x)=> x.id===crop.shelf_id);
return <Crop refreshCrops={this.props.refreshCrops} index={index} crop={crop} microgreenData={microgreenData} shelfData={shelfData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop} markedCrop={this.props.markedCrop}></Crop>
});
}


handleDaySelection(date){
  this.state.showHarvestSim ?this.setState({harvest:date,showCalendar:false}):this.setState({start:date,showCalendar:false});
}

handleRangeSelection(date){

  if (this.state.clicks===0){
    console.log(0);
    this.setState({cropDateFrom: moment(date),clicks:1}); return;
  } else if (this.state.clicks===1)  {
    console.log(1);
    this.setState({cropDateTo:moment(date),clicks:0});
    this.renderRangeCropsTable();
    return;
  } else if (this.state.clicks===2) {console.log(2);this.setState({clicks:0});return;}
}

toggleCalendar(){
  this.setState({showCalendar:!this.state.showCalendar});
}

toggleCalendarRange(){
  //this.setState({showCalendarRange:!this.state.showCalendarRange});
  this.setState({showCalendarRange:true});

}

addCrops(event){
  event.preventDefault();
const crop={
start:this.state.start!=='' ? moment(this.state.start).format('YYYY-MM-DD'):'',
harvest:this.state.harvest !=='' ? moment(this.state.harvest).format('YYYY-MM-DD'):'',
microgreenID:this.state.microgreensID,
shelfID:this.state.shelfID,
trays:this.state.trays,
notes:this.state.notes
}  
fetch(request(`${API_URL}/addcrops`, "POST", crop))
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
}
//{this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}

render(){
  let cropsTable;
  if (this.props.crops!=='') cropsTable=this.renderRangeCropsTable();
const  mappedMicrogreens= this.renderMicrogreensSelection();
 const mappedShelves= this.renderShelvesSelection();
 const selectedMicrogreens=Number(this.state.microgreensID)!==99 ? this.props.microgreens.find((x)=> x.id===Number(this.state.microgreensID)): '' ;
 const addCropForm=<form className="" onSubmit={this.addCrops}>
 <div><input type="radio" id="harvest-option" checked={this.state.showHarvestSim} onChange={this.toggleSimulation} name="dateTypeSelect"></input><label for="harvest-option">DATA ZBIORU</label></div> 
 <div><input type="radio" id="start-option" checked={!this.state.showHarvestSim} onChange={this.toggleSimulation} name="dateTypeSelect"></input><label for="start-option">DATA ZASIEWU</label></div>
     {this.state.showHarvestSim ? 
     <input placeholder='DATA ZBIORU'  value={this.state.harvest!=='' ? moment(this.state.harvest).format('DD.MM.YYYY'):''} onChange={this.handleHarvest} onClick={this.toggleCalendar} required></input>:
     <input placeholder='DATA ZASIEWU' value={this.state.start!=='' ? moment(this.state.start).format('DD.MM.YYYY'):''} onChange={this.handleStart} onClick={this.toggleCalendar} required></input>}

     {this.state.showCalendar ?  <Calendar calendarType="addCrop" handleDaySelection={this.handleDaySelection}/> : null}
     <select id="microgreens-selection" name="microgreens-selection" onChange={this.handleMicrogreens} value={this.state.microgreensID}>
       {mappedMicrogreens}
         </select>
         <select id="shelf-selection" name="shelf-selection" onChange={this.handleShelf} value={this.state.shelfID}>
           {mappedShelves}
         </select>
         <select value={this.state.trays} onChange={this.handleTrays} required>
         <option value="99">ILE TAC?</option>
         <option value="1">1</option>
         <option value="2">2</option>
         <option value="3">3</option>
         <option value="4">4</option>
         <option value="5">5</option>
         <option value="6">6</option>
         <option value="7">7</option>
         <option value="8">8</option>
         </select>
<textarea rows="10" placeholder='NOTATKI' value={this.state.notes} onChange={this.handleNotes}></textarea>
       <button type='submit'>DODAJ</button>
 {Number(this.state.microgreensID) !== 99 ? this.makeSimulation(selectedMicrogreens) :'' }
</form>;
    console.log(this.state);

  return (
    <div className='Crops'>
    <div id="addCrops">
{isMobile ?<div className="acfWrapper"><button onClick={()=>this.setState({showACF:!this.state.showACF})}>DODAJ ZASIEW</button>{this.state.showACF ?<div>{addCropForm}</div>:''}</div>:<div>{addCropForm}</div>}
    </div>
    <div id="crop-list">
      <div id="cropDateRange">
        <div><p>Od</p><input placeholder={this.state.cropDateFrom}  value={moment(this.state.cropDateFrom).format('DD.MM.YYYY')}  onClick={this.toggleCalendarRange} required></input></div>
        <div><p>Do</p><input placeholder={this.state.cropDateTo}  value={moment(this.state.cropDateTo).format('DD.MM.YYYY')}  onClick={this.toggleCalendarRange} required></input></div>
      </div>
      {this.state.showCalendarRange ?  <Calendar calendarType="showCrops" handleDaySelection={this.handleRangeSelection}/> : null}
    <table>
<thead>
<tr><td></td><td>Rodzaj</td><td>Start</td><td>Blackout</td><td>Światło</td><td>Zbiór</td><td>Półka</td><td>Tace</td><td>Notatki</td><td>X</td><td><FontAwesomeIcon icon={faCalendarCheck} size="lg" />
</td><td><FontAwesomeIcon icon={faCheckToSlot} size="lg"/></td></tr>
</thead>
      <tbody>
        {cropsTable}
      </tbody>
</table>
</div>
    </div>
  );}
}


export default Crops;
