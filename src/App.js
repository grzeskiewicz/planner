import './App.css';
import React from 'react';
import Microgreens from './Microgreens';
import Crops from './Crops';
import WeekView from './WeekView';
import Devices from './Devices';
import { API_URL, request } from './APIConnection';
import MonthView from './MonthView';
import DayView from './DayView';
import { isMobile } from 'react-device-detect';


//TODO: poprawic renderowanie selectów, weekView, monthView, 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      microgreens: '',
      crops: '',
      selectedDay: false,
      markedCrop: '',
      trays: '',
      isReady: false
    }
    this.showMicrogreensTab = this.showMicrogreensTab.bind(this);
    this.showAddCropTab = this.showAddCropTab.bind(this);
    this.showWeekTab = this.showWeekTab.bind(this);
    this.showMonthTab = this.showMonthTab.bind(this);
    this.showDevicesTab = this.showDevicesTab.bind(this);
    this.setSelectedDay = this.setSelectedDay.bind(this);
    this.getCrops = this.getCrops.bind(this);
    this.getMicrogreens = this.getMicrogreens.bind(this);
    this.setSelectedCrop = this.setSelectedCrop.bind(this);
    this.getTrayDateCrops = this.getTrayDateCrops.bind(this);
    this.getTrays = this.getTrays.bind(this);
  }

  componentDidMount() {
    
    this.getMicrogreens().then((microgreens => {
      this.getCrops().then((crops) => {
        this.getTrays().then((trays) => {
          this.getFNDTrays().then((fndtrays) => {
            this.getTrayDateCrops().then((crops) => {
              console.log("DANE POBRANE Z DB");
              this.setState({ isReady: true })
            });
          })
        })
      })
    }));
  }


  getMicrogreens() {
    return fetch(request(`${API_URL}/microgreens`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({ microgreens: result });
        return result;
      });
  //   }).catch(error => Promise.reject(new Error(error)));
  }

  getTrays() {
    return fetch(request(`${API_URL}/trays`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({ trays: result });
        return result;
      });
  }

  getFNDTrays() {
    return fetch(request(`${API_URL}/fndtrays`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({ FNDTrays: result });
        return result;
      });
  }

  getCrops() {
    return fetch(request(`${API_URL}/crops`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({ crops: result });
        return result;
      });
  }

  getTrayDateCrops() {
    return fetch(request(`${API_URL}/traydatecrops`, 'GET'))
      .then(res => res.json())
      .then(result => {
        this.setState({ traydatecrops: result });
        return result;
      });
  }
  showMicrogreensTab() {
    this.setState({ tab: 3 });
  }

  showAddCropTab() {
    this.setState({ tab: 0 });
  }

  showWeekTab() {
    this.setState({ tab: 1 });
  }

  showMonthTab() {
    this.setState({ tab: 2 });
  }

  showDevicesTab() {
    this.setState({ tab: 4 });
  }

  setSelectedDay(day) {
    console.log(day);
    this.setState({ selectedDay: day });
  }

  setSelectedCrop(crop) {
    this.setState({ markedCrop: crop, tab: 0 });
  }

  render() {
    const isReady = this.state.isReady;

    if (isReady) {
      return <div className="App">
        <div id="menu">
          <div id="add-crops-tab" onClick={this.showAddCropTab}><p>ZASIEWY</p></div>
          <div id="crops-week-tab" onClick={this.showWeekTab}><p>{isMobile ? '[7]' : 'Widok [TYDZIEŃ]'}</p></div>
          <div id="crops-month-tab" onClick={this.showMonthTab}><p>{isMobile ? '[MSC]' : 'WIDOK [MIESIĄC]'}</p></div>
          <div id="microgreens-tab" onClick={this.showMicrogreensTab}><p>MICROGREENS</p></div>
          <div id="microgreens-tab" onClick={this.showDevicesTab}><p>URZĄDZENIA</p></div>
        </div>
        <div id="board">
          {this.state.microgreens !== '' && this.state.tab === 0 ? <Crops trays={this.state.trays} microgreens={this.state.microgreens} crops={this.state.crops} tdc={this.state.traydatecrops} refreshTDC={this.getTrayDateCrops} refreshCrops={this.getCrops} markedCrop={this.state.markedCrop} setSelectedDay={this.setSelectedDay} setSelectedCrop={this.setSelectedCrop}></Crops> : null}
          {this.state.crops !== '' && this.state.tab === 1 ? <WeekView className="main" trays={this.state.trays} tdc={this.state.traydatecrops} microgreens={this.state.microgreens} crops={this.state.crops} setSelectedDay={this.setSelectedDay} setSelectedCrop={this.setSelectedCrop}></WeekView> : null}
          {this.state.crops !== '' && this.state.tab === 2 ? <MonthView fndtrays={this.state.FNDTrays} trays={this.state.trays} tdc={this.state.traydatecrops} microgreens={this.state.microgreens} crops={this.state.crops} setSelectedDay={this.setSelectedDay} setSelectedCrop={this.setSelectedCrop}></MonthView> : null}
          {this.state.microgreens !== '' && this.state.tab === 3 ? <Microgreens microgreens={this.state.microgreens} refreshMicrogreens={this.getMicrogreens}></Microgreens> : null}
          {this.state.tab === 4 ? <Devices></Devices> : null}

          {this.state.crops !== '' && this.state.selectedDay ? <DayView tdc={this.state.traydatecrops} selectedDay={this.state.selectedDay} setSelectedDay={this.setSelectedDay} crops={this.state.crops} microgreens={this.state.microgreens}></DayView> : ''}
        </div>
      </div>
    } else {
      return <div id="LoaderContainer"><div id="Loader"></div></div>
    }

  }
}


export default App;
