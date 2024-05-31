import "./Microgreens.css";
import React from "react";
import { API_URL, request } from "./APIConnection";
import Microgreen from "./Microgreen";
import { isMobile } from 'react-device-detect';


class Microgreens extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameEN = this.handleNameEN.bind(this);
    this.handleNamePL = this.handleNamePL.bind(this);
    this.handleGramsTray = this.handleGramsTray.bind(this);
    this.handleBlackout = this.handleBlackout.bind(this);
    this.handleWeighting = this.handleWeighting.bind(this);
    this.handleExposure = this.handleExposure.bind(this);
    this.handleWateringLevel = this.handleWateringLevel.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.addMicrogreens = this.addMicrogreens.bind(this);
    this.setSelectedMicrogreens = this.setSelectedMicrogreens.bind(this);
    this.editMicrogreens = this.editMicrogreens.bind(this);

    this.state = {
      nameEN: '',
      namePL: '',
      gramsTray: '',
      wateringLevel:'',
      weight: '',
      blackout: '',
      light: '',
      color: '',
      selectedMicrogreens: '',
      showAMF: false
    };
  }

  refreshMicrogreens() {
    this.props.refreshMicrogreens();
  }

  setSelectedMicrogreens(id) {
    this.setState({ selectedMicrogreens: id });
  }

  addMicrogreens(event) {
    event.preventDefault();
    const microgreensData = this.state;
    fetch(request(`${API_URL}/addmicrogreens`, "POST", microgreensData))
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          this.props.refreshMicrogreens();
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error))
  }


  editMicrogreens(microgreensData) {
    console.log(microgreensData);
    fetch(request(`${API_URL}/editmicrogreens`, "POST", microgreensData))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          this.props.refreshMicrogreens();
          this.setState({ selectedMicrogreens: '' });
        } else {
          alert("SQL Error - powtarzające się nazwy lub błędne wartości!")
        }
      })
      .catch((error) => Promise.reject(new Error(error))); //Promise.reject(new Error(error)) */
  }

  handleNameEN(event) {
    this.setState({ nameEN: event.target.value });
  }

  handleNamePL(event) {
    this.setState({ namePL: event.target.value });
  }
  handleGramsTray(event) {
    this.setState({ gramsTray: event.target.value });
  }
  handleWateringLevel(event) {
    this.setState({ wateringLevel: event.target.value });
  }


  handleWeighting(event) {
    this.setState({ weight: event.target.value });
  }

  handleBlackout(event) {
    this.setState({ blackout: event.target.value });
  }

  handleExposure(event) {
    this.setState({ light: event.target.value });
  }

  handleColor(event) {
    console.log(event.target.value);
    this.setState({ color: event.target.value });
  }

  renderMicrogreensTable() {
    return this.props.microgreens.map((microgreen, index) => {
      return <Microgreen editMicrogreens={this.editMicrogreens} selectedMicrogreens={this.state.selectedMicrogreens} setSelectedMicrogreens={this.setSelectedMicrogreens} microgreen={microgreen} key={index} index={index}></Microgreen>
    });
  }




  render() {
    let microgreensTable;
    if (this.props.microgreens !== '') microgreensTable = this.renderMicrogreensTable();
    const microgreensListTable = <div id="microgreens-list">
        <div className="head">
         <div>Nazwa</div><div>Name</div><div>Taca[g]</div><div>{isMobile ? 'Nawodnienie' : 'Nawodnienie'}</div><div>{isMobile ? 'Obciąż.' : 'Obciążanie [dni]'}</div><div>{isMobile ? 'Black.' : 'Blackout [dni]'}</div><div>{isMobile ? 'Naśw.' : 'Naświetlanie [dni]'}</div><div>Całość [dni]</div><div>Kolor</div>
        </div>
        <div className="body">
          {microgreensTable}
        </div>
    </div>;
    const addMicrogreensForm = <form className="" onSubmit={this.addMicrogreens}>
      <input placeholder='Nazwa (ENG)' value={this.state.nameEN} onChange={this.handleNameEN} required></input>
      <input placeholder='Nazwa (PL)' value={this.state.namePL} onChange={this.handleNamePL} required></input>
      <input placeholder='Taca waga [g]' value={this.state.gramsTray} onChange={this.handleGramsTray} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input placeholder={isMobile ? 'Nawodnienie' : 'Nawodnienie'} value={this.state.watering_level} onChange={this.handleWateringLevel} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input placeholder={isMobile ? 'Obciąż.' : 'Obciążanie [dni]'} value={this.state.weight} onChange={this.handleWeighting} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input placeholder={isMobile ? 'Black.' : 'Blackout [dni]'} value={this.state.blackout} onChange={this.handleBlackout} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input placeholder={isMobile ? 'Naśw.' : 'Naświetlanie [dni]'} value={this.state.light} onChange={this.handleExposure} required pattern="^\d+$" title="Wprowadź liczbę"></input>
      <input id="microgreens-color-picker" placeholder='Kolor' value={this.state.color} onChange={this.handleColor} type="color"></input>
      <button type='submit'>DODAJ</button>
      {this.state.error !== '' ? <p className="error">{this.state.error}</p> : ''}
    </form>;
   // console.log(isMobile)

    return <div className="Microgreens">
      <div id="addMicrogreens">
        {isMobile ? <div className="amfWrapper"><button onClick={() => this.setState({ showAMF: !this.state.showAMF })}>{this.state.showAMF ? "ANULUJ" : "DODAJ MICROGREENS"}</button>{this.state.showAMF ? <div>{addMicrogreensForm}</div> : ''}</div> : <div>{addMicrogreensForm }</div>}
      </div>

      {!isMobile ? microgreensListTable: ''}
      {isMobile && !this.state.showAMF? microgreensListTable:''}
    </div>;
  }
}

export default Microgreens;
