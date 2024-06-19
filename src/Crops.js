import './Crops.css';
import React from 'react';
import moment from 'moment';
import { API_URL, request } from "./APIConnection";
import Crop from './Crop';
import WeekView from './WeekView';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCalendarCheck, faCheckToSlot } from "@fortawesome/free-solid-svg-icons";
//import { isMobile } from 'react-device-detect';

import { groupByDay } from './ViewCommon';
//const WATERING_API = 'http://192.168.2.6:3051';
const WATERING_API = 'http://localhost:3051';


class Crops extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      microgreensID: 99,
      shelfID: '',
      trays: '',
      notes: '',
      harvest: '',
      start: '',
      cropDateFrom: moment().subtract(15, 'days'),
      cropDateTo: moment().add(15, 'days'),
      clicks: Number(0),
      showACF: false,
      showAllCrops: false,
      showWeekView: false,
      scheduledTDC: [],
      selectedCrop:null,
      sim:null
    }
    this.handleMicrogreens = this.handleMicrogreens.bind(this);
    this.handleTrays = this.handleTrays.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleHarvest = this.handleHarvest.bind(this);
    this.handleRangeSelection = this.handleRangeSelection.bind(this);
    this.handleCropDateFrom=this.handleCropDateFrom.bind(this);
    this.handleCropDateTo=this.handleCropDateTo.bind(this);
    this.renderMicrogreensSelection = this.renderMicrogreensSelection.bind(this);
    this.renderShelvesSelection = this.renderShelvesSelection.bind(this);
    this.addCrops = this.addCrops.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.setSelectedCrop = this.setSelectedCrop.bind(this);
    this.renderRangeCropsTable = this.renderRangeCropsTable.bind(this);
    this.showWeekView = this.showWeekView.bind(this);
    this.saveScheduleTDC = this.saveScheduleTDC.bind(this);
    this.scheduleWatering = this.scheduleWatering.bind(this);
    this.deleteCrop=this.deleteCrop.bind(this);
    this.updateSim=this.updateSim.bind(this);
    this.resetSchedule=this.resetSchedule.bind(this);
  }


  componentDidMount() {
  }



  handleMicrogreens(event) {
    this.setState({ microgreensID: event.target.value });
  }

  handleTrays(event) {
    this.setState({ trays: event.target.value })
  }
  handleNotes(event) {
    this.setState({ notes: event.target.value })
  }

  handleHarvest(event) {
    this.setState({ harvest: event.target.value })
  }

  handleStart(event) {
    this.setState({ start: event.target.value })
  }

  handleCropDateFrom(event){
    this.setState({ cropDateFrom: moment(event.target.value)});
  }

  handleCropDateTo(event){
    this.setState({ cropDateTo: moment(event.target.value)});
  }

  setSelectedCrop(id) {
    this.setState({ selectedCrop: id });
  }



  renderMicrogreensSelection() {
    const microgreens = JSON.parse(JSON.stringify(this.props.microgreens));
    microgreens.unshift({ id: 99, name_pl: "MICROGREENS", name_en: "MICROGREENS" });
    return microgreens.map((microgreen, index) => {
      return <option key={index} value={microgreen.id} id={microgreen.id}>{microgreen.name_pl}</option>
    });
  }


  renderShelvesSelection() {
    const shelves = JSON.parse(JSON.stringify(this.props.shelves));
    shelves.unshift({ id: 999, rack_name: "PÓŁKA", level: "" })
    return shelves.map((shelf, index) => {
      return <option key={index} value={shelf.id} id={shelf.id}>{shelf.rack_name + " " + shelf.level}</option>
    });
  }



  makeSimulation(microgreen) {
    if (this.state.harvest !== '') {
      const lightExposureStart = moment(this.state.harvest).subtract(microgreen.light, "days");
      const blackoutStart = moment(lightExposureStart).subtract(microgreen.blackout, "days");
      const start = moment(blackoutStart).subtract(microgreen.weight, "days");
      return <div className='simulation'>
        <div><p>Start:</p><p>{start.format('DD.MM.YYYY')}</p></div>
        <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
        <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
        <div><p>Zbiór:</p><p>{moment(this.state.harvest).format('DD.MM.YYYY')}</p></div>
      </div>
    } else if (this.state.start !== '') {
      const blackoutStart = moment(this.state.start).add(microgreen.weight, "days");
      const lightExposureStart = moment(blackoutStart).add(microgreen.blackout, "days");
      const harvest = moment(lightExposureStart).add(microgreen.light, "days");
      return <div className='simulation'>
        <div><p>Start:</p><p>{moment(this.state.start).format('DD.MM.YYYY')}</p></div>
        <div><p>Blackout:</p><p>{blackoutStart.format('DD.MM.YYYY')}</p></div>
        <div><p>Naświetlanie:</p><p>{lightExposureStart.format('DD.MM.YYYY')}</p></div>
        <div><p>Zbiór:</p><p>{harvest.format('DD.MM.YYYY')}</p></div>
      </div>
    }
  }

  calcDatesCrop(crops) {
    for (const crop of crops) {
      const microgreen = this.props.microgreens.find((x) => x.id === crop.microgreen_id);
      const lightExposureStart = moment(crop.harvest).subtract(microgreen.light, "days");
      const blackoutStart = moment(lightExposureStart).subtract(microgreen.blackout, "days");
      const start = moment(blackoutStart).subtract(microgreen.weight, "days");
      crop.lightExposureStart = lightExposureStart.format('YYYY-MM-DD');
      crop.blackoutStart = blackoutStart.format('YYYY-MM-DD');
      crop.start = start.format('YYYY-MM-DD');
    }
  }




  renderCropsTable() {
    const borderDate = moment().subtract(30, "days");
    const cropsLast2Weeks = this.props.crops.filter((x) => moment(x.harvest).isAfter(moment(borderDate)));
    this.calcDatesCrop(cropsLast2Weeks);
    return cropsLast2Weeks.map((crop, index) => {
      const microgreenData = this.props.microgreens.find((x) => x.id === crop.microgreen_id);
      return <Crop refreshCrops={this.props.refreshCrops} key={index} crop={crop} microgreenData={microgreenData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop} markedCrop={this.props.markedCrop}
        trays={this.props.trays} tdc={this.props.traydatecrops} refreshTDC={this.props.refreshTDC}></Crop>
    });
  }


  showWeekView(crop) {
    this.setState({ showWeekView: false });
    this.props.refreshTDC().then((tdc) => {
      this.setState({ showWeekView: true, selectedCrop: crop, tdc: tdc });
    });
  }

  renderRangeCropsTable() {
    const from = this.state.cropDateFrom;
    const to = this.state.cropDateTo;
    const cropsDates = JSON.parse(JSON.stringify(this.props.crops));
    this.calcDatesCrop(cropsDates);
    const rangeDateCrops = cropsDates.filter((x) =>
      (moment(x.harvest).isSameOrAfter(moment(from)) && moment(x.harvest).isSameOrBefore(moment(to)))
      || (moment(x.start).isSameOrAfter(moment(from)) && moment(x.start).isSameOrBefore(moment(to)))
      || (x.harvest === null) || (x.harvest === "undefined"));
   
/*      
const rangeDateCropsSorted=rangeDateCrops.sort((a,b)=> {
  const startA=moment(a.start);
  const startB=moment(b.start); 

  if (startA.isBefore(startB)) return -1;
  if (startB.isBefore(startA)) return 1;
  if (startA.isSame(startB)) return 0;
});*/
    return rangeDateCrops.map((crop, index) => {
      const microgreenData = this.props.microgreens.find((x) => x.id === crop.microgreen_id);

      return <Crop sim={this.state.sim} addCrop={false} deleteCrop={this.deleteCrop} setSelectedDay={this.props.setSelectedDay} refreshCrops={this.props.refreshCrops} index={index} crop={crop}
        microgreenData={microgreenData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop}
        markedCrop={this.props.markedCrop} microgreens={this.props.microgreens} trays={this.props.trays} tdc={this.props.tdc} crops={this.props.crops} showWeekView={this.showWeekView} refreshTDC={this.props.refreshTDC}
      ></Crop>
    });
  }

  deleteCrop(){
   this.setState({showWeekView:false,selectedCrop:undefined});
  }

  renderAllCropsTable() {
    const cropsDates = JSON.parse(JSON.stringify(this.props.crops));
    this.calcDatesCrop(cropsDates);
    return this.props.crops.map((crop, index) => {
      const microgreenData = this.props.microgreens.find((x) => x.id === crop.microgreen_id);
      return <Crop sim={this.state.sim} addCrop={false} deleteCrop={this.deleteCrop} setSelectedDay={this.props.setSelectedDay} refreshCrops={this.props.refreshCrops} index={index} crop={crop}
      microgreenData={microgreenData} setSelectedCrop={this.setSelectedCrop} selectedCrop={this.state.selectedCrop}
      markedCrop={this.props.markedCrop} microgreens={this.props.microgreens} trays={this.props.trays} tdc={this.props.tdc} crops={this.props.crops} showWeekView={this.showWeekView} refreshTDC={this.props.refreshTDC}></Crop>
    });
  }


  handleRangeSelection(date, clicks, from, to) {
    if (clicks === 0) {
      this.setState({ cropDateFrom: from, cropDateTo: from }); return;
    } else if (clicks === 1) {
      this.setState({ cropDateTo: to });
      this.renderRangeCropsTable();
      return;
    }
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
        } else {
          alert("SQL Erro - błędne wartości!")
        }
      })
      .catch((error) => {alert("Nie udało się dodać zasiewu!"); return error});
  }


  saveScheduleTDC(crop, tdcs, harvest) {
    const microgreens=this.props.microgreens;
    const microgreenData=microgreens.find((x)=>x.id===this.state.selectedCrop.microgreen_id);

    fetch(request(`${API_URL}/savescheduletdc`, "POST", { crop_id: crop, tdcs: tdcs, harvest: harvest,light:microgreenData.light }))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshTDC();
          this.props.refreshCrops();
          alert("Zasiew zaktualizowany.")
        } else {
          alert("SQL Erro - błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd zapisu harmonogramu!"); return error});
  }

  refreshTDC() {
    this.props.refreshTDC();
  }

  groupByFNDTrays(grpDay) {
    const crops = this.props.crops;
    const microgreens = this.props.microgreens;
    const mapArr = [];

    for (const [day, arr] of Object.entries(grpDay)) {
      const arr2 = arr.filter((x) => x.crop_id !== null);
      const grp = [];
      for (let entry of arr2) {
        const cropData = crops.find((x) => x.id === entry.crop_id);
        entry.cropData = cropData;
        const microgreensData = microgreens.find((x) => x.id === cropData.microgreen_id);
        entry.microgreensData = microgreensData;
        if (!grp[entry.fndtray_id]) grp[entry.fndtray_id] = [];
        grp[entry.fndtray_id].push(entry);
      }
      mapArr.push(grp);
    }
    return mapArr;
  }

  scheduleWatering() {
    if (window.confirm('Czy jesteś pewien, że chcesz zaplanować nawadnianie (reset obecnego harmonogramu)?')) {

    const tdc = this.props.tdc;
    const start=moment().startOf('day');
    const finish=moment().week(start.isoWeek() +1).weekday(7);
    const scheduleTDC=this.tdcDateRange(tdc,start,finish)
    const grp = groupByDay(scheduleTDC, this.props.trays);
    const schedule = this.groupByFNDTrays(grp);
const filteredScheduleTDC=scheduleTDC.filter((x)=>x.crop_id!==null);
const cropsListArr=(filteredScheduleTDC.map((x)=> x.crop_id));
const cropsListSet=new Set(cropsListArr);
const cropsList=Array.from(cropsListSet.values());
    fetch(request(`${WATERING_API}/schedule`, "POST", { schedule: schedule }))
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        if (result.success) {
          console.log("GIT WATERING API");
          fetch(request(`${API_URL}/schedulewatering`, "POST", {crops:cropsList}))
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            if (result.success) {
              alert("Harmonogram nawadniania zaktualizowany!")
              this.props.refreshCrops();
            } else {
              alert("SQL Erro - błędne wartości!")
            }
          })
          .catch((error) => {alert("Nie udało się dodać zasiewu!"); console.log(error); return error});

        } else {
          alert("SQL Error - błędne wartości!")
        }
      })
      .catch((error) => {alert("Błąd! Rescheduling nieudany!"); return error});
    } else{

    }
  }

  updateSim(sim){
    this.setState({sim:sim});
    }

