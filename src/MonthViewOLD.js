import React from 'react';
import moment from 'moment';
import FNDTray from "./FNDTray";
import './MonthView.css';

import { calcDatesCrop, renderByMicrogreens, groupByShelves, groupByDay, groupByFNDTrays  } from './ViewCommon';


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
        <input key={microgreen.id} checked={this.state.checkedItems.get(microgreen.name_pl)} onChange={this.handleCheck} type="checkbox" name={microgreen.name_pl} />
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

  toggleView() {
    this.setState({ toggleVal: !this.state.toggleVal });
  }


  //=============================================================================================

  //START TUTAJ SPRAWDZANIA
  monthTDC(tdc, days) { //crops which are during selected week
    const monthNowFirst = moment().month(this.state.monthNow).startOf('month');
    const monthNowLast = moment().month(this.state.monthNow).endOf('month');
    const monthTDCArr = [];
    for (const entry of tdc) {
      if (moment(entry.date).isBetween(monthNowFirst, monthNowLast, undefined, '[]')) {
        let entryCp = JSON.parse(JSON.stringify(entry));
        let entryDate = moment(entryCp.date);
        entryCp.date = entryDate.format('DD.MM.YYYY');
        monthTDCArr.push(entry);
      }
    }
    const grpMonthTDC = groupByDay(monthTDCArr,this.props.trays);
    const grpByFNDTrays = groupByFNDTrays(grpMonthTDC, this.props.microgreens);
    return this.renderByFND2(grpByFNDTrays, days);
  }

  //=======================================================================================================



  createShelf2(grpByShelves, days, n) {
    const fndtrays=this.props.fndtrays;
    let row = [];
    if (grpByShelves) {
      for (let i = 0; i < days; i++) {
        row.push(<div className="shelf" style={{ flexBasis: parseFloat(100 / days).toFixed(2) + "%" }}>
          <FNDTray fndtrays={fndtrays} range="month" tray={grpByShelves[i][n][0]} pos="L"></FNDTray>
          <FNDTray fndtrays={fndtrays} range="month" tray={grpByShelves[i][n][1]} pos="P"></FNDTray>
        </div>)
      }
      return <div className="row">{row}</div>;
    } else { return <div className="row">{row}</div> }
  }


  createRack2(grpByShelves, days) {
    const rack = (
      <div className="rack">
        {this.createShelf2(grpByShelves, days, 0)}
        {this.createShelf2(grpByShelves, days, 1)}
        {this.createShelf2(grpByShelves, days, 2)}
        {this.createShelf2(grpByShelves, days, 3)}
      </div>
    );
    return rack;
  }


  renderByFND2(grpByFNDT, days) {
    const arr = [];

    for (let i = 0; i < days; i++) {
      const grpByShelves = groupByShelves(grpByFNDT[i]);
      if (grpByShelves !== undefined) arr.push(grpByShelves);
    }
    if (arr.length > 0) {
      const rack = this.createRack2(arr, days);
      return rack;
    } else {
      // console.log(arr);
    };
  }



  render() {
    calcDatesCrop(this.props.crops, this.props.microgreens);
    const monthCrops = this.monthCrops(this.props.crops);
    const monthNow = moment().month(this.state.monthNow);
    const days = monthNow.daysInMonth();
    const byShelves = this.monthTDC(this.props.tdc, days);


    const head = this.renderHead();
    const filter = this.renderMicrogreensFilter();
    //here pass the function for setSelectedCrop for App.js
    const month = renderByMicrogreens(monthCrops, this.props.microgreens, days, monthNow, null, this.state.checkedItems, this.props.setSelectedCrop);
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
            <div className='head'>{head}</div>
            <div className='monthCrops'>{byShelves}</div></div> :
          <div className='viewWrapper'>
            <div className='head'>{head}</div>
            <div className='monthCrops'>{month}</div></div>}
      </div>
    );
  }
}


export default MonthView;
