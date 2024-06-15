import React from "react";
import moment from "moment";
import "./WeekView.css";
import { calcDatesCrop, renderByMicrogreens, groupByShelves, groupByDay, groupByFNDTrays } from "./ViewCommon";
import FNDTray from "./FNDTray";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
//tdc - traydatecrop

class WeekView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weekNow: this.props.className==="month" ? this.props.weekNow : moment().isoWeek(),
      toggleVal: true,
      checkedItems: this.setChecked(),
      tdc: JSON.parse(JSON.stringify(this.props.tdc)),
      tdcOriginal: JSON.parse(JSON.stringify(this.props.tdc)),
      weekTDC: "",
      scheduledTDC: [],
      blockDate: undefined,
      lightExposureStart:undefined
    };
    this.minusWeek = this.minusWeek.bind(this);
    this.plusWeek = this.plusWeek.bind(this);
    this.weekCrops = this.weekCrops.bind(this);
    this.weekTDC = this.weekTDC.bind(this);
    this.showDayView = this.showDayView.bind(this);
    this.toggleView = this.toggleView.bind(this);
    this.handleScheduleTDC = this.handleScheduleTDC.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.saveScheduleTDC = this.saveScheduleTDC.bind(this);
    this.fillScheduledTDC = this.fillScheduledTDC.bind(this);
  }

  componentDidMount() {
    this.fillScheduledTDC();
  }

  fillScheduledTDC() {
    if (this.props.className === "scheduleCrop") {
      const crop=this.props.selectedCrop;
      const microgreenData=this.props.microgreens.find((x)=>x.id===crop.microgreen_id);
      const light=microgreenData.light;
      if (crop.harvest){
      const tdc =  JSON.parse(JSON.stringify(this.state.tdc));
      const start = moment(crop.lightExposureStart);
      const finish = moment(crop.harvest);

      const scheduledTDC = tdc.filter((x) => moment(x.date).isBetween(start, finish, undefined, "[]"));
      this.setState({ scheduledTDC: scheduledTDC }); 

      } else {
        const tdc =  JSON.parse(JSON.stringify(this.state.tdc));
        const start =moment().week(this.props.className!=="month"? this.state.weekNow-1: this.props.weekNow-1).startOf("week");
        const finish = moment().week(this.props.className!=="month"? this.state.weekNow:this.props.weekNow).endOf("week").add(5*light,"days"); 
       
        const scheduledTDC = tdc.filter((x) => moment(x.date).isBetween(start, finish, undefined, "[]"));      
        this.setState({ scheduledTDC: scheduledTDC });
      }
    }
  }

  createRack(grpByShelves) {
    const rack = (
      <div className="rack">
        {this.createShelf(grpByShelves, 0)}
        {this.createShelf(grpByShelves, 1)}
        {this.createShelf(grpByShelves, 2)}
        {this.createShelf(grpByShelves, 3)}
      </div>
    );
    return rack;
  }

  createShelf(grpByShelves, i) {

    const isScheduled= (this.props.className==="scheduleCrop" && this.props.selectedCrop.harvest) ? true: false;
    const blockDate2 = isScheduled ? this.props.selectedCrop.lightExposureStart:undefined;
    const blockDate = this.state.blockDate !== undefined ? this.state.blockDate : blockDate2;

    const row = (
      <div className="row">
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[0][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[0][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[1][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[1][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[2][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops} ></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[2][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[3][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[3][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} >
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[4][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[4][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} >
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[5][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[5][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
        <div className="shelf" style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[6][i][0]} pos="L" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
          <FNDTray blockDate={blockDate} range="week" tray={grpByShelves[6][i][1]} pos="P" handleScheduleTDC={this.handleScheduleTDC} selectedCrop={this.props.selectedCrop} microgreens={this.props.microgreens} crops={this.props.crops}></FNDTray>
        </div>
      </div>
    );
    return row;
  }

  renderByFND(grpByFNDT, days) {
    const arr = [];

    for (let i = 0; i < days; i++) {
      const grpByShelves = groupByShelves(grpByFNDT[i]);
      if (grpByShelves !== undefined) arr.push(grpByShelves);
    }
    if (arr.length > 0) {
      const rack = this.createRack(arr);
      return rack;
    } else return;
  }

  weekCrops(crops) {
    //crops which are during selected week
    const weekNowMon = moment()
      .week(this.props.className!=="month"? this.state.weekNow:this.props.weekNow)
      .weekday(1)
      .startOf("day");
    const weekNowSun = moment()
      .week(this.props.className!=="month"? this.state.weekNow:this.props.weekNow)
      .weekday(7)
      .endOf("day");
    const weekCrops = [];
    for (const crop of crops) {
      if (
        weekNowMon.isSameOrBefore(moment(crop.harvest)) &&
        weekNowSun.isSameOrAfter(moment(crop.start))
      ) {
        weekCrops.push(crop);
      }
    }
    return weekCrops;
  }

  weekTDC(tdc) {
    //crops which are during selected week
    const weekNowMon = moment()
      .week(this.props.className!=="month"? this.state.weekNow:this.props.weekNow)
      .weekday(1)
      .startOf("day");
    const weekNowSun = moment()
      .week(this.props.className!=="month"? this.state.weekNow:this.props.weekNow)
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


  minusWeek() {
    this.setState({ weekNow: this.state.weekNow - 1 });
  }

  plusWeek() {
    this.setState({ weekNow: this.state.weekNow + 1 });
  }

  showDayView(day) {
    this.props.setSelectedDay(day);
  }

  toggleView() {
    this.setState({ toggleVal: !this.state.toggleVal });
  }

  setChecked() {
    const checkedItems = new Map();
    for (const item of this.props.microgreens) {
      checkedItems.set(item.name_pl, true);
    }
    return checkedItems;
  }

  handleCheck = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  };

  renderMicrogreensFilter() {
    return this.props.microgreens.map((microgreen, index) => {
      return (
        <div style={{ backgroundColor: microgreen.color }}>
         {this.state.toggleVal ? '' : 
         <input
            key={microgreen.id}
            checked={this.state.checkedItems.get(microgreen.name_pl)}
            onChange={this.handleCheck}
            type="checkbox"
            name={microgreen.name_pl}/>}
          <p>{microgreen.name_pl}</p>
        </div>
      );
    });
  }


  mergeTDC(sch,tdc){
    for (let i=0;i<tdc.length;i++){
     const corr= sch.find((x)=> x.id===tdc[i].id);
   if (corr!==undefined) tdc[i]=corr;
    }
        return tdc;
      }


  handleScheduleTDC(tray) { 
        if (this.props.className === "scheduleCrop") {
          const tdc=JSON.parse(JSON.stringify(this.state.tdc));
          const selectedCrop = this.props.selectedCrop;
          const microgreenData = this.props.microgreens.find((x) => x.id === selectedCrop.microgreen_id);
         // console.log(microgreenData);
          let scheduledTDC = JSON.parse(JSON.stringify(this.state.scheduledTDC));

          let blockDate= selectedCrop.harvest !==null? moment(selectedCrop.lightExposureStart).set({hours:12,minutes:0}): moment(tray.date).set({hours:12,minutes:0}); //blockDate - czas startu naświetlania
          const stop=blockDate.clone().add(microgreenData.light-1,"days"); //koiniec 

          scheduledTDC=scheduledTDC.filter((x) => moment(x.date).isBetween(blockDate.startOf('day'),stop.endOf('day'), undefined, "[]"));     

          const traySchedule=scheduledTDC.filter((x)=>x.tray_id===tray.tray_id); // cały zakres dni (dat) dla danej tacy
      
 const isTaken=traySchedule.find((x)=>x.crop_id!==null); //czy jest już jakaś rezerwacja cropa na tacy
          if (isTaken===undefined){ //jeżeli brak zajetej tacy w innych dniach
const wasOcc=tray.crop_id!==null; //czy klikana taca zawiera zasiew

if (wasOcc){
  for (const entry of scheduledTDC) {
    if (entry.tray_id===tray.tray_id) {
      entry.status = "0";
      entry.crop_id = null;
    }
    }
  } else { 
  for (const entry of scheduledTDC) {
    if (entry.tray_id===tray.tray_id) {
    entry.status = "1";
    entry.crop_id = selectedCrop.id;
    }
  }
}

const mergedTDC=this.mergeTDC(scheduledTDC,tdc);

const harvestSim=blockDate.clone().add(microgreenData.light,"days");
const lightStartSim=blockDate.clone();
const blackoutSim=lightStartSim.clone().subtract(microgreenData.blackout,"days");
const startSim=blackoutSim.clone().subtract(microgreenData.weight,"days");

const fillTrays=mergedTDC.filter((x) => x.status === "1" && x.crop_id===selectedCrop.id);
const fillTraysIDs = fillTrays.map((x) => x.id);

const trays=fillTraysIDs.length/microgreenData.light;

const sim={
  start:startSim,
  blackout:blackoutSim,
  light:lightStartSim,
  harvest:harvestSim,
  trays:trays
}

//if (this.props.addCrop)
   this.props.updateSim(sim); 
//if (this.props.className!=="main") this.props.updateSim(sim); 


this.setState({blockDate:blockDate,scheduledTDC:scheduledTDC,tdc:mergedTDC});

    } else { //jezeli dany tray jest zajety
      let lightExposureStart;
      if (selectedCrop.id===tray.crop_id){ //ale zasiew jest tożsamy z wybieranym
       
       //const isLast=scheduledTDC.filter((x) => x.crop_id === selectedCrop.id).length===0;
        for (const entry of scheduledTDC) {
          if (entry.tray_id===tray.tray_id) {
            entry.status = "0";
            entry.crop_id = null;
          }
          }

          const mergedTDC=this.mergeTDC(scheduledTDC,tdc);
          const isLast=mergedTDC.filter((x) => x.crop_id === selectedCrop.id).length===0;

          const harvestSim=!isLast? blockDate.clone().add(microgreenData.light,"days"):null;
          const lightStartSim=!isLast?  blockDate.clone():null;
          const blackoutSim=!isLast? lightStartSim.clone().subtract(microgreenData.blackout,"days"):null;
          const startSim=!isLast? blackoutSim.clone().subtract(microgreenData.weight,"days"):null;





          if (isLast) lightExposureStart=blockDate.clone(); blockDate=undefined; 
         // if (isLast) blockDate=undefined; 
          const fillTrays=mergedTDC.filter((x) => x.status === "1" && x.crop_id===selectedCrop.id);
const fillTraysIDs = fillTrays.map((x) => x.id);

const trays=fillTraysIDs.length/microgreenData.light;

const sim={
  start:startSim,
  blackout:blackoutSim,
  light:lightStartSim,
  harvest:harvestSim,
  trays:trays
  }

//if (this.props.addCrop)
   this.props.updateSim(sim); 


//console.log(scheduledTDC)
this.setState({blockDate:blockDate,scheduledTDC:scheduledTDC,tdc:mergedTDC,lightExposureStart:lightExposureStart});
      }
    }
  }
  }

  saveScheduleTDC() {
    const crop=this.props.selectedCrop;
    const microgreenData=this.props.microgreens.find((x)=>x.id===crop.microgreen_id);
    const light=microgreenData.light;
    const blockDate=this.state.blockDate===undefined ? moment(this.state.lightExposureStart).set({hours:12,minutes:0}) : moment(this.state.blockDate).set({hours:12,minutes:0});
    
    let tdcs = JSON.parse(JSON.stringify(this.state.scheduledTDC)); //scheduleTDC
    const stop=blockDate.clone().add(light-1,"days");
    const harvest=stop.clone().add(1,"days");

    //tdcs=tdcs.filter((x) => moment(x.date).isBetween(moment(blockDate).startOf('day'), stop.endOf('day'), undefined, "[]")); 

    const isLast=tdcs.filter((x) => x.crop_id === crop.id).length === 0;
    if (isLast) {
      this.props.saveScheduleTDC(this.props.selectedCrop.id, tdcs,null);
    } else {
      this.props.saveScheduleTDC(this.props.selectedCrop.id, tdcs, harvest.format('YYYY-MM-DD HH:mm'));
    }
  }

  render() {
    const microgreens=this.props.microgreens;
    let weekNow= this.props.className==="month" ? this.props.weekNow : this.state.weekNow;
    const start=moment().week(weekNow).weekday(1).startOf('day');
    const finish=moment().week(weekNow).weekday(7).add(20,"days").endOf('day');
    
    const weekTDC=this.tdcDateRange(this.state.tdc,start,finish);
    const grpWeekTDCByDay = groupByDay(weekTDC,this.props.trays);
    const grpByFNDTrays = groupByFNDTrays(grpWeekTDCByDay, microgreens);

    const byShelves = this.renderByFND(grpByFNDTrays, 7);
    calcDatesCrop(this.props.crops, microgreens);
    const weekCrops = this.weekCrops(this.props.crops);

    const byMicrogreens = renderByMicrogreens(
      weekCrops,
      microgreens,
      7,
      null,
      weekNow,
      this.state.checkedItems,
      this.props.setSelectedCrop
    );
    weekNow=moment().week(this.props.className==="month" ? this.props.weekNow : this.state.weekNow);
    const [mon, tue, wed, thu, fri, sat, sun] = [
      JSON.parse(JSON.stringify(weekNow.weekday(1))),
      JSON.parse(JSON.stringify(weekNow.weekday(2))),
      JSON.parse(JSON.stringify(weekNow.weekday(3))),
      JSON.parse(JSON.stringify(weekNow.weekday(4))),
      JSON.parse(JSON.stringify(weekNow.weekday(5))),
      JSON.parse(JSON.stringify(weekNow.weekday(6))),
      JSON.parse(JSON.stringify(weekNow.weekday(7))),
    ];
    const filter = this.renderMicrogreensFilter();
    return (
      <div id="WeekView" className={this.props.className}>
        {this.props.className!=="month" ? 
        <div className="switchWrapper">
          <p>{this.state.toggleVal ? "MICROGREENS" : "PÓŁKI"}</p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleView}></input>
            <span className="slider-green"></span>
          </label>
        </div>:''}
        {this.props.className!=="month" ? <div className="filter">{filter}</div>:''}
        <div className="control-row">
          {this.state.weekNow > 1  && this.props.className!=="month" ?  (
            <div onClick={this.minusWeek} className="back">{"<<"}</div>
          ) : (
            <div></div>
          )}
          <div>{this.state.weekNow}</div>
          {this.state.weekNow <= 52 && this.props.className!=="month"? (
            <div onClick={this.plusWeek} className="next">{">>"}</div>
          ) : (
            <div></div>
          )}
        </div>
        {this.props.className!=="month"?<div className="head">
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pon</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Wt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Śr</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Czw</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Sob</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Ndz</div>
        </div>:''}
        <div className="head-2 row">
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(mon)}>
            {moment(mon).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(tue)}>
            {moment(tue).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(wed)}>
            {moment(wed).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(thu)}>
            {moment(thu).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(fri)}>
            {moment(fri).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(sat)}>
            {moment(sat).format("DD.MM")}
          </div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }} onClick={() => this.showDayView(sun)}>
            {moment(sun).format("DD.MM")}
          </div>
        </div>

        {this.state.toggleVal ? (
          <div className="viewWrapper">{byShelves}</div>
        ) : (
          <div className="viewWrapper">{byMicrogreens}</div>
        )}
        {this.props.className === "scheduleCrop" ? <div id="saveScheduleDiv">
          <button onClick={this.saveScheduleTDC}>Zapisz</button>
        </div> : (
          ""
        )}
      </div>
    );
  }
}

export default WeekView;