tdcDateRange(tdc,start,finish){
      const startDate = moment(start).startOf("day");
      const finishdate = moment(finish).endOf("day");
      const TDC = [];
      for (const entry of tdc) {
        if (
          moment(entry.date).isBetween(startDate, finishdate, undefined, "[]")
        ) {
          let entryCp = JSON.parse(JSON.stringify(entry));
          let entryDate = moment(entryCp.date);
          entryCp.date = entryDate.format("DD.MM.YYYY");
          TDC.push(entry);
        }
      }
      return TDC;
  }    
    

  weekTDC(tdc) {
    const weekNow = moment().weeks();
    const weekNowMon = moment()
      .week(weekNow)
      .weekday(1)
      .startOf("day");
    const weekNowSun = moment()
      .week(weekNow)
      .weekday(7)
      .endOf("day");
    const weekTDC = [];
    for (const entry of tdc) {
      if (
        moment(entry.date).isBetween(weekNowMon, weekNowSun, undefined, "[]")
      ) {
        let entryCp = JSON.parse(JSON.stringify(entry));
        let entryDate = moment(entryCp.date);
        entryCp.date = entryDate.format("DD.MM.YYYY");
        weekTDC.push(entry);
      }
    }

    return weekTDC;
  }


  resetSchedule(){
    const tdc = this.props.tdc;
    const start=moment().startOf('day');
    const finish=moment().week(start.isoWeek() +1).weekday(7);
    const scheduleTDC=this.tdcDateRange(tdc,start,finish)
const filteredScheduleTDC=scheduleTDC.filter((x)=>x.crop_id!==null);
const cropsListArr=(filteredScheduleTDC.map((x)=> x.crop_id));
const cropsListSet=new Set(cropsListArr);
const cropsList=Array.from(cropsListSet.values());


    if (window.confirm('Wyczyścić harmonogram nawadniania?')) {
    fetch(request(`${WATERING_API}/cleanschedule`, 'GET'))
    .then(res => res.json())
    .then(result => {
      console.log(result);
      fetch(request(`${API_URL}/cleanschedule`, "POST", {crops:cropsList}))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshCrops();
          alert("Harmonogram nawadaniania wyczyszczony.");
        }
      });
    });
  }
  }

  render() {
    let cropsTable;
    if (this.props.crops !== '') cropsTable = this.renderRangeCropsTable();
    const allCrops = this.renderAllCropsTable();

    const head=<div className='head'>
    <div>Kolor</div><div className='cropType'>Rodzaj</div><div>Start</div><div>Blackout</div><div>Światło</div><div>Zbiór</div><div className="trays">Tace</div><div className='cropNotes'>Notatki</div>
    <div className="iconTD"><FontAwesomeIcon icon={faTrashAlt} size="lg"/></div><div className="iconTD"><FontAwesomeIcon icon={faCalendarCheck} size="lg" />
    </div><div className="iconTD"><FontAwesomeIcon icon={faCheckToSlot} size="lg" /></div>
  </div>;
   
    return (
      <div className='Crops'>
        <div id="cropList">
          <div id="scheduleManager">
          <div id="schedulerDiv"><button onClick={this.scheduleWatering}>SCHEDULER</button></div>
          <div id="resetScheduleDiv"><button onClick={this.resetSchedule}>RESET HARMONOGRAMU</button></div>
          </div>
         <div id="cropDateRange">
          <fieldset>
        <legend>ZAKRES</legend>
            <input type="date" onChange={this.handleCropDateFrom} value={this.state.cropDateFrom.format('YYYY-MM-DD')}></input>
            <span> - </span>
            <input type="date" min={this.state.cropDateFrom.clone().add(7,"days").format('YYYY-MM-DD')} onChange={this.handleCropDateTo} value={this.state.cropDateTo.format('YYYY-MM-DD')}></input>
            </fieldset>
            {this.state.showAllCrops ? <button onClick={() => this.setState({ showAllCrops: false })}>UKRYJ</button> :<button onClick={() => this.setState({ showAllCrops: true })}>WSZYSTKIE</button>}
            </div>
         {cropsTable.length >0 ? 
          <div id="cropsTable">
          {head}
            <div className='body'>
              {cropsTable}
            </div>
          </div>:''}
          {this.state.showWeekView ? <WeekView updateSim={this.updateSim} addCrop={false} refreshTDC={this.props.refreshTDC} saveScheduleTDC={this.saveScheduleTDC} selectedCrop={this.state.selectedCrop} className="scheduleCrop" trays={this.props.trays} tdc={this.state.tdc} microgreens={this.props.microgreens} crops={this.props.crops} setSelectedDay={this.props.setSelectedDay} setSelectedCrop={this.props.setSelectedCrop} ></WeekView> : null}
          {this.state.showAllCrops ?
            <div id="allCrops">
                {head}
                <div className='body'>
                  {allCrops}
                </div>
              </div> :null}
        </div>
      </div>
    );
  }
}


export default Crops;
