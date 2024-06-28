import React from 'react';
import moment from 'moment';
import './MonthView.css';
import WeekView from './WeekView';

import { calcDatesCrop, renderByMicrogreens } from './ViewCommon';


class MonthView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthNow: moment().month(),
      checkedItems: this.setChecked(),
      toggleVal: true
    }
    this.minusMonth = this.minusMonth.bind(this);
    this.plusMonth = this.plusMonth.bind(this);
    this.monthCrops = this.monthCrops.bind(this);
    this.renderHead = this.renderHead.bind(this);
    this.showDayView = this.showDayView.bind(this);
    this.toggleView = this.toggleView.bind(this);
  }

  componentDidMount() {
  }

  setChecked() {
    const checkedItems = new Map();
    for (const item of this.props.microgreens) {
      checkedItems.set(item.name_pl, true)
    }
    return checkedItems;
  }

  showDayView(day) {
    this.props.setSelectedDay(day);
  }

  monthCrops(crops) { //crops which are during selected Month
    const monthNowFirst = moment().month(this.state.monthNow).startOf('month');
    const monthNowLast = moment().month(this.state.monthNow).endOf('month');
    const monthCrops = [];
    for (const crop of crops) {
      if ((monthNowFirst.isSameOrBefore(moment(crop.harvest)) && monthNowLast.isSameOrAfter(moment(crop.start)))) {
        monthCrops.push(crop);
      }
    }
    return monthCrops;
  }

  minusMonth() {
    this.setState({ monthNow: this.state.monthNow - 1 })
  }

  plusMonth() {
    this.setState({ monthNow: this.state.monthNow + 1 })
  }




  renderHead() {
    const monthNow = moment().month(this.state.monthNow);
    const days = monthNow.daysInMonth();
    const month = [];
    for (let i = 1; i <= days; i++) {
      month.push(moment(monthNow).set('date', i));
    }
    return month.map((day, index) => {
      const dayViewDate = JSON.parse(JSON.stringify(day));
      return <div key={index} onClick={() => this.showDayView(dayViewDate)}>{day.format('D')}</div>
    });
  }

  renderMicrogreensFilter() {
    return this.props.microgreens.map((microgreen, index) => {
      return <div style={{ backgroundColor: microgreen.color }}>
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
       </div>
    });
  }

  handleCheck = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkedItems: prevState.checkedItems.set(item, isChecked),
    }));
  }

  toggleView() {
    this.setState({ toggleVal: !this.state.toggleVal });
  }

  //=======================================================================================================


  render() {
    const orders=this.props.orders;
    const customers=this.props.customers;
    calcDatesCrop(this.props.crops, this.props.microgreens);
    const monthCrops = this.monthCrops(this.props.crops);
    const monthNow = moment().month(this.state.monthNow);
    const days = monthNow.daysInMonth();

    const firstDayMonth=monthNow.clone().startOf('month').set({hours:12});
    const firstDayMonthWeek=firstDayMonth.isoWeek();
    const lastDayMonth=monthNow.clone().endOf('month').set({hours:12});
    const lastDayMonthWeek=lastDayMonth.isoWeek();

   
  const monthViewGrp=[];
    for (let i=firstDayMonthWeek;i<=lastDayMonthWeek;i++){
monthViewGrp.push(<WeekView customers={this.props.customers} orders={this.props.orders} className="month" weekNow={i} trays={this.props.trays} tdc={this.props.tdc} microgreens={this.props.microgreens} 
crops={this.props.crops} setSelectedDay={this.props.setSelectedDay} setSelectedCrop={this.props.setSelectedCrop}></WeekView>)
    }

    const byShelves=<div>{monthViewGrp}</div>

    const head = this.renderHead();
    const filter = this.renderMicrogreensFilter();
    //here pass the function for setSelectedCrop for App.js
    const month = renderByMicrogreens(monthCrops, this.props.microgreens, days, monthNow, null, this.state.checkedItems, this.props.setSelectedCrop,orders,customers);
    return (
      <div id="MonthView">
        <div className='switchWrapper'>
          <p>{this.state.toggleVal ? 'MICROGREENS' : 'PÓŁKI'}</p>
          <label className='switch'>
            <input type="checkbox" onChange={this.toggleView}></input>
            <span className='slider-green'></span>
          </label>
        </div>
        <div className='filter'>{filter}</div>
        <div className='control-row'>{this.state.monthNow > 0 ? <div onClick={this.minusMonth} className="back">{"<<"}</div> : <div></div>}<div>{this.state.monthNow + 1}</div>{this.state.monthNow <= 10 ? <div onClick={this.plusMonth} className="next">{">>"}</div> : <div></div>}</div>
        {this.state.toggleVal ?
          <div className='viewWrapper'>
      <div className="head">
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pon</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Wt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Śr</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Czw</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Pt</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Sob</div>
          <div style={{ flexBasis: parseFloat(100 / 7).toFixed(2) + "%" }}>Ndz</div>
        </div>
            <div className='monthCrops'>{byShelves}</div></div> :
          <div className='viewWrapper'>
            <div className='head'>{head}</div>
            <div className='monthCrops'>{month}</div></div>}
      </div>
    );
  }
}


export default MonthView;
