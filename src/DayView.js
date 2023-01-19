import React from 'react';
import moment from 'moment';
import './DayView.css'
class DayView extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
      }
      this.closeWindow=this.closeWindow.bind(this);
  }

  closeWindow(){
    this.props.setSelectedDay(false);
  }



  whichStage(day,crop){
    const start=moment(crop.start);
    const blackoutStart=moment(crop.blackoutStart);
    const lightExposureStart=moment(crop.lightExposureStart);
    const harvest=moment(crop.harvest);
    let stage=false; 
    //is given day on one of the stages:
    if (day.isSame(start,'day')) stage="S";
    if (day.isBetween(start.endOf('day'),blackoutStart.startOf('day'))) stage="WG";
    if (day.isBetween(blackoutStart.startOf('day'),lightExposureStart.startOf('day'))) stage="BL";
    if (day.isBetween(lightExposureStart.startOf('day'),harvest.startOf('day'))) stage="LE"
    if (day.isSame(harvest,'day')) stage="H";
    return stage;
  }

  calcDatesCrop(crops){
    for (const crop of crops){
      const microgreen=this.props.microgreens.find((x)=> x.id===crop.microgreen_id);
      const lightExposureStart=moment(crop.harvest).subtract(microgreen.light, "days");
      const blackoutStart=moment(lightExposureStart).subtract(microgreen.blackout, "days");
      const start=moment(blackoutStart).subtract(microgreen.weight, "days");
      crop.lightExposureStart=lightExposureStart.format('YYYY-MM-DD HH:mm');
      crop.blackoutStart=blackoutStart.format('YYYY-MM-DD HH:mm');
      crop.start=start.format('YYYY-MM-DD HH:mm');
    }
   }

   dayCrops(crops){ //crops which are during selected day
    const dayStart=moment(this.props.selectedDay).startOf('day');
    const dayEnd=moment(this.props.selectedDay).endOf('day');
    const dayCrops=[];
    for (const crop of crops){
      if((dayStart.isSameOrBefore(moment(crop.harvest)) && dayEnd.isSameOrAfter(moment(crop.start)))) {
        dayCrops.push(crop);
      }
    }
    return dayCrops;
  }

  renderDay(crops){
    const microgreens=this.props.microgreens;
    const rows=[];
    //const stages=["S","BL","LE","H"];
    const seedingStage=[];
    const blackoutStart=[];
    const exposureStart=[];
    const harvestStage=[]

      for (const crop of crops){     
        const microgreen=microgreens.find((x)=> x.id===crop.microgreen_id);
        const stageOfDay=this.whichStage(moment(this.props.selectedDay),crop);
        if (stageOfDay==="S" ) seedingStage.push(<p key={crop.id}>{microgreen.name_pl}</p>);
        if (stageOfDay==="BL" && moment(this.props.selectedDay).isSame(moment(crop.blackoutStart),'day')) blackoutStart.push(<p key={crop.id}>{microgreen.name_pl}</p>);
        if (stageOfDay==="LE" && moment(this.props.selectedDay).isSame(moment(crop.lightExposureStart),'day')) exposureStart.push(<p key={crop.id}>{microgreen.name_pl}</p>);
        if (stageOfDay==="H" ) harvestStage.push(<p key={crop.id}>{microgreen.name_pl}</p>);
    }

rows.push(<fieldset key={0}><legend>SEEDING</legend>{seedingStage}</fieldset>);
rows.push(<fieldset key={1}><legend>BLACKOUT</legend>{blackoutStart}</fieldset>);
rows.push(<fieldset key={2}><legend>LIGHT EXPOSURE</legend>{exposureStart}</fieldset>);
rows.push(<fieldset key={3}><legend>HARVEST</legend>{harvestStage}</fieldset>);
if (seedingStage.length===0 && blackoutStart.length===0 && exposureStart.length===0 && harvestStage.length===0) {
return <div>BRAK ZADAŃ NA DZIEŃ</div>
} else {
return rows;
  }
    }


render(){
  this.calcDatesCrop(this.props.crops);
  const cropsRender=this.renderDay(this.props.crops);
  
  return (
    <div className="DayView">
      <div className="ModalContent">
      <span className="close" onClick={this.closeWindow}>
            &times;
        </span>
        <div>{cropsRender}</div>

    </div>
    </div>
  );}
}


export default DayView;
