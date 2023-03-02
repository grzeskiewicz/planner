import './App.css';
import React from 'react';
import Microgreens from './Microgreens';
import Crops from './Crops';
import WeekView from './WeekView';
import { API_URL, request } from './APIConnection';
import MonthView from './MonthView';
import DayView from './DayView';

//TODO: poprawic renderowanie selectów, weekView, monthView, 
class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        microgreens:'', 
        crops:'',
        shelves:'',
        selectedDay:false,
        markedCrop:''
      }
      this.showMicrogreensTab=this.showMicrogreensTab.bind(this);
      this.showAddCropTab=this.showAddCropTab.bind(this);
      this.showWeekTab=this.showWeekTab.bind(this);
      this.showMonthTab=this.showMonthTab.bind(this);
      this.setSelectedDay=this.setSelectedDay.bind(this);
      this.getCrops=this.getCrops.bind(this);
      this.getMicrogreens=this.getMicrogreens.bind(this);
      this.setSelectedCrop=this.setSelectedCrop.bind(this);
  }

  componentDidMount(){
    this.getMicrogreens().then((microgreens=>{
this.getShelves().then((shelves)=>{
  this.getCrops().then((crops)=>{
this.setState({shelves:shelves}); 
})
})
    }));
  }


  getMicrogreens(){
     return fetch(request(`${API_URL}/microgreens`, 'GET'))
    .then(res => res.json())
    .then(result => { 
      this.setState({microgreens:result});
      return result;}).catch(error => Promise.reject(new Error(error))); 
  }
  
  getShelves(){
  return fetch(request(`${API_URL}/shelves`, 'GET'))
    .then(res => res.json())
    .then(result =>result).catch(error => Promise.reject(new Error(error))); 
  }

  getCrops() {
  return fetch(request(`${API_URL}/crops`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({crops:result});
        return result;
    
    }); 
  }
showMicrogreensTab(){
this.setState({tab:3});
}

showAddCropTab(){
  this.setState({tab:0});
}

showWeekTab(){
  this.setState({tab:1});
}

showMonthTab(){
  this.setState({tab:2});
}

setSelectedDay(day){
  console.log(day);
  this.setState({selectedDay:day});
}

setSelectedCrop(crop){
  this.setState({markedCrop:crop,tab:0});
}

render(){
  return (
    <div className="App">
      <div id="menu">
<div id="add-crops-tab" onClick={this.showAddCropTab}><p>Zasiewy</p></div>
<div id="crops-week-tab" onClick={this.showWeekTab}><p>Widok [Tydzień]</p></div>
<div id="crops-month-tab" onClick={this.showMonthTab}><p>Widok [Miesiąc]</p></div>
<div id="microgreens-tab" onClick={this.showMicrogreensTab}><p>Microgreens</p></div>
      </div>
      <div id="board">
{this.state.microgreens !=='' && this.state.tab===0 ? <Crops microgreens={this.state.microgreens} crops={this.state.crops} shelves={this.state.shelves} refreshCrops={this.getCrops} markedCrop={this.state.markedCrop}></Crops>: null}
{this.state.crops !=='' && this.state.tab===1 ? <WeekView shelves={this.state.shelves} microgreens={this.state.microgreens} crops={this.state.crops} setSelectedDay={this.setSelectedDay} setSelectedCrop={this.setSelectedCrop}></WeekView>:null}
{this.state.crops !=='' && this.state.tab===2? <MonthView shelves={this.state.shelves} microgreens={this.state.microgreens} crops={this.state.crops} setSelectedDay={this.setSelectedDay} setSelectedCrop={this.setSelectedCrop}></MonthView>:null}
{this.state.microgreens !=='' && this.state.tab===3 ? <Microgreens microgreens={this.state.microgreens} refreshMicrogreens={this.getMicrogreens}></Microgreens> : null}
{this.state.crops !=='' && this.state.selectedDay ? <DayView selectedDay={this.state.selectedDay} setSelectedDay={this.setSelectedDay} crops={this.state.crops} microgreens={this.state.microgreens}></DayView>:''}
</div>
    </div>
  );
}
}

export default App;
