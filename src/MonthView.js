import React from 'react';
import moment from 'moment';
import './MonthView.css';

import {calcDatesCrop,renderByShelves, renderByMicrogreens} from './ViewCommon';


class MonthView extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        monthNow:moment().month(),
        checkedItems:this.setChecked(),
        toggleVal:true
      }
      this.minusMonth=this.minusMonth.bind(this);
      this.plusMonth=this.plusMonth.bind(this);
      this.monthCrops=this.monthCrops.bind(this);
      this.renderHead=this.renderHead.bind(this);
      this.showDayView=this.showDayView.bind(this);
      this.toggleView=this.toggleView.bind(this);
  }

  componentDidMount(){
  }

  setChecked(){
    const checkedItems=new Map();
    for (const item of this.props.microgreens){
      checkedItems.set(item.name_pl, true)
    }
    return checkedItems;
  }

  showDayView(day){
    this.props.setSelectedDay(day);
  }

   monthCrops(crops){ //crops which are during selected Month
    const monthNowFirst=moment().month(this.state.monthNow).startOf('month');
    const monthNowLast=moment().month(this.state.monthNow).endOf('month');
    const monthCrops=[];
    for (const crop of crops){
      if((monthNowFirst.isSameOrBefore(moment(crop.harvest)) && monthNowLast.isSameOrAfter(moment(crop.start)))) {
        monthCrops.push(crop);
      }
    }
    return monthCrops;
  }

  minusMonth(){
    this.setState({monthNow:this.state.monthNow-1})
  }

  plusMonth(){
    this.setState({monthNow:this.state.monthNow+1})
  }




  renderHead(){
    const monthNow=moment().month(this.state.monthNow);
    const days=monthNow.daysInMonth();
    const month=[];
    for (let i=1;i<=days;i++){
    month.push(moment(monthNow).set('date',i));
    }
    return month.map((day,index)=> {
      const dayViewDate=JSON.parse(JSON.stringify(day));
   return <div key={index} onClick={()=>this.showDayView(dayViewDate)}>{day.format('D')}</div>
  });
  }

  renderMicrogreensFilter(){
    return this.props.microgreens.map((microgreen,index)=> {
return <div style={{backgroundColor:microgreen.color}}>
  <input key={microgreen.id} checked={this.state.checkedItems.get(microgreen.name_pl)} onChange={this.handleCheck} type="checkbox" name={microgreen.name_pl}/>
  <p>{microgreen.name_pl}</p></div>
    });
  }
  
  handleCheck = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  }

toggleView(){
  this.setState({toggleVal:!this.state.toggleVal});
}





render(){
  calcDatesCrop(this.props.crops,this.props.microgreens);
  const monthCrops=this.monthCrops(this.props.crops);
  const monthNow=moment().month(this.state.monthNow);
  const days=monthNow.daysInMonth();

  const head=this.renderHead();
  const filter=this.renderMicrogreensFilter();
//here pass the function for setSelectedCrop for App.js
  const month=renderByMicrogreens(monthCrops,this.props.microgreens,this.props.shelves,days,monthNow,null,this.state.checkedItems,this.props.setSelectedCrop);
  const monthShelves=renderByShelves(monthCrops,this.props.microgreens,this.props.shelves,days,monthNow,null,this.state.checkedItems,this.props.setSelectedCrop);
  return (
    <div id="MonthView">
      <div className='switchWrapper'>
      <p>{this.state.toggleVal ? 'Microgreens':'Półki'}</p>
      <label className='switch'>
  <input type="checkbox" onChange={this.toggleView}></input>
  <span className='slider-green'></span>
</label>
</div>
      <div className='filter'>{filter}</div>
  <div className='control-row'>{this.state.monthNow>0 ? <div onClick={this.minusMonth} className="back">{"<<"}</div>:<div></div>}<div>{this.state.monthNow+1}</div>{this.state.monthNow<=10 ? <div onClick={this.plusMonth} className="next">{">>"}</div>:<div></div>}</div>
  {this.state.toggleVal ?  
  <div className='viewWrapper'>
    <div className='head'>{head}</div>
    <div className='monthCrops'>{monthShelves}</div></div>:
    <div className='viewWrapper'>
    <div className='head'>{head}</div>
   <div className='monthCrops'>{month}</div></div>}
    </div>
  );
}
}


export default MonthView;
