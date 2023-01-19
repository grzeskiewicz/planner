import React from 'react';
import moment from 'moment';
import './WeekView.css';
import {calcDatesCrop,renderByShelves, renderByMicrogreens} from './ViewCommon';

class WeekView extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        weekNow:moment().weeks(),
        toggleVal:true,
        checkedItems:this.setChecked(),
      }
      this.minusWeek=this.minusWeek.bind(this);
      this.plusWeek=this.plusWeek.bind(this);
      this.weekCrops=this.weekCrops.bind(this);
      this.showDayView=this.showDayView.bind(this);
      this.toggleView=this.toggleView.bind(this);
this.handleCheck=this.handleCheck.bind(this);
  }


   weekCrops(crops){ //crops which are during selected week
    const weekNowMon=moment().week(this.state.weekNow).weekday(1).startOf('day');
    const weekNowSun=moment().week(this.state.weekNow).weekday(7).endOf('day');
    const weekCrops=[];
    for (const crop of crops){
      if((weekNowMon.isSameOrBefore(moment(crop.harvest)) && weekNowSun.isSameOrAfter(moment(crop.start)))) {
        weekCrops.push(crop);
      }
    }
    return weekCrops;
  }

  minusWeek(){
    this.setState({weekNow:this.state.weekNow-1})
  }

  plusWeek(){
    this.setState({weekNow:this.state.weekNow+1})
  }


  showDayView(day){
    this.props.setSelectedDay(day);
  }

  toggleView(){
    this.setState({toggleVal:!this.state.toggleVal});
  }



      setChecked(){
        const checkedItems=new Map();
        for (const item of this.props.microgreens){
          checkedItems.set(item.name_pl, true)
        }
        return checkedItems;
      }

      handleCheck = (e) => {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState((prevState) => ({
          checkedItems: prevState.checkedItems.set(item, isChecked),
        }));
      }

      renderMicrogreensFilter(){
        return this.props.microgreens.map((microgreen,index)=> {
    return <div style={{backgroundColor:microgreen.color}}>
      <input key={microgreen.id} checked={this.state.checkedItems.get(microgreen.name_pl)} onChange={this.handleCheck} type="checkbox" name={microgreen.name_pl}/>
      <p>{microgreen.name_pl}</p></div>
        });
      }

render(){
  const weekNow=moment().week(this.state.weekNow);
  calcDatesCrop(this.props.crops,this.props.microgreens);
  const weekCrops=this.weekCrops(this.props.crops);

  const week=renderByMicrogreens(weekCrops,this.props.microgreens,this.props.shelves,7,null,weekNow,this.state.checkedItems);
  const weekShelves=renderByShelves(weekCrops,this.props.microgreens,this.props.shelves,7,null,weekNow,this.state.checkedItems);

const [mon,tue,wed,thu,fri,sat,sun]=[JSON.parse(JSON.stringify(weekNow.weekday(1))),JSON.parse(JSON.stringify(weekNow.weekday(2))),JSON.parse(JSON.stringify(weekNow.weekday(3))),
  JSON.parse(JSON.stringify(weekNow.weekday(4))),JSON.parse(JSON.stringify(weekNow.weekday(5))),
  JSON.parse(JSON.stringify(weekNow.weekday(6))),JSON.parse(JSON.stringify(weekNow.weekday(7)))]
  const filter=this.renderMicrogreensFilter();
  return (
    <div id="WeekView">
<div className='switchWrapper'>
      <p>{this.state.toggleVal ? 'Microgreens':'Półki'}</p>
      <label className='switch'>
  <input type="checkbox" onChange={this.toggleView}></input>
  <span className='slider-green'></span>
</label>
</div>
<div className='filter'>{filter}</div>
  <div className='control-row'>{this.state.weekNow>1 ?<div onClick={this.minusWeek} className="back">{"<<"}</div>:<div></div>}<div>{this.state.weekNow-1}</div>{this.state.weekNow<=52 ? <div onClick={this.plusWeek} className="next">{">>"}</div>:<div></div>}</div>
  <div className='head'>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Pon</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Wt</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Śr</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Czw</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Pt</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Sob</div>
    <div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}}>Ndz</div>
    </div>
<div className='head-2 row'>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(mon)}>{moment(mon).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(tue)}>{moment(tue).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(wed)}>{moment(wed).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(thu)}>{moment(thu).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(fri)}>{moment(fri).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(sat)}>{moment(sat).format('DD.MM')}</div>
<div style={{'flexBasis':parseFloat(100/7).toFixed(2)+"%"}} onClick={()=>this.showDayView(sun)}>{moment(sun).format('DD.MM')}</div>
</div>

  {this.state.toggleVal ? <div className='viewWrapper'>{weekShelves}</div>:<div className='viewWrapper'>{week}</div>}
        
    </div>
  );
}
}


export default WeekView;
 